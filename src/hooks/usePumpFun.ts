import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESSES, PUMP_FUN_LAUNCHPAD_ABI, MEME_TOKEN_ABI } from '../config/contracts';

export const usePumpFun = () => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const createToken = async (
    name: string,
    symbol: string,
    imageUri: string,
    description: string
  ) => {
    if (!CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD) {
      throw new Error('Launchpad contract not deployed');
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD as `0x${string}`,
      abi: PUMP_FUN_LAUNCHPAD_ABI,
      functionName: 'createToken',
      args: [name, symbol, imageUri, description],
      value: parseEther('0.001'),
    });
  };

  const buyTokens = async (tokenAddress: string, okbAmount: string) => {
    if (!CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD) {
      throw new Error('Launchpad contract not deployed');
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD as `0x${string}`,
      abi: PUMP_FUN_LAUNCHPAD_ABI,
      functionName: 'buyTokens',
      args: [tokenAddress],
      value: parseEther(okbAmount),
    });
  };

  const sellTokens = async (tokenAddress: string, tokenAmount: string) => {
    if (!CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD) {
      throw new Error('Launchpad contract not deployed');
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD as `0x${string}`,
      abi: PUMP_FUN_LAUNCHPAD_ABI,
      functionName: 'sellTokens',
      args: [tokenAddress, parseEther(tokenAmount)],
    });
  };

  const approveToken = async (tokenAddress: string, amount: string) => {
    return writeContract({
      address: tokenAddress as `0x${string}`,
      abi: MEME_TOKEN_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD, parseEther(amount)],
    });
  };

  return {
    createToken,
    buyTokens,
    sellTokens,
    approveToken,
  };
};

export const useTokenPrice = (tokenAddress: string) => {
  const { data: price, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD as `0x${string}`,
    abi: PUMP_FUN_LAUNCHPAD_ABI,
    functionName: 'getTokenPrice',
    args: [tokenAddress],
    query: {
      enabled: !!CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD && !!tokenAddress,
    },
  });

  return {
    price: price ? formatEther(price as bigint) : '0',
    isLoading,
    error,
  };
};

export const useTokenInfo = (tokenAddress: string) => {
  const { data: tokenInfo, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD as `0x${string}`,
    abi: PUMP_FUN_LAUNCHPAD_ABI,
    functionName: 'getTokenInfo',
    args: [tokenAddress],
    query: {
      enabled: !!CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD && !!tokenAddress,
    },
  });

  return {
    tokenInfo: tokenInfo ? {
      tokenAddress: (tokenInfo as any)[0],
      creator: (tokenInfo as any)[1],
      createdAt: (tokenInfo as any)[2],
      totalSupply: formatEther((tokenInfo as any)[3]),
      availableSupply: formatEther((tokenInfo as any)[4]),
      okbRaised: formatEther((tokenInfo as any)[5]),
      graduatedToDeX: (tokenInfo as any)[6],
      name: (tokenInfo as any)[7],
      symbol: (tokenInfo as any)[8],
      imageUri: (tokenInfo as any)[9],
      description: (tokenInfo as any)[10],
    } : null,
    isLoading,
    error,
  };
};

export const useAllTokens = () => {
  const { data: tokens, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD as `0x${string}`,
    abi: PUMP_FUN_LAUNCHPAD_ABI,
    functionName: 'getAllTokens',
    query: {
      enabled: !!CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD,
    },
  });

  return {
    tokens: tokens as string[] || [],
    isLoading,
    error,
  };
};

export const useTokenBalance = (tokenAddress: string, userAddress?: string) => {
  const { address } = useAccount();
  const targetAddress = userAddress || address;

  const { data: balance, isLoading, error } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: MEME_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [targetAddress],
    query: {
      enabled: !!tokenAddress && !!targetAddress,
    },
  });

  return {
    balance: balance ? formatEther(balance as bigint) : '0',
    isLoading,
    error,
  };
};

export const useTokenQuotes = (tokenAddress: string) => {
  const getTokensForOkb = (okbAmount: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD as `0x${string}`,
      abi: PUMP_FUN_LAUNCHPAD_ABI,
      functionName: 'getTokensForOkb',
      args: [tokenAddress, parseEther(okbAmount)],
      query: {
        enabled: !!CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD && !!tokenAddress && !!okbAmount,
      },
    });
  };

  const getOkbForTokens = (tokenAmount: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD as `0x${string}`,
      abi: PUMP_FUN_LAUNCHPAD_ABI,
      functionName: 'getOkbForTokens',
      args: [tokenAddress, parseEther(tokenAmount)],
      query: {
        enabled: !!CONTRACT_ADDRESSES.PUMP_FUN_LAUNCHPAD && !!tokenAddress && !!tokenAmount,
      },
    });
  };

  return {
    getTokensForOkb,
    getOkbForTokens,
  };
};