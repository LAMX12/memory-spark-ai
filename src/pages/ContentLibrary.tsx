
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ContentGrid from "@/components/dashboard/ContentGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Video } from "lucide-react";
import { ContentType } from "@/components/dashboard/ContentCard";

const ContentLibrary = () => {
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
          
          <Button>Add Content</Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ContentGrid title="All Content" />
          </TabsContent>
          
          <TabsContent value="documents">
            <ContentGrid title="Documents" filterType="document" />
          </TabsContent>
          
          <TabsContent value="articles">
            <ContentGrid title="Articles" filterType="article" />
          </TabsContent>
          
          <TabsContent value="videos">
            <ContentGrid title="Videos" filterType="video" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ContentLibrary;
