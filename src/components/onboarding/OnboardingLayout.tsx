
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const OnboardingLayout = ({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isLastStep,
  isFirstStep
}: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <header className="w-full py-4 border-b border-border">
        <div className="content-container flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">SecondBrain AI</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-2xl glass-card animate-scale-in border-primary/10">
          <div className="p-6 md:p-8">
            {children}
            
            <div className="mt-8 flex justify-between items-center pt-6 border-t border-border">
              <Button 
                variant="outline"
                onClick={onPrevious}
                disabled={isFirstStep}
                className={isFirstStep ? "invisible" : ""}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <div className="flex space-x-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div 
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      currentStep >= index + 1 ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              
              <Button onClick={onNext}>
                {isLastStep ? "Get Started" : "Continue"}
                {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default OnboardingLayout;
