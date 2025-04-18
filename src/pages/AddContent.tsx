
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, ChevronLeft, File, FileText, Loader2, Mail, Upload, Video, Youtube } from "lucide-react";
import contentService, { Content, ContentType } from "@/lib/content";
import { googleService } from "@/lib/api/google";
import { useAuth } from "@/contexts/AuthContext";

const AddContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("youtube");
  const [loading, setLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [manualContent, setManualContent] = useState({
    title: "",
    content: "",
    source: "",
    type: "note" as ContentType,
  });
  
  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim() || !user) return;
    
    setLoading(true);
    
    try {
      // Fetch YouTube video details
      const videoDetails = await googleService.getYouTubeVideoDetails(youtubeUrl);
      
      if (!videoDetails) {
        throw new Error("Failed to get video details");
      }
      
      // Generate summary using OpenAI
      const summaryResponse = await contentService.summarizeContent(
        `Video title: ${videoDetails.title}\nVideo description: ${videoDetails.description}`,
        "video",
        videoDetails.title
      );
      
      // Save content to user's library
      const newContent = await contentService.addContent({
        title: videoDetails.title,
        type: "video",
        source: "YouTube",
        sourceUrl: `https://youtube.com/watch?v=${videoDetails.id}`,
        summary: summaryResponse.summary,
        keyPoints: summaryResponse.keyPoints,
        actionItems: summaryResponse.actionItems,
        tags: [],
        isFavorite: false,
        projectIds: [],
        userId: user.id
      });
      
      // Navigate to the new content
      navigate(`/dashboard/content/${newContent.id}`);
    } catch (error) {
      console.error("Error processing YouTube video:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualContent.title.trim() || !manualContent.content.trim() || !user) return;
    
    setLoading(true);
    
    try {
      // Generate summary using OpenAI
      const summaryResponse = await contentService.summarizeContent(
        manualContent.content,
        manualContent.type,
        manualContent.title
      );
      
      // Save content to user's library
      const newContent = await contentService.addContent({
        title: manualContent.title,
        type: manualContent.type,
        source: manualContent.source || "Manual Entry",
        summary: summaryResponse.summary,
        keyPoints: summaryResponse.keyPoints,
        actionItems: summaryResponse.actionItems,
        tags: [],
        isFavorite: false,
        projectIds: [],
        userId: user.id
      });
      
      // Navigate to the new content
      navigate(`/dashboard/content/${newContent.id}`);
    } catch (error) {
      console.error("Error processing manual content:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "article":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-1">Add Content</h1>
          <p className="text-muted-foreground">
            Add new content to your Second Brain
          </p>
        </div>
        
        <Card className="p-6 glass-card">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-6 overflow-x-auto">
              <TabsTrigger value="youtube" className="flex items-center">
                <Youtube className="h-4 w-4 mr-2" />
                YouTube
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center">
                <File className="h-4 w-4 mr-2" />
                Manual Entry
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="youtube" className="space-y-4">
              <form onSubmit={handleYoutubeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="youtube-url">YouTube URL</Label>
                  <Input
                    id="youtube-url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste a YouTube video URL to add it to your Second Brain
                  </p>
                </div>
                
                <Button
                  type="submit"
                  disabled={loading || !youtubeUrl.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>Add YouTube Video</>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-10 text-center">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">Upload a File</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag and drop a file here, or click to browse
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                />
                <Button className="mt-4">
                  Select File
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: PDF, DOCX, TXT (max 10MB)
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="manual" className="space-y-4">
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content-title">Title</Label>
                  <Input
                    id="content-title"
                    placeholder="Enter title"
                    value={manualContent.title}
                    onChange={(e) => setManualContent({...manualContent, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type</Label>
                  <select
                    id="content-type"
                    className="w-full rounded-md border border-border bg-transparent px-3 py-2"
                    value={manualContent.type}
                    onChange={(e) => setManualContent({...manualContent, type: e.target.value as ContentType})}
                  >
                    <option value="note">Note</option>
                    <option value="article">Article</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content-source">Source (Optional)</Label>
                  <Input
                    id="content-source"
                    placeholder="Where is this content from?"
                    value={manualContent.source}
                    onChange={(e) => setManualContent({...manualContent, source: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content-text">Content</Label>
                  <Textarea
                    id="content-text"
                    placeholder="Enter or paste your content here..."
                    rows={10}
                    value={manualContent.content}
                    onChange={(e) => setManualContent({...manualContent, content: e.target.value})}
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={loading || !manualContent.title.trim() || !manualContent.content.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>Add Content</>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddContent;

