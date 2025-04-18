
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Google } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { signIn, isAuthenticated } = useAuth();
  
  return (
    <section className="py-16 md:py-24 w-full overflow-hidden">
      <div className="content-container">
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
          <div className="flex-center p-4 rounded-full bg-primary/10">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-gradient">Your Second Brain,</span> <br />
            powered by AI
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Everything you've ever learned — remembered and ready to use.
            Save, organize, and instantly recall all your knowledge.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {isAuthenticated ? (
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-lg px-8">
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button 
                  onClick={signIn}
                  size="lg" 
                  variant="outline"
                  className="rounded-full border-primary/30 text-lg px-8 flex items-center"
                >
                  <Google className="mr-2 h-5 w-5" />
                  Sign in with Google
                </Button>
                
                <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-lg px-8">
                  <Link to="/onboarding">
                    Start Your Second Brain For Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </>
            )}
          </div>
          
          <div className="pt-10 flex justify-center">
            <div className="relative w-full max-w-3xl aspect-[16/9] rounded-xl overflow-hidden shadow-glow">
              <div className="absolute inset-0 glass-card">
                <div className="p-6 absolute inset-0 flex items-start justify-center flex-col">
                  <div className="w-full h-full bg-gradient-to-br from-brain/5 to-brain-dark/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
                    <p className="text-xl font-medium text-white/70">Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

