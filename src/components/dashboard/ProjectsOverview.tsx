
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Folder, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  progress: number;
}

const projects: Project[] = [
  {
    id: "work",
    name: "Work",
    description: "Work-related documents, meeting notes, and project plans",
    itemCount: 24,
    progress: 65
  },
  {
    id: "personal",
    name: "Personal",
    description: "Personal development materials and resources",
    itemCount: 13,
    progress: 40
  },
  {
    id: "learning",
    name: "Learning",
    description: "Online courses and study materials",
    itemCount: 32,
    progress: 80
  }
];

const ProjectsOverview = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center">
          <Folder className="h-5 w-5 mr-2 text-primary" />
          Projects
        </h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="glass-card hover:shadow-glow transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{project.itemCount} items</span>
                  <span>{project.progress}% organized</span>
                </div>
                <Progress value={project.progress} className="h-1" />
                <Button variant="ghost" className="w-full justify-start p-0 h-auto" asChild>
                  <Link to={`/dashboard/projects/${project.id}`}>
                    View project <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsOverview;
