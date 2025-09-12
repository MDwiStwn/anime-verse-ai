import { Button } from "@/components/ui/button";
import { Search, User, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AniVerse
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-anime-primary transition-colors">
            Home
          </Link>
          <Link to="/browse" className="text-foreground hover:text-anime-primary transition-colors">
            Browse
          </Link>
          <Link to="/watchlist" className="text-foreground hover:text-anime-primary transition-colors">
            Watchlist
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search anime..."
              className="pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anime-primary text-foreground"
            />
          </div>
          
          <Link to="/subscribe">
            <Button variant="outline" size="sm" className="border-anime-primary text-anime-primary hover:bg-anime-primary hover:text-white">
              <Crown className="w-4 h-4 mr-2" />
              Premium
            </Button>
          </Link>
          
          <Link to="/profile">
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;