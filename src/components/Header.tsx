import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import WalletConnection from "./WalletConnection";
import CreateTokenModal from "./CreateTokenModal";
import { useState } from "react";
import xlayerLogo from "@/assets/xlayer-logo.svg";

const Header = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-xlayer-border bg-xlayer-bg/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <Link to="/board" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src={xlayerLogo} alt="X Layer" className="w-8 h-8" />
            <div>
            <h1 className="text-lg font-medium text-primary terminal-cursor">X_LAYER</h1>
            <p className="text-xs text-muted-foreground">token_board.exe</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
              <Link to="/board">./board</Link>
            </Button>
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-primary"
              onClick={() => setShowCreateModal(true)}
            >
              ./create
            </Button>
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
              <Link to="/portfolio">./portfolio</Link>
            </Button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tokens..."
            className="pl-10 bg-xlayer-card border-xlayer-border focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <WalletConnection />
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            data-create-token
          >
            ./new_token
          </Button>
        </div>
      </div>
      
      <CreateTokenModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </header>
  );
};

export default Header;