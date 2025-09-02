// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library BondingCurve {
    uint256 constant PRECISION = 1e18;
    uint256 constant INITIAL_PRICE = 1e12;
    uint256 constant MAX_SUPPLY_FOR_CURVE = 800_000_000 * 1e18;
    uint256 constant VIRTUAL_OKB_RESERVES = 30 * 1e18;
    uint256 constant VIRTUAL_TOKEN_RESERVES = 1_073_000_000 * 1e18;

    function getVirtualReserves(uint256 soldTokens) internal pure returns (uint256 virtualOkb, uint256 virtualTokens) {
        virtualOkb = VIRTUAL_OKB_RESERVES;
        virtualTokens = VIRTUAL_TOKEN_RESERVES - soldTokens;
    }

    function calculatePrice(uint256 soldTokens) internal pure returns (uint256) {
        if (soldTokens >= MAX_SUPPLY_FOR_CURVE) {
            return type(uint256).max;
        }
        
        (uint256 virtualOkb, uint256 virtualTokens) = getVirtualReserves(soldTokens);
        
        if (virtualTokens == 0) {
            return type(uint256).max;
        }
        
        return (virtualOkb * PRECISION) / virtualTokens;
    }

    function calculateTokensOut(uint256 okbAmountIn, uint256 soldTokens) internal pure returns (uint256) {
        if (soldTokens >= MAX_SUPPLY_FOR_CURVE) {
            return 0;
        }

        (uint256 virtualOkb, uint256 virtualTokens) = getVirtualReserves(soldTokens);
        
        uint256 newVirtualOkb = virtualOkb + okbAmountIn;
        uint256 k = virtualOkb * virtualTokens;
        uint256 newVirtualTokens = k / newVirtualOkb;
        
        uint256 tokensOut = virtualTokens - newVirtualTokens;
        
        if (soldTokens + tokensOut > MAX_SUPPLY_FOR_CURVE) {
            tokensOut = MAX_SUPPLY_FOR_CURVE - soldTokens;
        }
        
        return tokensOut;
    }

    function calculateOkbOut(uint256 tokensIn, uint256 soldTokens) internal pure returns (uint256) {
        if (soldTokens == 0 || tokensIn > soldTokens) {
            return 0;
        }

        (uint256 virtualOkb, uint256 virtualTokens) = getVirtualReserves(soldTokens);
        
        uint256 newVirtualTokens = virtualTokens + tokensIn;
        uint256 k = virtualOkb * virtualTokens;
        uint256 newVirtualOkb = k / newVirtualTokens;
        
        uint256 okbOut = virtualOkb - newVirtualOkb;
        
        return okbOut;
    }

    function getMaxPrice() internal pure returns (uint256) {
        return calculatePrice(MAX_SUPPLY_FOR_CURVE);
    }

    function getRealPrice(uint256 soldTokens) internal pure returns (uint256) {
        (uint256 virtualOkb, uint256 virtualTokens) = getVirtualReserves(soldTokens);
        return (virtualOkb * PRECISION) / virtualTokens;
    }
}