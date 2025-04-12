
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Brain, Clock, Files, Search, Share2 } from "lucide-react";

const features = [
  {
    icon: Files,
    title: "Auto-Save & Sync",
    description: "Connect Google Drive, Gmail, YouTube, Kindle, Dropbox to save and index all your content in one place."
  },
  {
    icon: BadgeCheck,
    title: "AI Summarizer",
    description: "Automatically extract key points and action items from PDFs, YouTube videos, emails, and more."
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find exactly what you need with semantic search across all your saved content."
  },
  {
    icon: Clock,
    title: "Memory Refresh",
    description: "Never forget important information with smart reminders using spaced repetition."
  },
  {
    icon: Share2,
    title: "Project Boards",
    description: "Organize your knowledge by project or topic and turn ideas into actionable tasks."
  },
  {
    icon: Brain,
    title: "AI Knowledge Engine",
    description: "Let AI connect dots between your content for new insights and ideas."
  }
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="content-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Knowledge, <span className="text-gradient">Supercharged</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop losing valuable information. SecondBrain AI helps you capture, organize, 
            and leverage everything you consume online.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-primary/10 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
