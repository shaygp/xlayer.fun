// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IRegistry.sol";
import "./libraries/BondingCurve.sol";

contract BondingCurveContract is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    struct TokenCurve {
        uint256 soldSupply;
        uint256 okbCollected;
        uint256 virtualOkbReserves;
        uint256 virtualTokenReserves;
        bool graduated;
        bool active;
    }
    
    IRegistry public registry;
    
    mapping(address => TokenCurve) public tokenCurves;
    mapping(address => uint256) public tokenBalances;
    
    uint256 public constant GRADUATION_THRESHOLD = 80 * 10**18;
    uint256 public constant MAX_SUPPLY_FOR_CURVE = 800_000_000 * 10**18;
    uint256 public constant DEFAULT_VIRTUAL_OKB = 30 * 10**18;
    uint256 public constant DEFAULT_VIRTUAL_TOKENS = 1_073_000_000 * 10**18;
    
    event TokenBought(
        address indexed token,
        address indexed buyer,
        uint256 okbIn,
        uint256 tokensOut,
        uint256 newPrice
    );
    
    event TokenSold(
        address indexed token,
        address indexed seller,
        uint256 tokensIn,
        uint256 okbOut,
        uint256 newPrice
    );
    
    event CurveParametersUpdated(
        address indexed token,
        uint256 virtualOkbReserves,
        uint256 virtualTokenReserves
    );
    
    event TokenGraduated(address indexed token, uint256 okbCollected);
    
    modifier onlyValidToken(address token) {
        require(registry.isValidToken(token), "Invalid token");
        require(tokenCurves[token].active, "Curve not active");
        require(!tokenCurves[token].graduated, "Token graduated");
        _;
    }
    
    constructor(address _registry) Ownable(msg.sender) {
        registry = IRegistry(_registry);
    }
    
    function initializeCurve(address token) external {
        require(registry.isValidToken(token), "Invalid token");
        require(!tokenCurves[token].active, "Curve already initialized");
        
        tokenCurves[token] = TokenCurve({
            soldSupply: 0,
            okbCollected: 0,
            virtualOkbReserves: DEFAULT_VIRTUAL_OKB,
            virtualTokenReserves: DEFAULT_VIRTUAL_TOKENS,
            graduated: false,
            active: true
        });
        
        uint256 initialTokens = IERC20(token).balanceOf(address(this));
        if (initialTokens > 0) {
            tokenBalances[token] = initialTokens;
        }
    }
    
    function getPrice(address token, uint256 amount) external view returns (uint256) {
        TokenCurve memory curve = tokenCurves[token];
        require(curve.active, "Curve not active");
        
        if (curve.graduated) return 0;
        
        uint256 virtualOkb = curve.virtualOkbReserves;
        uint256 virtualTokens = curve.virtualTokenReserves - curve.soldSupply;
        
        if (virtualTokens == 0 || amount == 0) return 0;
        
        return (virtualOkb * amount) / virtualTokens;
    }
    
    function buyTokens(address token, address user, uint256 okbAmount) 
        external 
        payable 
        nonReentrant 
        onlyValidToken(token) 
        returns (uint256) 
    {
        require(msg.value == okbAmount, "Incorrect OKB amount");
        require(okbAmount > 0, "Amount must be greater than 0");
        
        TokenCurve storage curve = tokenCurves[token];
        
        uint256 tokensOut = BondingCurve.calculateTokensOut(okbAmount, curve.soldSupply);
        require(tokensOut > 0, "No tokens available");
        require(curve.soldSupply + tokensOut <= MAX_SUPPLY_FOR_CURVE, "Exceeds curve limit");
        
        curve.soldSupply += tokensOut;
        curve.okbCollected += okbAmount;
        
        require(tokenBalances[token] >= tokensOut, "Insufficient token balance");
        tokenBalances[token] -= tokensOut;
        
        IERC20(token).safeTransfer(user, tokensOut);
        
        address feeManager = registry.getFeeManager();
        if (feeManager != address(0)) {
            (bool success, ) = feeManager.call{value: okbAmount}("");
            require(success, "Fee manager transfer failed");
        }
        
        uint256 newPrice = BondingCurve.calculatePrice(curve.soldSupply);
        emit TokenBought(token, user, okbAmount, tokensOut, newPrice);
        
        if (curve.okbCollected >= GRADUATION_THRESHOLD) {
            _graduateToken(token);
        }
        
        return tokensOut;
    }
    
    function sellTokens(address token, address user, uint256 tokenAmount) 
        external 
        nonReentrant 
        onlyValidToken(token) 
        returns (uint256) 
    {
        require(tokenAmount > 0, "Amount must be greater than 0");
        
        TokenCurve storage curve = tokenCurves[token];
        require(tokenAmount <= curve.soldSupply, "Cannot sell more than sold");
        
        uint256 okbOut = BondingCurve.calculateOkbOut(tokenAmount, curve.soldSupply);
        require(okbOut > 0, "No OKB to receive");
        require(address(this).balance >= okbOut, "Insufficient OKB balance");
        
        curve.soldSupply -= tokenAmount;
        curve.okbCollected -= okbOut;
        
        IERC20(token).safeTransferFrom(user, address(this), tokenAmount);
        tokenBalances[token] += tokenAmount;
        
        address feeManager = registry.getFeeManager();
        if (feeManager != address(0)) {
            (bool success, ) = feeManager.call{value: okbOut}("");
            require(success, "Fee manager transfer failed");
        } else {
            payable(user).transfer(okbOut);
        }
        
        uint256 newPrice = BondingCurve.calculatePrice(curve.soldSupply);
        emit TokenSold(token, user, tokenAmount, okbOut, newPrice);
        
        return okbOut;
    }
    
    function updateCurveParameters(
        address token,
        uint256 virtualOkbReserves,
        uint256 virtualTokenReserves
    ) external onlyOwner {
        require(tokenCurves[token].active, "Curve not active");
        require(!tokenCurves[token].graduated, "Token graduated");
        require(virtualOkbReserves > 0 && virtualTokenReserves > 0, "Invalid parameters");
        
        TokenCurve storage curve = tokenCurves[token];
        curve.virtualOkbReserves = virtualOkbReserves;
        curve.virtualTokenReserves = virtualTokenReserves;
        
        emit CurveParametersUpdated(token, virtualOkbReserves, virtualTokenReserves);
    }
    
    function _graduateToken(address token) internal {
        TokenCurve storage curve = tokenCurves[token];
        curve.graduated = true;
        
        emit TokenGraduated(token, curve.okbCollected);
        
        address marketGraduation = registry.getMarketGraduation();
        if (marketGraduation != address(0)) {
            (bool success, ) = marketGraduation.call(
                abi.encodeWithSignature("graduateToken(address)", token)
            );
            require(success, "Graduation call failed");
        }
    }
    
    function getCurveInfo(address token) external view returns (TokenCurve memory) {
        return tokenCurves[token];
    }
    
    function getTokenBalance(address token) external view returns (uint256) {
        return tokenBalances[token];
    }
    
    receive() external payable {}
}