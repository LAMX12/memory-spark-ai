
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const OnboardingComplete = () => {
  const { toast } = useToast();
  
  const handleGetStarted = () => {
    toast({
      title: "Account Created!",
      description: "Welcome to SecondBrain AI. Your digital brain is ready.",
    });
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">You're All Set!</h1>
        <p className="text-muted-foreground">
          Your SecondBrain AI account is ready to use. Start saving and organizing your knowledge.
        </p>
      </div>
      
      <div className="py-4">
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="font-medium mb-2">What's next?</h3>
          <ul className="text-sm text-muted-foreground space-y-2 text-left">
            <li className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">1</div>
              <span>Install the browser extension to save content as you browse</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">2</div>
              <span>Connect your first integration to import existing knowledge</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">3</div>
              <span>Create your first project board to organize your ideas</span>
            </li>
          </ul>
        </div>
      </div>
      
      <Button asChild onClick={handleGetStarted} className="w-full">
        <Link to="/dashboard">
          Go to Dashboard
        </Link>
      </Button>
    </div>
  );
};

export default OnboardingComplete;
