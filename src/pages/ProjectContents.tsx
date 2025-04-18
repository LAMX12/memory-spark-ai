
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Settings } from "lucide-react";
import contentService, { Content, Project } from "@/lib/content";
import { useAuth } from "@/contexts/AuthContext";
import ContentCard from "@/components/dashboard/ContentCard";

const ProjectContents = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjectData = () => {
      if (!id || !user) return;
      
      try {
        const foundProject = contentService.getProjectById(id);
        if (foundProject) {
          setProject(foundProject);
          const projectContents = contentService.getContentsByProject(id);
          setContents(projectContents);
        } else {
          navigate("/dashboard/projects");
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id, user, navigate]);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!project) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard/projects")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/dashboard/projects")}>
              View All Projects
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard/projects")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div 
            className="h-10 w-10 rounded-lg flex items-center justify-center mr-4"
            style={{ backgroundColor: project.color || '#8B5CF6' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
          
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        {contents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map(content => (
              <ContentCard
                key={content.id}
                id={content.id}
                title={content.title}
                excerpt={content.summary || ""}
                type={content.type as any}
                date={new Date(content.date).toLocaleDateString()}
                source={content.source}
                isFavorite={content.isFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground opacity-20 mb-4">
              <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
            </svg>
            <h2 className="text-2xl font-medium mb-2">No content yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              This project doesn't have any content yet. Add some content from your library to this project.
            </p>
            <Button onClick={() => navigate("/dashboard/content")}>
              Browse Content Library
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectContents;
