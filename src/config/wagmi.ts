import { http, createConfig } from 'wagmi'
import { xlayer, xlayerTestnet } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

export const xlayerChain = {
  id: 196,
  name: 'X Layer',
  nativeCurrency: {
    decimals: 18,
    name: 'OKB',
    symbol: 'OKB',
  },
  rpcUrls: {
    public: { http: ['https://rpc.xlayer.tech'] },
    default: { http: ['https://rpc.xlayer.tech'] },
  },
  blockExplorers: {
    default: { name: 'OKLink', url: 'https://www.oklink.com/xlayer' },
  },
} as const

export const xlayerTestnetChain = {
  id: 195,
  name: 'X Layer Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'OKB',
    symbol: 'OKB',
  },
  rpcUrls: {
    public: { http: ['https://testrpc.xlayer.tech'] },
    default: { http: ['https://testrpc.xlayer.tech'] },
  },
  blockExplorers: {
    default: { name: 'OKLink Testnet', url: 'https://www.oklink.com/xlayer-test' },
  },
} as const

export const config = createConfig({
  chains: [xlayerChain, xlayerTestnetChain],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [xlayerChain.id]: http(),
    [xlayerTestnetChain.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}