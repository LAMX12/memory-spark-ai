
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookOpen, File, FileText, Mail, Video } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

const integrations: Integration[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Connect your emails and archive important information",
    icon: Mail
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Index and search through all your documents",
    icon: File
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Save and summarize videos you watch",
    icon: Video
  },
  {
    id: "kindle",
    name: "Kindle",
    description: "Sync your reading highlights and notes",
    icon: BookOpen
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Access all your stored files and documents",
    icon: FileText
  }
];

interface OnboardingStepThreeProps {
  onComplete: (data: { integrations: string[] }) => void;
}

const OnboardingStepThree = ({ onComplete }: OnboardingStepThreeProps) => {
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  
  const toggleIntegration = (id: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };
  
  const handleSubmit = () => {
    onComplete({ integrations: selectedIntegrations });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Connect Your Digital Life</h1>
        <p className="text-muted-foreground">Choose the services you'd like to integrate with SecondBrain AI.</p>
      </div>
      
      <div className="space-y-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <integration.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label className="font-medium">{integration.name}</Label>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
              </div>
            </div>
            <Switch
              checked={selectedIntegrations.includes(integration.id)}
              onCheckedChange={() => toggleIntegration(integration.id)}
            />
          </div>
        ))}
        
        <p className="text-sm text-muted-foreground">
          Note: You can always add or remove integrations later from your settings.
        </p>
      </div>
    </div>
  );
};

export default OnboardingStepThree;
