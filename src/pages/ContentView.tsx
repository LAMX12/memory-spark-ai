
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import contentService, { Content } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Pencil,
  Trash2,
  Tag,
  Plus,
  FileText,
  Mail,
  Video,
  BookOpen,
  Bookmark
} from "lucide-react";
import { toast } from "sonner";

const ContentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  
  useEffect(() => {
    if (id) {
      const fetchContent = () => {
        try {
          const contentData = contentService.getContentById(id);
          if (contentData) {
            setContent(contentData);
          } else {
            toast.error("Content not found");
            navigate("/dashboard/content");
          }
        } catch (error) {
          console.error("Error fetching content:", error);
          toast.error("Failed to load content");
        } finally {
          setLoading(false);
        }
      };
      
      fetchContent();
    }
  }, [id, navigate]);
  
  const handleAddTag = () => {
    if (!content || !newTag.trim()) return;
    
    const updatedContent = contentService.addTagToContent(content.id, newTag.trim());
    if (updatedContent) {
      setContent(updatedContent);
      setNewTag("");
      setIsAddingTag(false);
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    if (!content) return;
    
    const updatedContent = contentService.removeTagFromContent(content.id, tag);
    if (updatedContent) {
      setContent(updatedContent);
    }
  };
  
  const handleToggleFavorite = () => {
    if (!content) return;
    
    const updatedContent = contentService.toggleFavorite(content.id);
    if (updatedContent) {
      setContent(updatedContent);
    }
  };
  
  const handleDelete = () => {
    if (!content || !window.confirm("Are you sure you want to delete this content?")) return;
    
    if (contentService.deleteContent(content.id)) {
      navigate("/dashboard/content");
    }
  };
  
  const getTypeIcon = () => {
    if (!content) return <FileText />;
    
    switch (content.type) {
      case "pdf":
        return <FileText />;
      case "email":
        return <Mail />;
      case "video":
        return <Video />;
      case "article":
        return <BookOpen />;
      case "note":
        return <Bookmark />;
      default:
        return <FileText />;
    }
  };
  
  const getContentDate = () => {
    if (!content?.date) return "";
    
    const date = new Date(content.date);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="space-x-2">
            {content && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleFavorite}
                  className={content.isFavorite ? "text-yellow-400" : ""}
                >
                  <Star className={`h-5 w-5 ${content.isFavorite ? "fill-yellow-400" : ""}`} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <Pencil className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-2 mt-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : content ? (
          <>
            <div>
              <div className="flex items-center gap-3 mb-2 text-muted-foreground">
                <div className="p-2 rounded-full bg-primary/10">
                  {getTypeIcon()}
                </div>
                <div>
                  <span>{content.type.charAt(0).toUpperCase() + content.type.slice(1)}</span>
                  <span className="mx-2">•</span>
                  <span>{content.source}</span>
                  <span className="mx-2">•</span>
                  <span>{getContentDate()}</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold">{content.title}</h1>
              
              {content.sourceUrl && (
                <a 
                  href={content.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline mt-2"
                >
                  View original source
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              {content.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="pl-2 pr-1 py-0 flex items-center gap-1"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                </Badge>
              ))}
              
              {isAddingTag ? (
                <div className="flex items-center">
                  <Input
                    className="h-8 w-32"
                    placeholder="New tag"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                    autoFocus
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="ml-1"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7 rounded-full"
                  onClick={() => setIsAddingTag(true)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <Card className="p-6 glass-card">
              <div className="space-y-6">
                {content.summary && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <p className="text-muted-foreground">{content.summary}</p>
                  </div>
                )}
                
                {content.keyPoints && content.keyPoints.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Points</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {content.keyPoints.map((point, index) => (
                        <li key={index} className="text-muted-foreground">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {content.actionItems && content.actionItems.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Action Items</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {content.actionItems.map((item, index) => (
                        <li key={index} className="text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold">Content not found</h2>
            <p className="text-muted-foreground mt-2">
              The content you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              onClick={() => navigate("/dashboard/content")}
              className="mt-4"
            >
              Back to Content Library
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContentView;

