// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MemeToken is ERC20, Ownable {
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;
    string private _tokenImageUri;
    string private _description;
    address public immutable launchpad;
    bool public tradingEnabled;

    modifier onlyLaunchpad() {
        require(msg.sender == launchpad, "Only launchpad can call");
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        string memory imageUri,
        string memory description,
        address creator,
        address _launchpad
    ) ERC20(name, symbol) Ownable(creator) {
        _tokenImageUri = imageUri;
        _description = description;
        launchpad = _launchpad;
        _mint(_launchpad, TOTAL_SUPPLY);
    }

    function enableTrading() external onlyLaunchpad {
        tradingEnabled = true;
    }

    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0) && from != launchpad && to != launchpad) {
            require(tradingEnabled, "Trading not enabled");
        }
        super._update(from, to, value);
    }

    function tokenImageUri() external view returns (string memory) {
        return _tokenImageUri;
    }

    function description() external view returns (string memory) {
        return _description;
    }
}