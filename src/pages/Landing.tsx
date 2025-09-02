import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRight, Terminal, Plus } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

const Landing = () => {
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState({
    name: "",
    symbol: "",
    description: ""
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!tokenData.name || !tokenData.symbol) return;
    
    setIsCreating(true);
    
    // Simulate token creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to main app
    navigate('/board');
  };

  const handleEnterBoard = () => {
    navigate('/board');
  };

  return (
    <div className="min-h-screen bg-xlayer-bg text-foreground relative scan-lines">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Terminal Header */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex items-center space-x-3">
            <Terminal className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-medium text-primary terminal-cursor">X_LAYER_TOKENS</h1>
              <p className="text-sm text-muted-foreground">create_token_terminal.exe</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Welcome Message */}
          <Card className="bg-xlayer-card border-xlayer-border p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-primary">$</span>
                <span className="text-muted-foreground">welcome to X Layer token creation terminal</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-primary">$</span>
                <span className="text-muted-foreground">enter token details below to mint on X Layer blockchain</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-primary">$</span>
                <span className="text-muted-foreground">or type './board' to explore existing tokens</span>
              </div>
            </div>
          </Card>

          {/* Create Token Form */}
          <Card className="bg-xlayer-card border-xlayer-border p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-primary">$</span>
                <span className="text-foreground font-medium">./create_token --interactive</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    token_name:
                  </label>
                  <Input
                    placeholder="My Awesome Token"
                    value={tokenData.name}
                    onChange={(e) => setTokenData({...tokenData, name: e.target.value})}
                    className="bg-xlayer-hover border-xlayer-border focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    symbol:
                  </label>
                  <Input
                    placeholder="MAT"
                    value={tokenData.symbol}
                    onChange={(e) => setTokenData({...tokenData, symbol: e.target.value.toUpperCase()})}
                    className="bg-xlayer-hover border-xlayer-border focus:border-primary focus:ring-1 focus:ring-primary"
                    maxLength={6}
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    description:
                  </label>
                  <Textarea
                    placeholder="A revolutionary token that will change everything..."
                    value={tokenData.description}
                    onChange={(e) => setTokenData({...tokenData, description: e.target.value})}
                    className="bg-xlayer-hover border-xlayer-border focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px]"
                    maxLength={200}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {tokenData.description.length}/200 characters
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <Button
                  onClick={handleCreate}
                  disabled={!tokenData.name || !tokenData.symbol || isCreating}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      <span>deploying...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>./deploy --now</span>
                    </>
                  )}
                </Button>
                
                <span className="text-muted-foreground text-sm">or</span>
                
                <Button
                  variant="outline"
                  onClick={handleEnterBoard}
                  className="border-xlayer-border hover:bg-xlayer-hover flex items-center space-x-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>./board</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Terminal Footer */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground text-sm">
              <span>$</span>
              <span>powered by X Layer blockchain • minimal fees • instant liquidity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;