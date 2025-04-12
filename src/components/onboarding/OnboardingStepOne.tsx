
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AtSign, User } from "lucide-react";

interface OnboardingStepOneProps {
  onComplete: (data: { name: string; email: string }) => void;
}

const OnboardingStepOne = ({ onComplete }: OnboardingStepOneProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "" });

  const handleSubmit = () => {
    const newErrors = { name: "", email: "" };
    let isValid = true;
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (isValid) {
      onComplete({ name, email });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Welcome to SecondBrain AI</h1>
        <p className="text-muted-foreground">Let's start by getting to know you.</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              id="name"
              placeholder="Enter your full name"
              className="pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Your Email</Label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              id="email"
              placeholder="Enter your email address"
              type="email"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
        </div>
      </div>
      
      <Button onClick={handleSubmit} className="w-full">Continue</Button>
    </div>
  );
};

export default OnboardingStepOne;
