import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AniVerse
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The ultimate anime streaming platform with thousands of series and movies in Ultra HD quality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block text-muted-foreground hover:text-anime-primary transition-colors">
                Home
              </Link>
              <Link to="/browse" className="block text-muted-foreground hover:text-anime-primary transition-colors">
                Browse Anime
              </Link>
              <Link to="/subscribe" className="block text-muted-foreground hover:text-anime-primary transition-colors">
                Premium
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Account</h4>
            <div className="space-y-2 text-sm">
              <Link to="/profile" className="block text-muted-foreground hover:text-anime-primary transition-colors">
                Profile
              </Link>
              <Link to="/login" className="block text-muted-foreground hover:text-anime-primary transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="block text-muted-foreground hover:text-anime-primary transition-colors">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <div className="space-y-2 text-sm">
              <Link to="/help" className="block text-muted-foreground hover:text-anime-primary transition-colors">
                Help Center
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-anime-primary transition-colors">
                Contact Us
              </Link>
              <Link to="/privacy" className="block text-muted-foreground hover:text-anime-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © 2024 AniVerse. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-4 md:mt-0">
            Made with 💜 for anime fans worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;