
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="py-4 w-full glass-card sticky top-0 z-50">
      <div className="content-container flex-between">
        <Link to="/" className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">SecondBrain AI</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            <Link to="/#features" className="text-muted-foreground hover:text-foreground transition">Features</Link>
            <Link to="/#pricing" className="text-muted-foreground hover:text-foreground transition">Pricing</Link>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground transition">Blog</Link>
          </div>
          
          <div className="flex space-x-3">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-card/95 backdrop-blur-md p-4 flex flex-col space-y-4 border-t border-border animate-fade-in">
          <Link to="/#features" className="px-4 py-2 hover:bg-primary/10 rounded-md" onClick={() => setIsOpen(false)}>
            Features
          </Link>
          <Link to="/#pricing" className="px-4 py-2 hover:bg-primary/10 rounded-md" onClick={() => setIsOpen(false)}>
            Pricing
          </Link>
          <Link to="/blog" className="px-4 py-2 hover:bg-primary/10 rounded-md" onClick={() => setIsOpen(false)}>
            Blog
          </Link>
          <div className="flex flex-col space-y-2 pt-2 border-t border-border">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
