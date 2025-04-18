
// Authentication service for SecondBrain AI
import { toast } from "sonner";

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
  signInWithGoogle: () => {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.append("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", GOOGLE_REDIRECT_URI);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", GOOGLE_SCOPES.join(" "));
    authUrl.searchParams.append("access_type", "offline");
    authUrl.searchParams.append("prompt", "consent");
    
    // Redirect to Google OAuth
    window.location.href = authUrl.toString();
  },
  
  // Handle OAuth callback
  handleCallback: async (code: string): Promise<User | null> => {
    try {
      // In a real implementation, we would exchange the code for tokens
      // For now, we'll simulate the response
      console.log("Received auth code:", code);
      
      // Simulated user data (in a real app, this would come from the backend)
      const user: User = {
        id: "google-user-123",
        name: "Test User",
        email: "user@example.com",
        image: "https://api.dicebear.com/7.x/micah/svg?seed=user123",
        accessToken: "simulated-access-token",
        refreshToken: "simulated-refresh-token"
      };
      
      // Store user in localStorage (in real app, would be in HTTP-only cookies or secure storage)
      localStorage.setItem("sb-user", JSON.stringify(user));
      
      toast.success("Successfully signed in!");
      return user;
    } catch (error) {
      console.error("Auth callback error:", error);
      toast.error("Authentication failed. Please try again.");
      return null;
    }
  },
  
  // Get current user
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem("sb-user");
    return userData ? JSON.parse(userData) : null;
  },
  
  // Sign out
  signOut: () => {
    localStorage.removeItem("sb-user");
    toast.info("You have been signed out");
    window.location.href = "/";
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("sb-user");
  }
};

