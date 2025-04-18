// Content service for SecondBrain AI
import { openaiService, SummaryResponse } from "./api/openai";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

// Sample data for demo purposes
const sampleContents: Content[] = [
  {
    id: "content_1",
    title: "Machine Learning Fundamentals",
    type: "pdf",
    source: "Google Drive",
    sourceUrl: "https://docs.google.com/document/d/123",
    date: "2025-04-10T14:30:00Z",
    summary: "This document covers the fundamental concepts of machine learning, including supervised learning, unsupervised learning, and reinforcement learning. It explains key algorithms like linear regression, decision trees, and neural networks.",
    keyPoints: [
      "Machine learning is divided into three main types: supervised, unsupervised, and reinforcement learning.",
      "Supervised learning requires labeled data for training.",
      "Neural networks form the foundation of deep learning approaches."
    ],
    actionItems: [
      "Practice implementing a simple linear regression model",
      "Review chapter 4 for decision tree algorithms"
    ],
    tags: ["machine learning", "AI", "data science"],
    isFavorite: true,
    projectIds: ["project_1"],
    userId: "user123"
  },
  {
    id: "content_2",
    title: "Quarterly Team Meeting",
    type: "email",
    source: "Gmail",
    sourceUrl: "https://mail.google.com/mail/u/0/#inbox/123",
    date: "2025-04-05T10:00:00Z",
    summary: "Email discussing the upcoming quarterly team meeting. Agenda includes Q1 results review, Q2 planning, and team structure updates. Key metrics were highlighted showing 15% growth in user acquisition.",
    keyPoints: [
      "Q1 results exceeded targets by 12%",
      "New marketing strategy proposed for Q2",
      "Team reorganization planned for June"
    ],
    actionItems: [
      "Prepare slides for product updates section",
      "Schedule follow-up meeting with marketing"
    ],
    tags: ["meeting", "quarterly planning"],
    isFavorite: false,
    projectIds: ["project_2"],
    userId: "user123"
  },
  {
    id: "content_3",
    title: "Introduction to React Hooks",
    type: "video",
    source: "YouTube",
    sourceUrl: "https://www.youtube.com/watch?v=abc123",
    date: "2025-03-28T15:45:00Z",
    summary: "This tutorial explains React Hooks, focusing on useState, useEffect, and useContext. Examples demonstrate converting class components to functional components with hooks.",
    keyPoints: [
      "Hooks were introduced in React 16.8",
      "useState replaces this.state and this.setState",
      "useEffect combines componentDidMount, componentDidUpdate, and componentWillUnmount"
    ],
    actionItems: [
      "Refactor project components to use hooks",
      "Try creating a custom hook for form handling"
    ],
    tags: ["react", "javascript", "programming", "hooks"],
    isFavorite: true,
    projectIds: ["project_3"],
    userId: "user123"
  },
];

// Sample projects for demo purposes
const sampleProjects: Project[] = [
  {
    id: "project_1",
    name: "AI Research",
    description: "Research materials for AI and machine learning concepts",
    contentIds: ["content_1"],
    color: "#8B5CF6",
    userId: "user123",
    createdAt: "2025-03-15T09:00:00Z",
    updatedAt: "2025-04-10T14:30:00Z"
  },
  {
    id: "project_2",
    name: "Work Planning",
    description: "Team meetings and work planning documents",
    contentIds: ["content_2"],
    color: "#EC4899",
    userId: "user123",
    createdAt: "2025-03-20T11:00:00Z",
    updatedAt: "2025-04-05T10:00:00Z"
  },
  {
    id: "project_3",
    name: "Web Development",
    description: "Learning resources for web development",
    contentIds: ["content_3"],
    color: "#10B981",
    userId: "user123",
    createdAt: "2025-03-25T14:00:00Z",
    updatedAt: "2025-03-28T15:45:00Z"
  },
];

// Keep track of contents and projects
let contents: Content[] = [...sampleContents];
let projects: Project[] = [...sampleProjects];

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
      
      // Add to contents array
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
    // Filter contents by user ID
    return contents.filter(content => content.userId === userId || userId === "user123");
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
    
    const userContents = contents.filter(content => content.userId === userId || userId === "user123");
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
    return contents.filter(content => content.type === type && (content.userId === userId || userId === "user123"));
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
    return projects.filter(project => project.userId === userId || userId === "user123");
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
