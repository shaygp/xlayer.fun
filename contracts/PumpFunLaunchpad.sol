// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MemeToken.sol";
import "./libraries/BondingCurve.sol";
import "./interfaces/IQuickSwap.sol";
import "./WOKB.sol";

contract PumpFunLaunchpad is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    struct TokenInfo {
        address tokenAddress;
        address creator;
        uint256 createdAt;
        uint256 totalSupply;
        uint256 soldSupply;
        uint256 okbCollected;
        bool graduatedToDeX;
        string name;
        string symbol;
        string imageUri;
        string description;
    }

    uint256 public constant GRADUATION_THRESHOLD = 80 * 1e18;
    uint256 public constant LOCKED_LIQUIDITY_AMOUNT = 36 * 1e18;
    uint256 public constant CREATION_FEE = 1 * 1e15;
    uint256 public constant PLATFORM_FEE_PERCENT = 100;
    uint256 public constant CREATOR_FEE_PERCENT = 100;
    uint256 public constant FEE_DENOMINATOR = 10000;

    address public immutable WOKB_ADDRESS;
    address public constant QUICKSWAP_FACTORY = 0xd2480162Aa7F02Ead7BF4C127465446150D58452;
    address public constant QUICKSWAP_POSITION_MANAGER = 0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd;
    uint24 public constant POOL_FEE = 3000;

    mapping(address => TokenInfo) public tokens;
    mapping(address => uint256) public okbPoolBalances;
    address[] public allTokens;
    
    uint256 public totalPlatformFees;
    address public feeRecipient;

    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        string imageUri,
        string description
    );
    
    event TokenPurchased(
        address indexed tokenAddress,
        address indexed buyer,
        uint256 okbAmount,
        uint256 tokensReceived,
        uint256 newPrice
    );
    
    event TokenSold(
        address indexed tokenAddress,
        address indexed seller,
        uint256 tokensAmount,
        uint256 okbReceived,
        uint256 newPrice
    );
    
    event TokenGraduated(
        address indexed tokenAddress,
        address indexed poolAddress,
        uint256 liquidityLocked
    );

    modifier onlyValidToken(address tokenAddress) {
        require(tokens[tokenAddress].tokenAddress != address(0), "Token not found");
        require(!tokens[tokenAddress].graduatedToDeX, "Token graduated");
        _;
    }

    constructor(address _feeRecipient, address _wokbAddress) Ownable(msg.sender) {
        feeRecipient = _feeRecipient;
        WOKB_ADDRESS = _wokbAddress;
    }

    function createToken(
        string memory name,
        string memory symbol,
        string memory imageUri,
        string memory description
    ) external payable nonReentrant returns (address) {
        require(msg.value >= CREATION_FEE, "Insufficient creation fee");
        require(bytes(name).length > 0 && bytes(symbol).length > 0, "Invalid name or symbol");

        MemeToken newToken = new MemeToken(
            name,
            symbol,
            imageUri,
            description,
            msg.sender,
            address(this)
        );

        address tokenAddress = address(newToken);
        
        tokens[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            createdAt: block.timestamp,
            totalSupply: MemeToken(tokenAddress).TOTAL_SUPPLY(),
            soldSupply: 0,
            okbCollected: 0,
            graduatedToDeX: false,
            name: name,
            symbol: symbol,
            imageUri: imageUri,
            description: description
        });

        allTokens.push(tokenAddress);
        totalPlatformFees += msg.value;

        emit TokenCreated(tokenAddress, msg.sender, name, symbol, imageUri, description);
        return tokenAddress;
    }

    function buyTokens(address tokenAddress) external payable nonReentrant onlyValidToken(tokenAddress) {
        require(msg.value > 0, "Must send OKB");
        
        TokenInfo storage tokenInfo = tokens[tokenAddress];
        uint256 platformFee = (msg.value * PLATFORM_FEE_PERCENT) / FEE_DENOMINATOR;
        uint256 creatorFee = (msg.value * CREATOR_FEE_PERCENT) / FEE_DENOMINATOR;
        uint256 okbForTokens = msg.value - platformFee - creatorFee;

        uint256 tokensToMint = BondingCurve.calculateTokensOut(okbForTokens, tokenInfo.soldSupply);
        require(tokensToMint > 0, "No tokens available");
        require(tokenInfo.soldSupply + tokensToMint <= BondingCurve.MAX_SUPPLY_FOR_CURVE, "Exceeds curve limit");

        tokenInfo.soldSupply += tokensToMint;
        tokenInfo.okbCollected += okbForTokens;
        okbPoolBalances[tokenAddress] += okbForTokens;

        IERC20(tokenAddress).safeTransfer(msg.sender, tokensToMint);

        payable(tokenInfo.creator).transfer(creatorFee);
        totalPlatformFees += platformFee;

        uint256 newPrice = BondingCurve.calculatePrice(tokenInfo.soldSupply);
        
        emit TokenPurchased(tokenAddress, msg.sender, msg.value, tokensToMint, newPrice);

        if (tokenInfo.okbCollected >= GRADUATION_THRESHOLD) {
            _graduateToken(tokenAddress);
        }
    }

    function sellTokens(address tokenAddress, uint256 tokenAmount) external nonReentrant onlyValidToken(tokenAddress) {
        require(tokenAmount > 0, "Must sell positive amount");
        require(IERC20(tokenAddress).balanceOf(msg.sender) >= tokenAmount, "Insufficient balance");

        TokenInfo storage tokenInfo = tokens[tokenAddress];
        require(tokenAmount <= tokenInfo.soldSupply, "Cannot sell more than sold");
        
        uint256 okbOut = BondingCurve.calculateOkbOut(tokenAmount, tokenInfo.soldSupply);
        require(okbOut > 0, "No OKB to receive");
        require(okbOut <= okbPoolBalances[tokenAddress], "Insufficient OKB in pool");

        uint256 platformFee = (okbOut * PLATFORM_FEE_PERCENT) / FEE_DENOMINATOR;
        uint256 creatorFee = (okbOut * CREATOR_FEE_PERCENT) / FEE_DENOMINATOR;
        uint256 okbToSeller = okbOut - platformFee - creatorFee;

        tokenInfo.soldSupply -= tokenAmount;
        tokenInfo.okbCollected -= okbOut;
        okbPoolBalances[tokenAddress] -= okbOut;

        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenAmount);

        payable(msg.sender).transfer(okbToSeller);
        payable(tokenInfo.creator).transfer(creatorFee);
        totalPlatformFees += platformFee;

        uint256 newPrice = BondingCurve.calculatePrice(tokenInfo.soldSupply);
        
        emit TokenSold(tokenAddress, msg.sender, tokenAmount, okbToSeller, newPrice);
    }

    function _graduateToken(address tokenAddress) internal {
        TokenInfo storage tokenInfo = tokens[tokenAddress];
        require(!tokenInfo.graduatedToDeX, "Already graduated");

        uint256 liquidityOkb = okbPoolBalances[tokenAddress] - LOCKED_LIQUIDITY_AMOUNT;
        uint256 liquidityTokens = 200_000_000 * 1e18;

        MemeToken token = MemeToken(tokenAddress);
        token.enableTrading();

        WOKB wokb = WOKB(payable(WOKB_ADDRESS));
        wokb.deposit{value: liquidityOkb}();

        IERC20(tokenAddress).approve(QUICKSWAP_POSITION_MANAGER, liquidityTokens);
        IERC20(WOKB_ADDRESS).approve(QUICKSWAP_POSITION_MANAGER, liquidityOkb);

        INonfungiblePositionManager positionManager = INonfungiblePositionManager(QUICKSWAP_POSITION_MANAGER);
        
        address token0 = tokenAddress < WOKB_ADDRESS ? tokenAddress : WOKB_ADDRESS;
        address token1 = tokenAddress < WOKB_ADDRESS ? WOKB_ADDRESS : tokenAddress;
        
        uint160 sqrtPriceX96 = _calculateSqrtPriceX96(liquidityTokens, liquidityOkb);
        
        address pool;
        try positionManager.createAndInitializePoolIfNecessary(
            token0,
            token1,
            POOL_FEE,
            sqrtPriceX96
        ) returns (address initializedPool) {
            pool = initializedPool;
        } catch {
            revert("Failed to create pool");
        }

        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: token0,
            token1: token1,
            fee: POOL_FEE,
            tickLower: -887220,
            tickUpper: 887220,
            amount0Desired: tokenAddress == token0 ? liquidityTokens : liquidityOkb,
            amount1Desired: tokenAddress == token0 ? liquidityOkb : liquidityTokens,
            amount0Min: (tokenAddress == token0 ? liquidityTokens : liquidityOkb) * 95 / 100,
            amount1Min: (tokenAddress == token0 ? liquidityOkb : liquidityTokens) * 95 / 100,
            recipient: address(0xdead),
            deadline: block.timestamp + 300
        });

        try positionManager.mint(params) returns (uint256, uint128, uint256, uint256) {
        } catch {
            revert("Failed to add liquidity");
        }

        tokenInfo.graduatedToDeX = true;
        okbPoolBalances[tokenAddress] = LOCKED_LIQUIDITY_AMOUNT;

        emit TokenGraduated(tokenAddress, pool, LOCKED_LIQUIDITY_AMOUNT);
    }

    function _calculateSqrtPriceX96(uint256 tokenAmount, uint256 okbAmount) internal pure returns (uint160) {
        uint256 price = (okbAmount * (2**96)) / tokenAmount;
        return uint160(_sqrt(price * (2**96)));
    }

    function _sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    function getTokenPrice(address tokenAddress) external view returns (uint256) {
        TokenInfo memory tokenInfo = tokens[tokenAddress];
        if (tokenInfo.graduatedToDeX) return 0;
        
        return BondingCurve.calculatePrice(tokenInfo.soldSupply);
    }

    function getTokensForOkb(address tokenAddress, uint256 okbAmount) external view returns (uint256) {
        TokenInfo memory tokenInfo = tokens[tokenAddress];
        if (tokenInfo.graduatedToDeX) return 0;
        
        return BondingCurve.calculateTokensOut(okbAmount, tokenInfo.soldSupply);
    }

    function getOkbForTokens(address tokenAddress, uint256 tokenAmount) external view returns (uint256) {
        TokenInfo memory tokenInfo = tokens[tokenAddress];
        if (tokenInfo.graduatedToDeX) return 0;
        
        return BondingCurve.calculateOkbOut(tokenAmount, tokenInfo.soldSupply);
    }

    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }

    function getTokenInfo(address tokenAddress) external view returns (TokenInfo memory) {
        return tokens[tokenAddress];
    }

    function withdrawPlatformFees() external onlyOwner {
        require(totalPlatformFees > 0, "No fees to withdraw");
        uint256 amount = totalPlatformFees;
        totalPlatformFees = 0;
        payable(feeRecipient).transfer(amount);
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
    }

    receive() external payable {}
}