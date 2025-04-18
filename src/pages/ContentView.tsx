
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star, StarOff, Tag, BookmarkPlus, Share2, FileText, Video, Mail, Newspaper, FileType, Archive, Pencil, Trash2 } from "lucide-react";
import contentService, { Content } from "@/lib/content";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ContentView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingTag, setAddingTag] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchContent = () => {
      if (!id || !user) return;
      
      try {
        const foundContent = contentService.getContentById(id);
        if (foundContent) {
          setContent(foundContent);
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
  }, [id, user, navigate]);
  
  const toggleFavorite = () => {
    if (!content) return;
    
    try {
      const updated = contentService.toggleFavorite(content.id);
      if (updated) {
        setContent(updated);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  
  const handleAddTag = () => {
    if (!content || !newTag.trim()) return;
    
    try {
      const updated = contentService.addTagToContent(content.id, newTag.trim());
      if (updated) {
        setContent(updated);
        setNewTag("");
        setAddingTag(false);
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    if (!content) return;
    
    try {
      const updated = contentService.removeTagFromContent(content.id, tag);
      if (updated) {
        setContent(updated);
      }
    } catch (error) {
      console.error("Error removing tag:", error);
    }
  };
  
  const handleDelete = () => {
    if (!content) return;
    
    try {
      if (contentService.deleteContent(content.id)) {
        toast.success("Content deleted");
        navigate("/dashboard/content");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content");
    }
  };
  
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="h-5 w-5" />;
      case "video": return <Video className="h-5 w-5" />;
      case "email": return <Mail className="h-5 w-5" />;
      case "article": return <Newspaper className="h-5 w-5" />;
      case "document": return <FileType className="h-5 w-5" />;
      case "note": return <Pencil className="h-5 w-5" />;
      default: return <Archive className="h-5 w-5" />;
    }
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!content) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The content you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/dashboard/content")}>
              Back to Content Library
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="mr-3 p-2 rounded-full bg-primary/10">
              {getContentTypeIcon(content.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{content.title}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFavorite}
                  className="ml-2"
                >
                  {content.isFavorite ? (
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>From {content.source}</span>
                <span>•</span>
                <span>{new Date(content.date).toLocaleDateString()}</span>
                <span>•</span>
                <span className="capitalize">{content.type}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Add to Project
            </Button>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete "{content.title}"? This action cannot be undone.</p>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Tags section */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Tags:</span>
          {content.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="flex items-center gap-1 group"
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
              <button 
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 rounded-full hover:bg-muted p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </Badge>
          ))}
          {addingTag ? (
            <div className="flex items-center gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="h-8 w-40 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  } else if (e.key === 'Escape') {
                    setAddingTag(false);
                    setNewTag("");
                  }
                }}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleAddTag}
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAddingTag(false);
                  setNewTag("");
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => setAddingTag(true)}
            >
              + Add tag
            </Button>
          )}
        </div>
        
        {/* Summary section */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Summary</h2>
            <p className="text-lg mb-6">{content.summary}</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3">Key Points</h3>
                <ul className="space-y-2 list-disc pl-5">
                  {content.keyPoints?.map((point, index) => (
                    <li key={index} className="text-lg">{point}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Action Items</h3>
                <ul className="space-y-2 list-disc pl-5">
                  {content.actionItems?.map((item, index) => (
                    <li key={index} className="text-lg">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Source section */}
        {content.sourceUrl && (
          <div>
            <h3 className="text-xl font-bold mb-3">Source</h3>
            <a
              href={content.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {content.sourceUrl}
            </a>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContentView;
