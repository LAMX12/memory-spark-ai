
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setError("Authentication failed. Please try again.");
          toast.error("Authentication failed");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        if (session) {
          console.log("Session obtained successfully");
          // Create user object from session
          const user = await auth.handleCallback("");
          
          if (user) {
            toast.success("Successfully signed in!");
            navigate("/dashboard");
          } else {
            setError("Failed to process authentication. Please try again.");
            setTimeout(() => navigate("/login"), 3000);
          }
        } else {
          setError("No authentication session found. Please try again.");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Authentication processing failed. You will be redirected shortly.");
        setTimeout(() => navigate("/login"), 3000);
      }
    };
    
    handleAuthCallback();
    
    // Add fallback timer if something goes wrong
    const timer = setTimeout(() => {
      if (window.location.pathname === "/auth/callback") {
        setError("Authentication is taking longer than expected. You will be redirected shortly.");
        toast.error("Authentication took too long. Redirecting to login page.");
        setTimeout(() => navigate("/login"), 3000);
      }
    }, 15000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md p-6">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h1 className="text-2xl font-bold">Completing Authentication...</h1>
        <p className="text-muted-foreground">
          Please wait while we securely sign you in to SecondBrain AI.
        </p>
        {error && (
          <div className="text-destructive">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
