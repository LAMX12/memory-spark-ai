
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
  loginWithEmail: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
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
          const currentUser = await auth.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            
            // Redirect to dashboard if on login/signup page
            if (location.pathname === '/login' || location.pathname === '/signup') {
              navigate('/dashboard');
            }
          } else if (location.pathname !== '/' && 
                    location.pathname !== '/login' && 
                    location.pathname !== '/signup' && 
                    !location.pathname.startsWith('/auth/')) {
            // Redirect to login if not authenticated and trying to access protected route
            navigate('/login', { state: { from: location.pathname } });
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
        
        if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
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
    await auth.signOut();
    setUser(null);
    navigate('/');
  };
  
  // Email sign-in with remember me
  const loginWithEmail = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const user = await auth.signInWithEmail(email, password, rememberMe);
      
      if (user) {
        setUser(user);
        
        // Get the intended destination from location state, or default to dashboard
        const from = (location.state as any)?.from || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
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
      navigate('/login', { state: { message: "Please check your email to confirm your account before logging in." } });
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
