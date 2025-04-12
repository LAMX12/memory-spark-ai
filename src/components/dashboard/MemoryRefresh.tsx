
import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Memory {
  id: string;
  content: string;
  source: string;
  date: string;
}

interface MemoryRefreshProps {
  memories: Memory[];
}

const dummyMemories: Memory[] = [
  {
    id: "1",
    content: "The Pomodoro Technique is a time management method that uses a timer to break work into 25-minute intervals separated by short breaks.",
    source: "Productivity article",
    date: "2 weeks ago"
  },
  {
    id: "2",
    content: "A growth mindset is the belief that abilities can be developed through dedication and hard work. This view creates a love of learning and resilience.",
    source: "Psychology video",
    date: "1 month ago"
  },
  {
    id: "3",
    content: "The Pareto principle states that for many outcomes, roughly 80% of consequences come from 20% of causes.",
    source: "Business book",
    date: "3 months ago"
  }
];

const MemoryRefresh = ({ memories = dummyMemories }: MemoryRefreshProps) => {
  const { toast } = useToast();
  
  const handleAcknowledge = (id: string) => {
    toast({
      title: "Memory refreshed!",
      description: "We'll remind you about this again later."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center">
          <Brain className="h-5 w-5 mr-2 text-primary" />
          Memory Refreshes
        </h3>
        <Button variant="link" size="sm">View all</Button>
      </div>
      
      <div className="space-y-3">
        {memories.map((memory) => (
          <Card key={memory.id} className="p-4 glass-card">
            <p className="text-sm mb-3">
              {memory.content}
            </p>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <div>
                From: {memory.source} • {memory.date}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => handleAcknowledge(memory.id)}
              >
                I remember this
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemoryRefresh;
