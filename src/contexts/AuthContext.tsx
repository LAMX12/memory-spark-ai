
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, User } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for auth code in URL (for OAuth callback)
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get("code");
        
        if (authCode && window.location.pathname === "/auth/callback") {
          const user = await auth.handleCallback(authCode);
          if (user) {
            setUser(user);
            navigate("/dashboard");
          }
        } else {
          // Check if user is already signed in
          const currentUser = auth.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, [navigate]);
  
  const signIn = () => {
    auth.signInWithGoogle();
  };
  
  const signOut = () => {
    auth.signOut();
    setUser(null);
  };
  
  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

