import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Wallet, ExternalLink, Copy, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectionProps {
  isConnected: boolean;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
  address?: string;
  okbBalance?: number;
}

const WalletConnection = ({ 
  isConnected, 
  onConnect, 
  onDisconnect, 
  address = "",
  okbBalance = 0 
}: WalletConnectionProps) => {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const wallets = [
    {
      name: "OKX Wallet",
      icon: "🟡",
      description: "Recommended for X Layer",
      preferred: true
    },
    {
      name: "MetaMask",
      icon: "🦊",
      description: "Popular Web3 wallet",
      preferred: false
    },
    {
      name: "WalletConnect",
      icon: "🔗",
      description: "Connect mobile wallets",
      preferred: false
    }
  ];

  const handleWalletConnect = async (walletName: string) => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAddress = "0x1234567890123456789012345678901234567890";
      onConnect(mockAddress);
      setShowModal(false);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected with ${walletName}`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const handleDisconnect = () => {
    onDisconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-foreground">{okbBalance.toFixed(4)} OKB</p>
          <p className="text-xs text-muted-foreground">{formatAddress(address)}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAddress}
            className="border-xlayer-border hover:bg-xlayer-hover"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="border-xlayer-border hover:bg-xlayer-hover text-destructive"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Button 
        onClick={() => setShowModal(true)}
        variant="outline" 
        className="border-xlayer-border hover:bg-xlayer-hover"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[400px] bg-xlayer-card border-xlayer-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Connect Your Wallet</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-xlayer-gradient rounded-lg p-4 border border-xlayer-border">
              <h4 className="font-semibold text-foreground mb-2">Welcome to X Layer</h4>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to create and trade tokens on the new money chain.
              </p>
            </div>

            <div className="space-y-3">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.name}
                  variant="outline"
                  className="w-full justify-start p-4 h-auto border-xlayer-border hover:bg-xlayer-hover hover:border-primary/50 transition-all"
                  onClick={() => handleWalletConnect(wallet.name)}
                  disabled={isConnecting}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground">{wallet.name}</span>
                        {wallet.preferred && (
                          <Badge variant="secondary" className="bg-primary/20 text-primary border-0 text-xs">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{wallet.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Button>
              ))}
            </div>

            <div className="text-center pt-4 border-t border-xlayer-border">
              <p className="text-xs text-muted-foreground">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnection;