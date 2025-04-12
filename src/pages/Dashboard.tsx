
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MemoryRefresh from "@/components/dashboard/MemoryRefresh";
import ProjectsOverview from "@/components/dashboard/ProjectsOverview";
import RecentContent from "@/components/dashboard/RecentContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AtSign, FilePlus2, Upload } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, John!</h1>
            <p className="text-muted-foreground">
              Your Second Brain is ready to help you remember and organize.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button size="sm">
              <FilePlus2 className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card border-primary/10">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex-center">
                <AtSign className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Complete your profile</h3>
                <p className="text-sm text-muted-foreground">Add more details to personalize your experience</p>
              </div>
              <Button variant="outline" size="sm">Complete</Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-primary/10">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex-center">
                <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Install browser extension</h3>
                <p className="text-sm text-muted-foreground">Save content as you browse the web</p>
              </div>
              <Button variant="outline" size="sm">Install</Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-primary/10">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex-center">
                <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Invite your team</h3>
                <p className="text-sm text-muted-foreground">Collaborate with colleagues or friends</p>
              </div>
              <Button variant="outline" size="sm">Invite</Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Content Section */}
        <RecentContent />
        
        {/* Projects and Memory Refresh */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ProjectsOverview />
          </div>
          <div>
            <MemoryRefresh memories={[]} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
