
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileUp, Link, Youtube, Mail, FileText, MessageSquareText } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import contentService, { ContentType } from "@/lib/content";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { googleService } from "@/lib/api/google";
import { openaiService } from "@/lib/api/openai";

// Form schema for link submission
const linkSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

// Form schema for text content
const textSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

// Form schema for YouTube URL
const youtubeSchema = z.object({
  url: z.string()
    .refine(
      (value) => {
        return value.includes("youtube.com/watch") || value.includes("youtu.be/");
      },
      { message: "Please enter a valid YouTube URL" }
    )
});

const AddContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("link");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Form for link submission
  const linkForm = useForm<z.infer<typeof linkSchema>>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      url: "",
    },
  });
  
  // Form for text content
  const textForm = useForm<z.infer<typeof textSchema>>({
    resolver: zodResolver(textSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });
  
  // Form for YouTube URL
  const youtubeForm = useForm<z.infer<typeof youtubeSchema>>({
    resolver: zodResolver(youtubeSchema),
    defaultValues: {
      url: "",
    },
  });
  
  const processLink = async (data: z.infer<typeof linkSchema>) => {
    if (!user) {
      toast.error("You must be logged in to add content");
      return;
    }
    
    setIsProcessing(true);
    try {
      // Determine content type based on URL
      const url = data.url;
      let contentType: ContentType = "article";
      
      if (url.includes(".pdf")) {
        contentType = "pdf";
      } else if (url.includes("docs.google.com")) {
        contentType = "document";
      } else if (url.includes("mail.google.com")) {
        contentType = "email";
      }
      
      // Simulate content extraction
      await new Promise(resolve => setTimeout(resolve, 1500));
      const extractedContent = "This is extracted content from the provided link. In a production environment, this would contain the actual content from the URL that was provided.";
      
      // Generate summary using OpenAI
      const summary = await openaiService.summarize({
        content: extractedContent,
        contentType,
        title: url.split("/").pop() || "Untitled"
      });
      
      // Add to content library
      const newContent = await contentService.addContent({
        title: url.split("/").pop() || "Web Content",
        type: contentType,
        source: new URL(url).hostname,
        sourceUrl: url,
        summary: summary.summary,
        keyPoints: summary.keyPoints,
        actionItems: summary.actionItems,
        tags: [],
        isFavorite: false,
        projectIds: [],
        userId: user.id,
      });
      
      toast.success("Content added to your library");
      navigate(`/dashboard/content/${newContent.id}`);
    } catch (error) {
      console.error("Error processing link:", error);
      toast.error("Failed to process the link. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const processText = async (data: z.infer<typeof textSchema>) => {
    if (!user) {
      toast.error("You must be logged in to add content");
      return;
    }
    
    setIsProcessing(true);
    try {
      // Generate summary using OpenAI
      const summary = await openaiService.summarize({
        content: data.content,
        contentType: "note",
        title: data.title
      });
      
      // Add to content library
      const newContent = await contentService.addContent({
        title: data.title,
        type: "note",
        source: "Manual Entry",
        summary: summary.summary,
        keyPoints: summary.keyPoints,
        actionItems: summary.actionItems,
        tags: [],
        isFavorite: false,
        projectIds: [],
        userId: user.id,
      });
      
      toast.success("Note added to your library");
      navigate(`/dashboard/content/${newContent.id}`);
    } catch (error) {
      console.error("Error processing note:", error);
      toast.error("Failed to process the note. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const processYouTube = async (data: z.infer<typeof youtubeSchema>) => {
    if (!user) {
      toast.error("You must be logged in to add content");
      return;
    }
    
    setIsProcessing(true);
    try {
      // Get YouTube video details
      const videoDetails = await googleService.getYouTubeVideoDetails(data.url);
      
      if (!videoDetails) {
        throw new Error("Could not retrieve video details");
      }
      
      // Simulate transcript extraction
      await new Promise(resolve => setTimeout(resolve, 2000));
      const simulatedTranscript = `This is a simulated transcript for the video ${videoDetails.title}. In a production environment, this would contain the actual transcript extracted from the YouTube video.`;
      
      // Generate summary using OpenAI
      const summary = await openaiService.summarize({
        content: simulatedTranscript,
        contentType: "video",
        title: videoDetails.title
      });
      
      // Add to content library
      const newContent = await contentService.addContent({
        title: videoDetails.title,
        type: "video",
        source: "YouTube",
        sourceUrl: data.url,
        summary: summary.summary,
        keyPoints: summary.keyPoints,
        actionItems: summary.actionItems,
        tags: [],
        isFavorite: false,
        projectIds: [],
        userId: user.id,
      });
      
      toast.success("YouTube video added to your library");
      navigate(`/dashboard/content/${newContent.id}`);
    } catch (error) {
      console.error("Error processing YouTube video:", error);
      toast.error("Failed to process the YouTube video. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast.error("You must be logged in to add content");
      return;
    }
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is a PDF
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported for now");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Simulate file upload with progress
      const simulateUploadProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            processPdf(file);
          }
        }, 300);
      };
      
      simulateUploadProgress();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
      setIsUploading(false);
    }
  };
  
  const processPdf = async (file: File) => {
    if (!user) return;
    
    try {
      setIsProcessing(true);
      
      // Simulate PDF text extraction
      await new Promise(resolve => setTimeout(resolve, 1500));
      const extractedText = `This is extracted text from the PDF ${file.name}. In a production environment, this would contain the actual text extracted from the PDF file.`;
      
      // Generate summary using OpenAI
      const summary = await openaiService.summarize({
        content: extractedText,
        contentType: "pdf",
        title: file.name
      });
      
      // Add to content library
      const newContent = await contentService.addContent({
        title: file.name,
        type: "pdf",
        source: "File Upload",
        summary: summary.summary,
        keyPoints: summary.keyPoints,
        actionItems: summary.actionItems,
        tags: [],
        isFavorite: false,
        projectIds: [],
        userId: user.id,
      });
      
      toast.success("PDF added to your library");
      navigate(`/dashboard/content/${newContent.id}`);
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast.error("Failed to process PDF. Please try again.");
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Add New Content</h1>
        <p className="text-muted-foreground mb-6">
          Add content from different sources to your Second Brain
        </p>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full grid grid-cols-5">
            <TabsTrigger value="link">
              <Link className="h-4 w-4 mr-2" />
              Web Link
            </TabsTrigger>
            <TabsTrigger value="file">
              <FileUp className="h-4 w-4 mr-2" />
              Upload PDF
            </TabsTrigger>
            <TabsTrigger value="youtube">
              <Youtube className="h-4 w-4 mr-2" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="gmail">
              <Mail className="h-4 w-4 mr-2" />
              Gmail
            </TabsTrigger>
            <TabsTrigger value="note">
              <MessageSquareText className="h-4 w-4 mr-2" />
              Text Note
            </TabsTrigger>
          </TabsList>
          
          {/* Link tab */}
          <TabsContent value="link">
            <Card>
              <CardHeader>
                <CardTitle>Add Web Content</CardTitle>
                <CardDescription>
                  Add content from articles, blogs, or any web page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...linkForm}>
                  <form onSubmit={linkForm.handleSubmit(processLink)} className="space-y-6">
                    <FormField
                      control={linkForm.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Web URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/article" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Add to Library"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* File upload tab */}
          <TabsContent value="file">
            <Card>
              <CardHeader>
                <CardTitle>Upload PDF Document</CardTitle>
                <CardDescription>
                  Upload a PDF file to extract and summarize its content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isUploading ? (
                    <div className="space-y-4">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        {isProcessing ? "Processing document..." : `Uploading... ${uploadProgress}%`}
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Drop your PDF file here</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Supports PDF files up to 10MB
                      </p>
                      <Button className="relative" disabled={isUploading}>
                        Select File
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          accept=".pdf"
                          onChange={handleFileUpload} 
                        />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* YouTube tab */}
          <TabsContent value="youtube">
            <Card>
              <CardHeader>
                <CardTitle>Add YouTube Video</CardTitle>
                <CardDescription>
                  Extract and summarize content from YouTube videos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...youtubeForm}>
                  <form onSubmit={youtubeForm.handleSubmit(processYouTube)} className="space-y-6">
                    <FormField
                      control={youtubeForm.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing video...
                        </>
                      ) : (
                        "Add to Library"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Gmail tab */}
          <TabsContent value="gmail">
            <Card>
              <CardHeader>
                <CardTitle>Import from Gmail</CardTitle>
                <CardDescription>
                  Connect your Gmail account to import and summarize emails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Connect to Gmail</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Grant access to your Gmail account to import emails
                  </p>
                  <Button onClick={() => toast.info("Gmail integration enabled for demonstration")}>
                    Connect Gmail Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Note tab */}
          <TabsContent value="note">
            <Card>
              <CardHeader>
                <CardTitle>Create Text Note</CardTitle>
                <CardDescription>
                  Write your own notes and get AI summaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...textForm}>
                  <form onSubmit={textForm.handleSubmit(processText)} className="space-y-6">
                    <FormField
                      control={textForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Note Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={textForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your note content here..." 
                              className="min-h-[200px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Add to Library"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AddContent;
