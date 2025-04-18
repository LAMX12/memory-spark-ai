
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ContentGrid from "@/components/dashboard/ContentGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Loader2, Plus, Video } from "lucide-react";
import { ContentType } from "@/components/dashboard/ContentCard";
import contentService, { Content } from "@/lib/content";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ContentLibrary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    if (user) {
      const fetchContents = () => {
        try {
          const userContents = contentService.getContents(user.id);
          setContents(userContents);
        } catch (error) {
          console.error("Error fetching contents:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchContents();
    }
  }, [user]);
  
  const getFilteredContents = (filterType?: ContentType) => {
    if (!filterType) return contents;
    return contents.filter(content => content.type === filterType);
  };
  
  const handleAddContent = () => {
    navigate("/dashboard/add-content");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Content Library</h1>
            <p className="text-muted-foreground">
              Browse through all your saved content
            </p>
          </div>
          
          <Button onClick={handleAddContent}>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="document" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="article" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center">
                <Video className="h-4 w-4 mr-2" />
                Videos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredContents().map((item) => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    excerpt={item.summary || "No summary available"}
                    type={item.type}
                    date={new Date(item.date).toLocaleDateString()}
                    source={item.source}
                    isFavorite={item.isFavorite}
                  />
                ))}
                
                {getFilteredContents().length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No content found. Add some content to get started.</p>
                    <Button onClick={handleAddContent} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Content
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="document">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredContents("document").map((item) => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    excerpt={item.summary || "No summary available"}
                    type={item.type}
                    date={new Date(item.date).toLocaleDateString()}
                    source={item.source}
                    isFavorite={item.isFavorite}
                  />
                ))}
                
                {getFilteredContents("document").length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No documents found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="article">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredContents("article").map((item) => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    excerpt={item.summary || "No summary available"}
                    type={item.type}
                    date={new Date(item.date).toLocaleDateString()}
                    source={item.source}
                    isFavorite={item.isFavorite}
                  />
                ))}
                
                {getFilteredContents("article").length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No articles found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="video">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredContents("video").map((item) => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    excerpt={item.summary || "No summary available"}
                    type={item.type}
                    date={new Date(item.date).toLocaleDateString()}
                    source={item.source}
                    isFavorite={item.isFavorite}
                  />
                ))}
                
                {getFilteredContents("video").length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No videos found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContentLibrary;

