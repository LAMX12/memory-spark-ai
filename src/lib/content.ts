
// Content service for SecondBrain AI
import { openaiService, SummaryResponse } from "./api/openai";
import { toast } from "sonner";

// Types
export type ContentType = "pdf" | "document" | "email" | "video" | "article" | "note";

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  source: string;
  sourceUrl?: string;
  date: string;
  summary?: string;
  keyPoints?: string[];
  actionItems?: string[];
  tags: string[];
  isFavorite: boolean;
  projectIds: string[];
  embeddings?: number[];
  userId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  contentIds: string[];
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Mock database
let contents: Content[] = [];
let projects: Project[] = [];

const contentService = {
  // Add new content
  addContent: async (content: Omit<Content, "id" | "date">): Promise<Content> => {
    try {
      // Generate a unique ID
      const id = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create new content with defaults
      const newContent: Content = {
        ...content,
        id,
        date: new Date().toISOString(),
        tags: content.tags || [],
        isFavorite: content.isFavorite || false,
        projectIds: content.projectIds || []
      };
      
      // Add to mock database
      contents.push(newContent);
      
      toast.success("Content added successfully");
      return newContent;
    } catch (error) {
      console.error("Error adding content:", error);
      toast.error("Failed to add content");
      throw error;
    }
  },
  
  // Get all content for user
  getContents: (userId: string): Content[] => {
    return contents.filter(content => content.userId === userId);
  },
  
  // Get specific content by ID
  getContentById: (id: string): Content | undefined => {
    return contents.find(content => content.id === id);
  },
  
  // Update content
  updateContent: (id: string, updates: Partial<Content>): Content | null => {
    const index = contents.findIndex(content => content.id === id);
    if (index === -1) {
      toast.error("Content not found");
      return null;
    }
    
    const updatedContent = { ...contents[index], ...updates };
    contents[index] = updatedContent;
    
    toast.success("Content updated");
    return updatedContent;
  },
  
  // Delete content
  deleteContent: (id: string): boolean => {
    const initialLength = contents.length;
    contents = contents.filter(content => content.id !== id);
    
    if (contents.length < initialLength) {
      toast.success("Content deleted");
      return true;
    }
    
    toast.error("Content not found");
    return false;
  },
  
  // Search content
  searchContent: (query: string, userId: string): Content[] => {
    if (!query) return [];
    
    const userContents = contents.filter(content => content.userId === userId);
    const lowercaseQuery = query.toLowerCase();
    
    return userContents.filter(content => {
      return (
        content.title.toLowerCase().includes(lowercaseQuery) ||
        (content.summary?.toLowerCase().includes(lowercaseQuery)) ||
        (content.keyPoints?.some(point => point.toLowerCase().includes(lowercaseQuery))) ||
        (content.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
      );
    });
  },
  
  // Get content by type
  getContentsByType: (type: ContentType, userId: string): Content[] => {
    return contents.filter(content => content.type === type && content.userId === userId);
  },
  
  // Add tag to content
  addTagToContent: (contentId: string, tag: string): Content | null => {
    const content = contents.find(c => c.id === contentId);
    if (!content) {
      toast.error("Content not found");
      return null;
    }
    
    if (!content.tags.includes(tag)) {
      content.tags.push(tag);
      toast.success("Tag added");
    }
    
    return content;
  },
  
  // Remove tag from content
  removeTagFromContent: (contentId: string, tag: string): Content | null => {
    const content = contents.find(c => c.id === contentId);
    if (!content) {
      toast.error("Content not found");
      return null;
    }
    
    content.tags = content.tags.filter(t => t !== tag);
    toast.success("Tag removed");
    
    return content;
  },
  
  // Toggle favorite status
  toggleFavorite: (contentId: string): Content | null => {
    const content = contents.find(c => c.id === contentId);
    if (!content) {
      toast.error("Content not found");
      return null;
    }
    
    content.isFavorite = !content.isFavorite;
    toast.success(content.isFavorite ? "Added to favorites" : "Removed from favorites");
    
    return content;
  },
  
  // Add content to project
  addContentToProject: (contentId: string, projectId: string): Content | null => {
    const content = contents.find(c => c.id === contentId);
    if (!content) {
      toast.error("Content not found");
      return null;
    }
    
    if (!content.projectIds.includes(projectId)) {
      content.projectIds.push(projectId);
      
      // Update project as well
      const project = projects.find(p => p.id === projectId);
      if (project && !project.contentIds.includes(contentId)) {
        project.contentIds.push(contentId);
      }
      
      toast.success("Added to project");
    }
    
    return content;
  },
  
  // Remove content from project
  removeContentFromProject: (contentId: string, projectId: string): Content | null => {
    const content = contents.find(c => c.id === contentId);
    if (!content) {
      toast.error("Content not found");
      return null;
    }
    
    content.projectIds = content.projectIds.filter(id => id !== projectId);
    
    // Update project as well
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.contentIds = project.contentIds.filter(id => id !== contentId);
    }
    
    toast.success("Removed from project");
    
    return content;
  },
  
  // Get all projects for user
  getProjects: (userId: string): Project[] => {
    return projects.filter(project => project.userId === userId);
  },
  
  // Create a new project
  createProject: (projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "contentIds">): Project => {
    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newProject: Project = {
      ...projectData,
      id,
      contentIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    toast.success("Project created");
    
    return newProject;
  },
  
  // Update a project
  updateProject: (id: string, updates: Partial<Project>): Project | null => {
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      toast.error("Project not found");
      return null;
    }
    
    const updatedProject = { 
      ...projects[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    projects[index] = updatedProject;
    toast.success("Project updated");
    
    return updatedProject;
  },
  
  // Delete a project
  deleteProject: (id: string): boolean => {
    const initialLength = projects.length;
    projects = projects.filter(p => p.id !== id);
    
    // Remove project from any content
    contents.forEach(content => {
      content.projectIds = content.projectIds.filter(pId => pId !== id);
    });
    
    if (projects.length < initialLength) {
      toast.success("Project deleted");
      return true;
    }
    
    toast.error("Project not found");
    return false;
  },
  
  // Get project by ID
  getProjectById: (id: string): Project | undefined => {
    return projects.find(p => p.id === id);
  },
  
  // Get contents for a project
  getContentsByProject: (projectId: string): Content[] => {
    return contents.filter(content => content.projectIds.includes(projectId));
  },
  
  // Summarize content using OpenAI
  summarizeContent: async (contentText: string, contentType: ContentType, title?: string): Promise<SummaryResponse> => {
    try {
      return await openaiService.summarize({
        content: contentText,
        contentType: contentType as any,
        title
      });
    } catch (error) {
      console.error("Summarization error:", error);
      throw error;
    }
  }
};

export default contentService;

