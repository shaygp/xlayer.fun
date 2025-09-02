import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface TradingInterfaceProps {
  tokenSymbol: string;
  tokenName: string;
  currentPrice: number;
  userBalance: number;
  className?: string;
}

const TradingInterface = ({
  tokenSymbol,
  tokenName,
  currentPrice,
  userBalance,
  className
}: TradingInterfaceProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("buy");
  const [amount, setAmount] = useState("");
  const [isTrading, setIsTrading] = useState(false);

  const handleTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setIsTrading(true);
    
    // Simulate trading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: `${activeTab === 'buy' ? 'Purchase' : 'Sale'} Successful`,
      description: `${activeTab === 'buy' ? 'Bought' : 'Sold'} ${amount} ${tokenSymbol}`,
    });
    
    setAmount("");
    setIsTrading(false);
  };

  const estimatedOutput = parseFloat(amount || "0") * currentPrice;
  const fee = estimatedOutput * 0.003; // 0.3% fee
  const finalAmount = activeTab === "buy" ? estimatedOutput - fee : estimatedOutput + fee;

  return (
    <Card className={`bg-xlayer-card border-xlayer-border p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Trade {tokenSymbol}</h3>
            <p className="text-sm text-muted-foreground">{tokenName}</p>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            Live Trading
          </Badge>
        </div>

        {/* Price Info */}
        <div className="bg-xlayer-gradient rounded-lg p-4 border border-xlayer-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-xl font-bold text-foreground">{currentPrice.toFixed(6)} OKB</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-lg font-semibold text-primary">{userBalance.toFixed(4)} OKB</p>
            </div>
          </div>
        </div>

        {/* Trading Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-xlayer-hover">
            <TabsTrigger value="buy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Buy {tokenSymbol}
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
              Sell {tokenSymbol}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buy-amount">Amount (OKB)</Label>
              <Input
                id="buy-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-xlayer-hover border-xlayer-border focus:border-primary"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">You'll receive approximately:</span>
            </div>
            
            <div className="bg-xlayer-hover rounded-lg p-3">
              <p className="text-lg font-semibold text-foreground">
                {(parseFloat(amount || "0") / currentPrice).toFixed(2)} {tokenSymbol}
              </p>
              <p className="text-xs text-muted-foreground">
                Fee: {fee.toFixed(6)} OKB (0.3%)
              </p>
            </div>

            <Button
              onClick={handleTrade}
              disabled={isTrading || !amount}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isTrading ? "Processing..." : `Buy ${tokenSymbol}`}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-amount">Amount ({tokenSymbol})</Label>
              <Input
                id="sell-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-xlayer-hover border-xlayer-border focus:border-destructive"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">You'll receive approximately:</span>
            </div>
            
            <div className="bg-xlayer-hover rounded-lg p-3">
              <p className="text-lg font-semibold text-foreground">
                {finalAmount.toFixed(6)} OKB
              </p>
              <p className="text-xs text-muted-foreground">
                Fee: {fee.toFixed(6)} OKB (0.3%)
              </p>
            </div>

            <Button
              onClick={handleTrade}
              disabled={isTrading || !amount}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isTrading ? "Processing..." : `Sell ${tokenSymbol}`}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Warning */}
        <div className="flex items-start space-x-3 p-3 bg-xlayer-hover rounded-lg border border-xlayer-border">
          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Trading Notice</p>
            <p>Prices are determined by the bonding curve. Large trades may cause significant price impact.</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TradingInterface;