import { useParams } from "react-router-dom";
import { ArrowLeft, Share2, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BondingCurveChart from "@/components/BondingCurveChart";
import TradingInterface from "@/components/TradingInterface";
import ActivityFeed from "@/components/ActivityFeed";
import AnimatedBackground from "@/components/AnimatedBackground";
import tokenIcons from "@/assets/token-icons.png";

const TokenDetail = () => {
  const { tokenAddress } = useParams();
  
  if (!tokenAddress) {
    return <div>Token not found</div>;
  }

  return (
    <div className="min-h-screen bg-xlayer-bg text-foreground relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="border-xlayer-border hover:bg-xlayer-hover">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Board
            </Button>
            
            <div className="flex items-center space-x-3">
              <img src={token.image} alt={token.name} className="w-12 h-12 rounded-full border-2 border-xlayer-border" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">{token.name}</h1>
                <p className="text-muted-foreground">${token.symbol}</p>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Trending
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="border-xlayer-border hover:bg-xlayer-hover">
              <Star className="w-4 h-4 mr-2" />
              Add to Favorites
            </Button>
            <Button variant="outline" size="sm" className="border-xlayer-border hover:bg-xlayer-hover">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-xlayer-card border-xlayer-border p-4">
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-xl font-bold text-foreground">{token.price} OKB</p>
            <p className={`text-sm ${token.change24h >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {token.change24h >= 0 ? '+' : ''}{token.change24h}%
            </p>
          </Card>
          
          <Card className="bg-xlayer-card border-xlayer-border p-4">
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="text-xl font-bold text-foreground">{token.marketCap}</p>
          </Card>
          
          <Card className="bg-xlayer-card border-xlayer-border p-4">
            <p className="text-sm text-muted-foreground">24h Volume</p>
            <p className="text-xl font-bold text-foreground">{token.volume24h}</p>
          </Card>
          
          <Card className="bg-xlayer-card border-xlayer-border p-4">
            <p className="text-sm text-muted-foreground">Holders</p>
            <p className="text-xl font-bold text-foreground">{token.holders.toLocaleString()}</p>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Chart and Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bonding Curve Chart */}
            <BondingCurveChart
              tokenSymbol={token.symbol}
              currentSupply={500000}
              currentPrice={parseFloat(token.price)}
              liquidityPooled={token.liquidityPooled}
            />

            {/* Token Information */}
            <Card className="bg-xlayer-card border-xlayer-border p-6">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="bg-xlayer-hover">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
                  <TabsTrigger value="community">Community</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">About {token.name}</h3>
                    <p className="text-muted-foreground leading-relaxed">{token.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contract Address</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm font-mono text-foreground">{token.contractAddress.slice(0, 20)}...</p>
                        <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Network</p>
                      <p className="text-sm text-foreground mt-1">X Layer (Polygon CDK)</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tokenomics" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Token Economics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-xlayer-hover rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Total Supply</p>
                        <p className="text-lg font-semibold text-foreground">1,000,000,000</p>
                      </div>
                      <div className="bg-xlayer-hover rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Circulating Supply</p>
                        <p className="text-lg font-semibold text-foreground">500,000,000</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="community" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Community</h3>
                    <p className="text-muted-foreground">Join the {token.name} community across various platforms.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Trading and Activity */}
          <div className="space-y-8">
            {/* Trading Interface */}
            <TradingInterface tokenAddress={tokenAddress} />

            {/* Activity Feed */}
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;