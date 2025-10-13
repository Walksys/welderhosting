import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Server, LogOut, ShoppingCart } from "lucide-react";

interface NavigationProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navigation = ({ isAuthenticated, onLogout }: NavigationProps) => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Server className="w-8 h-8 text-primary transition-smooth group-hover:text-accent" />
          <span className="text-2xl font-bold glow-text">Welder Hosting</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {location.pathname !== "/dashboard" && (
                <Button asChild variant="outline" className="transition-smooth hover:glow-border">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              )}
              {location.pathname !== "/buy-server" && (
                <Button asChild variant="outline" className="transition-smooth hover:glow-border">
                  <Link to="/buy-server">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Server
                  </Link>
                </Button>
              )}
              <Button
                onClick={onLogout}
                variant="outline"
                className="transition-smooth hover:glow-border"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            location.pathname !== "/auth" && (
              <Button asChild className="transition-smooth hover:glow-border-strong">
                <Link to="/auth">Sign In</Link>
              </Button>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
