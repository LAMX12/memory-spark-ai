
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
        }
      });
      
      if (error) {
        console.error("Google sign in error:", error);
        toast.error("Google sign in failed");
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
  }
};
