
import { ChangeEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Briefcase, FileBadge, GraduationCap, Telescope, Users } from "lucide-react";

interface UserType {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const userTypes: UserType[] = [
  {
    id: "student",
    label: "Student",
    description: "I'm learning and need to organize my study materials",
    icon: GraduationCap
  },
  {
    id: "professional",
    label: "Knowledge Worker",
    description: "I process lots of information in my job daily",
    icon: Briefcase
  },
  {
    id: "creator",
    label: "Creator",
    description: "I create content and need to organize my research",
    icon: BookOpen
  },
  {
    id: "entrepreneur",
    label: "Solopreneur",
    description: "I run my own business and need to stay on top of things",
    icon: Telescope
  },
  {
    id: "team",
    label: "Team Member",
    description: "I work with a team and need to share knowledge",
    icon: Users
  },
  {
    id: "other",
    label: "Other",
    description: "My use case is different",
    icon: FileBadge
  }
];

interface OnboardingStepTwoProps {
  onComplete: (data: { userTypes: string[] }) => void;
}

const OnboardingStepTwo = ({ onComplete }: OnboardingStepTwoProps) => {
  const [selectedUserTypes, setSelectedUserTypes] = useState<string[]>([]);
  const [error, setError] = useState("");
  
  const handleUserTypeToggle = (id: string) => {
    setSelectedUserTypes((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
    
    if (error) {
      setError("");
    }
  };
  
  const handleSubmit = () => {
    if (selectedUserTypes.length === 0) {
      setError("Please select at least one option");
      return;
    }
    
    onComplete({ userTypes: selectedUserTypes });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">How will you use SecondBrain AI?</h1>
        <p className="text-muted-foreground">This helps us tailor your experience.</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userTypes.map((type) => (
            <div
              key={type.id}
              className={`flex items-start space-x-3 p-4 rounded-lg cursor-pointer border transition-colors ${
                selectedUserTypes.includes(type.id)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleUserTypeToggle(type.id)}
            >
              <Checkbox
                checked={selectedUserTypes.includes(type.id)}
                onCheckedChange={() => handleUserTypeToggle(type.id)}
                id={`type-${type.id}`}
                className="mt-1"
              />
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <type.icon className="h-4 w-4 text-primary" />
                  <Label
                    htmlFor={`type-${type.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {type.label}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            </div>
          ))}
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default OnboardingStepTwo;
