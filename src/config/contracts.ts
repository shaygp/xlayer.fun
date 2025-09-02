export const XLAYER_CHAIN_ID = 196;
export const XLAYER_TESTNET_CHAIN_ID = 195;

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
  PUMP_FUN_LAUNCHPAD: '',
  QUICKSWAP_FACTORY: '0xd2480162Aa7F02Ead7BF4C127465446150D58452',
  QUICKSWAP_ROUTER: '0x4B9f4d2435Ef65559567e5DbFC1BbB37abC43B57',
  QUICKSWAP_POSITION_MANAGER: '0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd'
};

export const PUMP_FUN_LAUNCHPAD_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "_feeRecipient", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "symbol", "type": "string"},
      {"internalType": "string", "name": "imageUri", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"}
    ],
    "name": "createToken",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "tokenAddress", "type": "address"}],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenAddress", "type": "address"},
      {"internalType": "uint256", "name": "tokenAmount", "type": "uint256"}
    ],
    "name": "sellTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "tokenAddress", "type": "address"}],
    "name": "getTokenPrice",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenAddress", "type": "address"},
      {"internalType": "uint256", "name": "okbAmount", "type": "uint256"}
    ],
    "name": "getTokensForOkb",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenAddress", "type": "address"},
      {"internalType": "uint256", "name": "tokenAmount", "type": "uint256"}
    ],
    "name": "getOkbForTokens",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
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
    "inputs": [{"internalType": "address", "name": "tokenAddress", "type": "address"}],
    "name": "getTokenInfo",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "tokenAddress", "type": "address"},
          {"internalType": "address", "name": "creator", "type": "address"},
          {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
          {"internalType": "uint256", "name": "totalSupply", "type": "uint256"},
          {"internalType": "uint256", "name": "availableSupply", "type": "uint256"},
          {"internalType": "uint256", "name": "okbRaised", "type": "uint256"},
          {"internalType": "bool", "name": "graduatedToDeX", "type": "bool"},
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "string", "name": "symbol", "type": "string"},
          {"internalType": "string", "name": "imageUri", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"}
        ],
        "internalType": "struct PumpFunLaunchpad.TokenInfo",
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
      {"indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "symbol", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "imageUri", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "description", "type": "string"}
    ],
    "name": "TokenCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "buyer", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "okbAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "tokensReceived", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "newPrice", "type": "uint256"}
    ],
    "name": "TokenPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "poolAddress", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "liquidityLocked", "type": "uint256"}
    ],
    "name": "TokenGraduated",
    "type": "event"
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