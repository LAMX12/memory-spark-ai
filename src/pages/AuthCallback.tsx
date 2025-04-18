
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // The actual OAuth callback processing is handled in the AuthContext
    // This is just a fallback in case something goes wrong
    const timer = setTimeout(() => {
      if (window.location.pathname === "/auth/callback") {
        setError("Authentication is taking longer than expected. You will be redirected shortly.");
        setTimeout(() => navigate("/dashboard"), 3000);
      }
    }, 5000);
    
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

