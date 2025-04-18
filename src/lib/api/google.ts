
// Google API service for SecondBrain AI
import { toast } from "sonner";

// Types
export interface GoogleDocument {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  webViewLink: string;
  iconLink: string;
}

export interface GoogleEmail {
  id: string;
  threadId: string;
  subject: string;
  snippet: string;
  from: string;
  date: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  channelTitle: string;
  duration: string;
}

// YouTube Data API Key
const YOUTUBE_API_KEY = "AIzaSyDXwX6uCsvuSv_hxzRHE1BKb9pIytRdmOU";

export const googleService = {
  // Fetch documents from Google Drive
  fetchDriveFiles: async (accessToken: string): Promise<GoogleDocument[]> => {
    try {
      console.log("Fetching Drive files with token:", accessToken.substring(0, 5) + "...");
      
      if (!accessToken) {
        throw new Error("No access token provided");
      }
      
      // In a real implementation, we would make an actual API call
      // For demo purposes, we'll return mock data to ensure UI is working
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      return [
        {
          id: "doc1",
          name: "Project Proposal.pdf",
          mimeType: "application/pdf",
          createdTime: "2025-04-10T15:30:00Z",
          webViewLink: "https://drive.google.com/file/d/abc123/view",
          iconLink: "https://drive-thirdparty.googleusercontent.com/16/type/application/pdf"
        },
        {
          id: "doc2",
          name: "Research Notes.docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          createdTime: "2025-04-08T09:45:00Z",
          webViewLink: "https://drive.google.com/file/d/def456/view",
          iconLink: "https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        },
        {
          id: "doc3",
          name: "Meeting Minutes.pdf",
          mimeType: "application/pdf",
          createdTime: "2025-04-05T13:15:00Z",
          webViewLink: "https://drive.google.com/file/d/ghi789/view",
          iconLink: "https://drive-thirdparty.googleusercontent.com/16/type/application/pdf"
        }
      ];
    } catch (error) {
      console.error("Drive API error:", error);
      toast.error("Failed to fetch Google Drive files");
      return [];
    }
  },
  
  // Fetch emails from Gmail
  fetchEmails: async (accessToken: string): Promise<GoogleEmail[]> => {
    try {
      console.log("Fetching Gmail emails with token:", accessToken?.substring(0, 5) + "...");
      
      if (!accessToken) {
        throw new Error("No access token provided");
      }
      
      // In a real implementation, we would make an actual API call
      // For demo, return mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      return [
        {
          id: "email1",
          threadId: "thread1",
          subject: "Meeting Tomorrow",
          snippet: "Let's discuss the project progress tomorrow at 10 AM...",
          from: "manager@example.com",
          date: "2025-04-17T09:30:00Z"
        },
        {
          id: "email2",
          threadId: "thread2",
          subject: "Project Update",
          snippet: "Here are the latest updates on the project milestones...",
          from: "team@example.com",
          date: "2025-04-16T14:20:00Z"
        },
        {
          id: "email3",
          threadId: "thread3",
          subject: "Important Deadline",
          snippet: "Please note that the submission deadline has been moved...",
          from: "admin@example.com",
          date: "2025-04-15T11:45:00Z"
        }
      ];
    } catch (error) {
      console.error("Gmail API error:", error);
      toast.error("Failed to fetch emails");
      return [];
    }
  },
  
  // Fetch YouTube videos
  fetchYouTubeVideos: async (accessToken: string): Promise<YouTubeVideo[]> => {
    try {
      console.log("Fetching YouTube videos with token:", accessToken?.substring(0, 5) + "...");
      
      // For YouTube, we can use either OAuth token or API key
      if (!accessToken && !YOUTUBE_API_KEY) {
        throw new Error("No authentication method available for YouTube");
      }
      
      // In a real implementation, make an actual API call
      // For demo, return mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      return [
        {
          id: "video1",
          title: "How to Build a Second Brain",
          description: "Learn the essential techniques for organizing your digital information...",
          publishedAt: "2025-03-20T15:30:00Z",
          thumbnailUrl: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
          channelTitle: "Productivity Experts",
          duration: "PT15M30S"
        },
        {
          id: "video2",
          title: "Mastering Note-Taking",
          description: "The ultimate guide to effective note-taking strategies for knowledge workers...",
          publishedAt: "2025-03-15T12:45:00Z",
          thumbnailUrl: "https://i.ytimg.com/vi/def456/hqdefault.jpg",
          channelTitle: "Study Skills",
          duration: "PT22M15S"
        },
        {
          id: "video3",
          title: "AI Tools for Knowledge Management",
          description: "Discover how AI can supercharge your personal knowledge management system...",
          publishedAt: "2025-03-10T09:20:00Z",
          thumbnailUrl: "https://i.ytimg.com/vi/ghi789/hqdefault.jpg",
          channelTitle: "Tech Insights",
          duration: "PT18M45S"
        }
      ];
    } catch (error) {
      console.error("YouTube API error:", error);
      toast.error("Failed to fetch YouTube videos");
      return [];
    }
  },
  
  // Get YouTube video details from URL or ID
  getYouTubeVideoDetails: async (urlOrId: string): Promise<YouTubeVideo | null> => {
    try {
      // Extract video ID from URL if needed
      let videoId = urlOrId;
      if (urlOrId.includes("youtube.com") || urlOrId.includes("youtu.be")) {
        const url = new URL(urlOrId);
        if (urlOrId.includes("youtube.com")) {
          videoId = url.searchParams.get("v") || "";
        } else {
          videoId = url.pathname.substring(1);
        }
      }
      
      if (!videoId) {
        throw new Error("Invalid YouTube URL or ID");
      }
      
      console.log(`Fetching YouTube video details for ID: ${videoId}`);
      
      // If we have API key, we could make a real API call here
      // For demo, simulate response
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      return {
        id: videoId,
        title: "Demo YouTube Video",
        description: "This is a simulated YouTube video response. In production, this would fetch actual video data using the YouTube API.",
        publishedAt: new Date().toISOString(),
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        channelTitle: "Demo Channel",
        duration: "PT10M30S"
      };
    } catch (error) {
      console.error("YouTube video fetch error:", error);
      toast.error("Failed to get video details. Please check the URL.");
      return null;
    }
  }
};
