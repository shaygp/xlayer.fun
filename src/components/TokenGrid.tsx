import { useState } from "react";
import { Link } from "react-router-dom";
import TokenCard from "./TokenCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, SortAsc, Terminal } from "lucide-react";
import tokenIcons from "@/assets/token-icons.png";

// Mock data for tokens
const mockTokens = [
  {
    name: "Pepe Coin",
    symbol: "PEPE",
    image: tokenIcons,
    marketCap: "$142.8M",
    price: "$0.000001234",
    change24h: 15.6,
    replies: 2847,
    holders: 18394,
    description: "The most memeable memecoin in existence on X Layer",
    trending: true,
    liquidityPooled: 68.4,
    showChart: true
  },
  {
    name: "Layer Dog",
    symbol: "LDOG",
    image: tokenIcons,
    marketCap: "$89.2M",
    price: "$0.045",
    change24h: -3.2,
    replies: 1892,
    holders: 12847,
    description: "Good boy of X Layer, bringing DeFi to the masses",
    trending: true,
    liquidityPooled: 52.1,
    showChart: true
  },
  {
    name: "Moon Shot",
    symbol: "MOON",
    image: tokenIcons,
    marketCap: "$67.5M",
    price: "$0.12",
    change24h: 8.9,
    replies: 1456,
    holders: 9847,
    description: "To the moon and beyond with X Layer technology",
    trending: false
  },
  {
    name: "X Token",
    symbol: "XTKN",
    image: tokenIcons,
    marketCap: "$45.3M",
    price: "$0.89",
    change24h: 12.4,
    replies: 934,
    holders: 7234,
    description: "The native utility token for X Layer ecosystem",
    trending: false
  },
  {
    name: "DeFi Cat",
    symbol: "DCAT",
    image: tokenIcons,
    marketCap: "$32.1M",
    price: "$0.034",
    change24h: -1.8,
    replies: 789,
    holders: 5678,
    description: "Purr-fect DeFi experience on X Layer blockchain",
    trending: false
  },
  {
    name: "Rocket Fuel",
    symbol: "FUEL",
    image: tokenIcons,
    marketCap: "$28.7M",
    price: "$0.67",
    change24h: 22.3,
    replies: 656,
    holders: 4523,
    description: "Powering the next generation of X Layer applications",
    trending: false
  }
];

const TokenGrid = () => {
  const [activeTab, setActiveTab] = useState("all");

  const trendingTokens = mockTokens.filter(token => token.trending);
  const allTokens = mockTokens;

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
            all ({allTokens.length})
          </TabsTrigger>
          <TabsTrigger value="trending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            trending ({trendingTokens.length})
          </TabsTrigger>
          <TabsTrigger value="new" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            new
          </TabsTrigger>
          <TabsTrigger value="gainers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            gainers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {allTokens.map((token, index) => (
              <Link key={index} to={`/token/${token.symbol}`} className="block transition-transform hover:scale-[1.02]">
                <TokenCard {...token} />
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trendingTokens.map((token, index) => (
              <Link key={index} to={`/token/${token.symbol}`} className="block transition-transform hover:scale-[1.02]">
                <TokenCard {...token} />
              </Link>
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