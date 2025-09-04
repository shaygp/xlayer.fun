import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TokenCard from "./TokenCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, SortAsc, Loader2 } from "lucide-react";
import { useAllTokens, useTokenInfo, useTokenPrice } from "@/hooks/usePumpFun";

interface TokenData {
  address: string;
  name: string;
  symbol: string;
  image: string;
  marketCap: string;
  price: string;
  change24h: number;
  replies: number;
  holders: number;
  description: string;
  trending: boolean;
  liquidityPooled?: number;
  showChart?: boolean;
  graduatedToDeX: boolean;
  okbRaised: string;
}

const TokenItem = ({ tokenAddress }: { tokenAddress: string }) => {
  const { tokenInfo } = useTokenInfo(tokenAddress);
  const { price } = useTokenPrice(tokenAddress);
  
  const isDemoToken = tokenAddress === '0x1234567890123456789012345678901234567890';
  
  const demoTokenInfo = {
    name: "Cat Layer",
    symbol: "CATLAYER",
    imageUri: "/catlayer.svg",
    description: "The purrfect meme token for X Layer! Join the cat revolution on the blockchain.",
    okbRaised: "12.5",
    tokensSold: "2500000",
    graduatedToDeX: false
  };
  
  const displayTokenInfo = isDemoToken ? demoTokenInfo : tokenInfo;
  const displayPrice = isDemoToken ? "0.000005" : price;
  
  if (!displayTokenInfo) return null;

  const tokenData: TokenData = {
    address: tokenAddress,
    name: displayTokenInfo.name,
    symbol: displayTokenInfo.symbol,
    image: displayTokenInfo.imageUri || "https://via.placeholder.com/64",
    marketCap: `${(parseFloat(displayTokenInfo.okbRaised) * 50).toFixed(1)}K`,
    price: `${parseFloat(displayPrice).toFixed(8)} OKB`,
    change24h: isDemoToken ? 15.7 : Math.random() * 40 - 20,
    replies: isDemoToken ? 142 : Math.floor(Math.random() * 1000),
    holders: isDemoToken ? 89 : Math.floor(Math.random() * 5000),
    description: displayTokenInfo.description || "A meme token on X Layer",
    trending: parseFloat(displayTokenInfo.okbRaised) > 10,
    liquidityPooled: (parseFloat(displayTokenInfo.okbRaised) / 80) * 100,
    showChart: true,
    graduatedToDeX: displayTokenInfo.graduatedToDeX,
    okbRaised: displayTokenInfo.okbRaised
  };

  return (
    <Link 
      to={`/token/${tokenAddress}`} 
      className="block transition-transform hover:scale-[1.02]"
    >
      <TokenCard {...tokenData} />
    </Link>
  );
};

const TokenGrid = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { tokens, isLoading } = useAllTokens();
  
  // Filter tokens based on active tab
  const demoTokens = ['0x1234567890123456789012345678901234567890'];
  
  const filteredTokens = React.useMemo(() => {
    const allTokens = tokens && tokens.length > 0 ? tokens : demoTokens;
    
    switch (activeTab) {
      case "trending":
        return allTokens.slice(0, 6);
      case "new":
        return allTokens.slice().reverse().slice(0, 8);
      case "graduated":
        return allTokens.slice(0, 3);
      default:
        return allTokens;
    }
  }, [tokens, activeTab]);

  // Remove loading state - show content immediately

  return (
    <div className="space-y-6 relative scan-lines">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border border-xlayer-border rounded bg-xlayer-card p-4">
        <div className="flex items-center space-x-3">
          <span className="text-primary">$</span>
          <div>
            <h1 className="text-lg font-medium text-primary">~/xlayer/tokens</h1>
            <p className="text-sm text-muted-foreground">ls -la --sort=market_cap --filter=active</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-xlayer-border hover:bg-xlayer-hover">
              <Filter className="w-4 h-4 mr-2" />
              --filter
            </Button>
            <Button variant="outline" className="border-xlayer-border hover:bg-xlayer-hover">
              <SortAsc className="w-4 h-4 mr-2" />
              --sort
            </Button>
        </div>
      </div>

      {/* Terminal Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-xlayer-card border border-xlayer-border">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            all ({tokens?.length || 1})
          </TabsTrigger>
          <TabsTrigger value="trending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            trending
          </TabsTrigger>
          <TabsTrigger value="new" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            new
          </TabsTrigger>
          <TabsTrigger value="graduated" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            graduated
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {filteredTokens.length === 0 ? (
            <div className="text-center py-12 border border-xlayer-border rounded bg-xlayer-card">
              <p className="text-muted-foreground"># No tokens found. Create the first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTokens.map((tokenAddress, index) => (
                <TokenItem key={tokenAddress} tokenAddress={tokenAddress} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          {filteredTokens.length === 0 ? (
            <div className="text-center py-12 border border-xlayer-border rounded bg-xlayer-card">
              <p className="text-muted-foreground"># No trending tokens yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTokens.map((tokenAddress, index) => (
                <TokenItem key={tokenAddress} tokenAddress={tokenAddress} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          {filteredTokens.length === 0 ? (
            <div className="text-center py-12 border border-xlayer-border rounded bg-xlayer-card">
              <p className="text-muted-foreground"># No new tokens yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTokens.map((tokenAddress, index) => (
                <TokenItem key={tokenAddress} tokenAddress={tokenAddress} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="graduated" className="mt-6">
          {filteredTokens.length === 0 ? (
            <div className="text-center py-12 border border-xlayer-border rounded bg-xlayer-card">
              <p className="text-muted-foreground"># No graduated tokens yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTokens.map((tokenAddress, index) => (
                <TokenItem key={tokenAddress} tokenAddress={tokenAddress} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Load More Button */}
      <div className="text-center pt-8">
        <Button variant="outline" className="border-xlayer-border hover:bg-xlayer-hover">
          ./load_more.sh --count=20
        </Button>
      </div>
    </div>
  );
};

export default TokenGrid;