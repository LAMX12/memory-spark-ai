
// OpenAI API service for SecondBrain AI
import { toast } from "sonner";

// Note: In production, this key should be stored securely on the backend
const OPENAI_API_KEY = "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";

export interface SummaryRequest {
  content: string;
  contentType: 'pdf' | 'video' | 'email' | 'article' | 'document' | 'note';
  title?: string;
}

export interface SummaryResponse {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
}

export const openaiService = {
  // Summarize content using OpenAI
  summarize: async (request: SummaryRequest): Promise<SummaryResponse> => {
    try {
      console.log("Summarizing with OpenAI:", request.contentType);
      
      if (!request.content || request.content.trim() === "") {
        throw new Error("No content provided for summarization");
      }
      
      // In a real implementation, this would be a backend call
      // For demo purposes, we'd use the OpenAI API directly
      // But since we're in a frontend environment, we'll simulate the response
      
      // Simulate API delay based on content length (longer content takes more time)
      const simulatedDelay = Math.min(2000, 500 + (request.content.length / 100));
      await new Promise(resolve => setTimeout(resolve, simulatedDelay));
      
      // Generate more realistic responses based on content type and any actual content provided
      let summary = "";
      let keyPoints: string[] = [];
      let actionItems: string[] = [];
      
      // Extract some words from the content for a more personalized response
      const contentWords = request.content.split(/\s+/).filter(word => word.length > 4).slice(0, 10);
      const randomWords = contentWords.length > 3 ? 
        [contentWords[0], contentWords[Math.floor(contentWords.length / 2)], contentWords[contentWords.length - 1]] :
        ["important", "critical", "relevant"];
      
      switch (request.contentType) {
        case 'pdf':
          summary = `This PDF document ${request.title ? `titled "${request.title}"` : ""} contains detailed information about ${randomWords.join(", ")} and related concepts. The document explains key methodologies and approaches to these topics, providing practical examples and case studies.`;
          keyPoints = [
            `The ${randomWords[0]} methodology is explained in detail in the first section`,
            `${randomWords[1]} principles are applied to real-world scenarios`,
            `The author emphasizes the importance of ${randomWords[2]} in modern applications`
          ];
          actionItems = [
            `Review the section on ${randomWords[0]} implementation`,
            `Apply ${randomWords[1]} techniques to current projects`,
            `Share insights about ${randomWords[2]} with the team`
          ];
          break;
          
        case 'video':
          summary = `This video ${request.title ? `titled "${request.title}"` : ""} presents a comprehensive overview of ${randomWords.join(", ")}. The presenter explains these concepts clearly with practical demonstrations and visual examples.`;
          keyPoints = [
            `Introduction to ${randomWords[0]} begins at the start of the video`,
            `${randomWords[1]} techniques are demonstrated with examples mid-way`,
            `The video concludes with advanced applications of ${randomWords[2]}`
          ];
          actionItems = [
            `Practice the ${randomWords[0]} technique shown at approximately 5:20`,
            `Apply the ${randomWords[1]} method to improve workflow`,
            `Explore more about ${randomWords[2]} using recommended resources`
          ];
          break;
          
        case 'email':
          summary = `This email ${request.title ? `with subject "${request.title}"` : ""} discusses ${randomWords.join(", ")} in the context of ongoing projects. The sender provides updates and requests specific actions from the recipients.`;
          keyPoints = [
            `Updates on the ${randomWords[0]} project status`,
            `Discussion of challenges related to ${randomWords[1]}`,
            `Proposal for new approach involving ${randomWords[2]}`
          ];
          actionItems = [
            `Respond with feedback on the ${randomWords[0]} proposal by Friday`,
            `Schedule meeting to discuss ${randomWords[1]} challenges`,
            `Research alternatives for ${randomWords[2]} implementation`
          ];
          break;
          
        default:
          summary = `This ${request.contentType} ${request.title ? `titled "${request.title}"` : ""} covers topics related to ${randomWords.join(", ")}. It provides valuable insights and information that can be applied to current projects and research.`;
          keyPoints = [
            `${randomWords[0]} is a central concept throughout the content`,
            `The relationship between ${randomWords[1]} and performance is highlighted`,
            `${randomWords[2]} is presented as an emerging trend in this field`
          ];
          actionItems = [
            `Follow up on the ${randomWords[0]} research mentioned`,
            `Apply insights about ${randomWords[1]} to current work`,
            `Explore more resources about ${randomWords[2]}`
          ];
      }
      
      return {
        summary,
        keyPoints,
        actionItems
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      toast.error("Failed to generate summary. Please try again.");
      throw error;
    }
  },
  
  // Generate embeddings for semantic search
  generateEmbedding: async (text: string): Promise<number[]> => {
    try {
      // In a real implementation, this would be a backend call to OpenAI
      console.log("Generating embedding for:", text.substring(0, 50) + "...");
      
      // Simulate embedding generation (would be done by OpenAI API)
      // In production, this would return actual embeddings from the API
      return Array(1536).fill(0).map(() => Math.random() * 2 - 1);
    } catch (error) {
      console.error("Embedding generation error:", error);
      throw error;
    }
  }
};
