
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FolderPlus, MoreVertical, Pencil, Trash2, Clock, Box } from "lucide-react";
import contentService, { Project } from "@/lib/content";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const PROJECT_COLORS = [
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F97316", // Orange
  "#10B981", // Green
  "#0EA5E9", // Blue
  "#F59E0B"  // Amber
];

const ProjectsView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0]);
  
  useEffect(() => {
    if (user) {
      const userProjects = contentService.getProjects(user.id);
      setProjects(userProjects);
    }
  }, [user]);
  
  const createProject = () => {
    if (!user) return;
    
    if (!newProjectName.trim()) {
      toast.error("Please provide a project name");
      return;
    }
    
    const newProject = contentService.createProject({
      name: newProjectName,
      description: newProjectDescription,
      color: selectedColor,
      userId: user.id
    });
    
    setProjects([...projects, newProject]);
    setNewProjectName("");
    setNewProjectDescription("");
    setSelectedColor(PROJECT_COLORS[0]);
    setIsCreateDialogOpen(false);
  };
  
  const updateProject = () => {
    if (!currentProject) return;
    
    if (!newProjectName.trim()) {
      toast.error("Please provide a project name");
      return;
    }
    
    const updatedProject = contentService.updateProject(currentProject.id, {
      name: newProjectName,
      description: newProjectDescription,
      color: selectedColor
    });
    
    if (updatedProject) {
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      setIsEditDialogOpen(false);
    }
  };
  
  const deleteProject = (projectId: string) => {
    if (contentService.deleteProject(projectId)) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };
  
  const openEditDialog = (project: Project) => {
    setCurrentProject(project);
    setNewProjectName(project.name);
    setNewProjectDescription(project.description || "");
    setSelectedColor(project.color);
    setIsEditDialogOpen(true);
  };
  
  const viewProjectContents = (projectId: string) => {
    navigate(`/dashboard/projects/${projectId}`);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Projects</h1>
            <p className="text-muted-foreground">
              Organize your knowledge by topics and projects
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new project</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="project-name">Project name</Label>
                  <Input 
                    id="project-name" 
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="E.g., Work Research"
                  />
                </div>
                
                <div>
                  <Label htmlFor="project-description">Description (optional)</Label>
                  <Textarea 
                    id="project-description" 
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="What is this project about?"
                  />
                </div>
                
                <div>
                  <Label>Project color</Label>
                  <div className="flex gap-2 mt-2">
                    {PROJECT_COLORS.map((color) => (
                      <button
                        key={color}
                        className={`h-8 w-8 rounded-full ${selectedColor === color ? 'ring-2 ring-white' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createProject}>Create project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit project</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit-project-name">Project name</Label>
                  <Input 
                    id="edit-project-name" 
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-project-description">Description (optional)</Label>
                  <Textarea 
                    id="edit-project-description" 
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Project color</Label>
                  <div className="flex gap-2 mt-2">
                    {PROJECT_COLORS.map((color) => (
                      <button
                        key={color}
                        className={`h-8 w-8 rounded-full ${selectedColor === color ? 'ring-2 ring-white' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={updateProject}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="glass-card hover:shadow-glow transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: project.color || '#8B5CF6' }}
                  >
                    <Box className="h-5 w-5 text-white" />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(project)}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  {project.description && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {project.description}
                    </p>
                  )}
                </div>
                
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
              
              <CardFooter className="p-5 pt-0 flex justify-between">
                <div className="text-sm">
                  {project.contentIds.length} items
                </div>
                <Button
                  size="sm"
                  onClick={() => viewProjectContents(project.id)}
                >
                  View Project
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {projects.length === 0 && (
          <div className="text-center py-16">
            <Box className="h-16 w-16 mx-auto text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-xl font-medium">No projects yet</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Projects help you organize related content. Create your first project to get started.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-6">
              <FolderPlus className="h-4 w-4 mr-2" />
              Create your first project
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectsView;

