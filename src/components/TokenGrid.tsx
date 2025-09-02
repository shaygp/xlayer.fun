import { useState, useEffect } from "react";
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
  
  if (!tokenInfo) return null;

  const tokenData: TokenData = {
    address: tokenAddress,
    name: tokenInfo.name,
    symbol: tokenInfo.symbol,
    image: tokenInfo.imageUri || "https://via.placeholder.com/64",
    marketCap: `${(parseFloat(tokenInfo.okbRaised) * 50).toFixed(1)}K`,
    price: `${parseFloat(price).toFixed(8)} OKB`,
    change24h: Math.random() * 40 - 20,
    replies: Math.floor(Math.random() * 1000),
    holders: Math.floor(Math.random() * 5000),
    description: tokenInfo.description || "A meme token on X Layer",
    trending: parseFloat(tokenInfo.okbRaised) > 50,
    liquidityPooled: (parseFloat(tokenInfo.okbRaised) / 80) * 100,
    showChart: true,
    graduatedToDeX: tokenInfo.graduatedToDeX,
    okbRaised: tokenInfo.okbRaised
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading tokens...</span>
      </div>
    );
  }

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
            all ({tokens.length})
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
          {tokens.length === 0 ? (
            <div className="text-center py-12 border border-xlayer-border rounded bg-xlayer-card">
              <p className="text-muted-foreground"># No tokens found. Create the first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tokens.map((tokenAddress, index) => (
                <TokenItem key={tokenAddress} tokenAddress={tokenAddress} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tokens.slice(0, 6).map((tokenAddress, index) => (
              <TokenItem key={tokenAddress} tokenAddress={tokenAddress} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="text-center py-12 border border-xlayer-border rounded bg-xlayer-card">
            <p className="text-muted-foreground"># coming_soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="gainers" className="mt-6">
          <div className="text-center py-12 border border-xlayer-border rounded bg-xlayer-card">
            <p className="text-muted-foreground"># coming_soon...</p>
          </div>
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