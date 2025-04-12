
import { BookOpen, Files, Folder, Home, Layers, Library, Plus, Sparkles, Star, Video } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Navigation links
const mainNavItems = [
  {
    title: "Home",
    icon: Home,
    href: "/dashboard"
  },
  {
    title: "Daily Insights",
    icon: Sparkles,
    href: "/dashboard/insights"
  },
  {
    title: "Projects",
    icon: Folder,
    href: "/dashboard/projects"
  },
  {
    title: "Favorites",
    icon: Star,
    href: "/dashboard/favorites"
  }
];

const contentNavItems = [
  {
    title: "All Content",
    icon: Library,
    href: "/dashboard/content"
  },
  {
    title: "Documents",
    icon: Files,
    href: "/dashboard/documents"
  },
  {
    title: "Articles",
    icon: BookOpen,
    href: "/dashboard/articles"
  },
  {
    title: "Videos",
    icon: Video,
    href: "/dashboard/videos"
  }
];

export const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent className="p-0">
        {/* New Item Button */}
        <div className="p-4">
          <Button className="w-full justify-center" size="sm">
            <Plus className="h-4 w-4 mr-2" /> New
          </Button>
        </div>
        
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Content Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Projects */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center">
            <span>Projects</span>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/projects/work">
                    <Layers className="h-4 w-4 mr-2" />
                    <span>Work</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/projects/personal">
                    <Layers className="h-4 w-4 mr-2" />
                    <span>Personal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/projects/learning">
                    <Layers className="h-4 w-4 mr-2" />
                    <span>Learning</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
