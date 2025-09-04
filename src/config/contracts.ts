export const XLAYER_CHAIN_ID = 196;
export const XLAYER_TESTNET_CHAIN_ID = 1952;

export const XLAYER_CONFIG = {
  chainId: XLAYER_CHAIN_ID,
  name: 'X Layer',
  currency: 'OKB',
  explorerUrl: 'https://www.oklink.com/xlayer',
  rpcUrl: 'https://rpc.xlayer.tech'
};

export const XLAYER_TESTNET_CONFIG = {
  chainId: XLAYER_TESTNET_CHAIN_ID,
  name: 'X Layer Testnet',
  currency: 'OKB',
  explorerUrl: 'https://www.oklink.com/xlayer-test',
  rpcUrl: 'https://testrpc.xlayer.tech'
};

export const CONTRACT_ADDRESSES = {
  REGISTRY: '0x0becC48729c02fC5d30239ab4E1B8c9AbB0d1f78',
  TOKEN_FACTORY: '0xa959A269696cEd243A0E2Cc45fCeD8c0A24dB88e',
  BONDING_CURVE: '0xd64fd6b463aC54252FAB669a29d51Ae3373C3467',
  LIQUIDITY_POOL: '0xDC225E7d4e3a1e5A65aC39F4B60E85f7657FFf0C',
  USER_MANAGER: '0x7231bB2Ebc50cB32731cf7303E077B0042ab6778',
  FEE_MANAGER: '0xCaCbd1C17f36061593181B6E482DaB822815c9a5',
  MARKET_GRADUATION: '0x7Df5fda5E528ba80E84C3462cA7D7454c5129c7b',
  WOKB: '0x952E6c15BEA13B9A6077419456B59f46c43F2934',
  QUICKSWAP_FACTORY: '0xd2480162Aa7F02Ead7BF4C127465446150D58452',
  QUICKSWAP_ROUTER: '0x4B9f4d2435Ef65559567e5DbFC1BbB37abC43B57',
  QUICKSWAP_POSITION_MANAGER: '0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd'
};

export const REGISTRY_ABI = [
  {
    "inputs": [],
    "name": "getTokenFactory",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBondingCurve",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLiquidityPool",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getUserManager",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFeeManager",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMarketGraduation",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWOKB",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
    "name": "isValidToken",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export const TOKEN_FACTORY_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "symbol", "type": "string"},
      {"internalType": "uint256", "name": "supply", "type": "uint256"},
      {"internalType": "string", "name": "imageUri", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"}
    ],
    "name": "createToken",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllTokens",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
    "name": "getTokenInfo",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "tokenAddress", "type": "address"},
          {"internalType": "address", "name": "creator", "type": "address"},
          {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
          {"internalType": "uint256", "name": "totalSupply", "type": "uint256"},
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "string", "name": "symbol", "type": "string"},
          {"internalType": "string", "name": "imageUri", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"}
        ],
        "internalType": "struct TokenFactory.TokenInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "token", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "symbol", "type": "string"}
    ],
    "name": "TokenCreated",
    "type": "event"
  }
];

export const BONDING_CURVE_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "okbAmount", "type": "uint256"}
    ],
    "name": "buyTokens",
    "outputs": [{"internalType": "uint256", "name": "tokensOut", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "tokenAmount", "type": "uint256"}
    ],
    "name": "sellTokens",
    "outputs": [{"internalType": "uint256", "name": "okbOut", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
    "name": "getCurrentPrice",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "okbAmount", "type": "uint256"}
    ],
    "name": "calculateTokensOut",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "tokenAmount", "type": "uint256"}
    ],
    "name": "calculateOkbOut",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
    "name": "getCurveInfo",
    "outputs": [
      {"internalType": "uint256", "name": "virtualOkb", "type": "uint256"},
      {"internalType": "uint256", "name": "virtualTokens", "type": "uint256"},
      {"internalType": "uint256", "name": "okbCollected", "type": "uint256"},
      {"internalType": "uint256", "name": "tokensSold", "type": "uint256"},
      {"internalType": "bool", "name": "active", "type": "bool"},
      {"internalType": "bool", "name": "graduated", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "token", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "okbAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "tokensOut", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "newPrice", "type": "uint256"}
    ],
    "name": "TokensPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "token", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "tokensIn", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "okbOut", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "newPrice", "type": "uint256"}
    ],
    "name": "TokensSold",
    "type": "event"
  }
];

export const MARKET_GRADUATION_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
    "name": "checkGraduation",
    "outputs": [
      {"internalType": "bool", "name": "canGraduate", "type": "bool"},
      {"internalType": "uint256", "name": "okbCollected", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
    "name": "graduateToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
    "name": "listOnDEX",
    "outputs": [{"internalType": "address", "name": "poolAddress", "type": "address"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
    "name": "isGraduated",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
    "name": "getPoolAddress",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "token", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "pool", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "okbLocked", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "tokensLocked", "type": "uint256"}
    ],
    "name": "TokenGraduated",
    "type": "event"
  }
];

export const USER_MANAGEMENT_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "validateAccess",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "canCreateToken",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export const FEE_MANAGER_ABI = [
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getPendingRewards",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export const WOKB_ABI = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export const MEME_TOKEN_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenImageUri",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "description",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];