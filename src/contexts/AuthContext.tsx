
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, User } from "@/lib/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
  isAuthenticated: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
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
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const currentUser = {
              id: session.user.id,
              name: session.user.user_metadata.name || "User",
              email: session.user.email || "",
              image: session.user.user_metadata.avatar_url,
              accessToken: session.access_token,
              refreshToken: session.refresh_token,
            };
            setUser(currentUser);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        const currentUser = {
          id: session.user.id,
          name: session.user.user_metadata.name || "User",
          email: session.user.email || "",
          image: session.user.user_metadata.avatar_url,
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
        };
        setUser(currentUser);
        
        if (location.pathname === '/' || location.pathname === '/login') {
          navigate('/dashboard');
        }
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/');
      }
    });
    
    initAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
  
  // Google OAuth sign-in
  const signIn = () => {
    auth.signInWithGoogle();
  };
  
  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.info("You have been signed out");
    navigate('/');
  };
  
  // Email sign-in
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      toast.success("Successfully signed in!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };
  
  // Email sign-up
  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success("Account created! Please check your email to confirm your account.");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };
  
  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    loginWithEmail,
    signUpWithEmail,
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
