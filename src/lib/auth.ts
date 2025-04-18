
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = "252282068953-98bk57a3pbpgkthjd4ln9egbrdv9pm7a.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI = window.location.origin + "/auth/callback";
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/youtube.readonly"
];

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  accessToken?: string;
  refreshToken?: string;
}

// Auth service functions
export const auth = {
  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: GOOGLE_REDIRECT_URI,
          scopes: GOOGLE_SCOPES.join(" "),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error("Google sign in error:", error);
        toast.error("Google sign in failed: " + error.message);
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Google sign in failed");
    }
  },
  
  // Handle OAuth callback
  handleCallback: async (code: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.error("Auth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        return null;
      }
      
      const user: User = {
        id: data.session.user.id,
        name: data.session.user.user_metadata.name || data.session.user.email?.split('@')[0] || "User",
        email: data.session.user.email || "",
        image: data.session.user.user_metadata.avatar_url,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
      
      toast.success("Successfully signed in!");
      return user;
    } catch (error) {
      console.error("Auth callback error:", error);
      toast.error("Authentication failed. Please try again.");
      return null;
    }
  },
  
  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) return null;
      
      return {
        id: data.session.user.id,
        name: data.session.user.user_metadata.name || "User",
        email: data.session.user.email || "",
        image: data.session.user.user_metadata.avatar_url,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },
  
  // Sign out
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      toast.info("You have been signed out");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  },

  // Email sign-in with remember me
  signInWithEmail: async (email: string, password: string, rememberMe: boolean = false): Promise<User | null> => {
    try {
      // For Supabase v2, we need to handle session duration differently
      // The expiresIn property isn't directly supported in the options
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Email sign in error:", error);
        toast.error(error.message || "Failed to sign in");
        return null;
      }
      
      if (!data.user || !data.session) {
        toast.error("Sign in failed. Please try again.");
        return null;
      }
      
      // If rememberMe is true, we'll extend the session duration
      // This is handled on the Supabase side, but we can refresh the session
      if (rememberMe) {
        // We don't need to do anything special here with Supabase v2
        // Session persistence is managed by Supabase based on their defaults
        console.log("Remember me enabled for this session");
      }
      
      const user: User = {
        id: data.user.id,
        name: data.user.user_metadata.name || data.user.email?.split('@')[0] || "User",
        email: data.user.email || "",
        image: data.user.user_metadata.avatar_url,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
      
      toast.success("Successfully signed in!");
      return user;
    } catch (error: any) {
      console.error("Email sign in error:", error);
      toast.error(error.message || "Failed to sign in");
      return null;
    }
  }
};
