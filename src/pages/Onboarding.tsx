
import { useState } from "react";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import OnboardingStepOne from "@/components/onboarding/OnboardingStepOne";
import OnboardingStepTwo from "@/components/onboarding/OnboardingStepTwo";
import OnboardingStepThree from "@/components/onboarding/OnboardingStepThree";
import OnboardingComplete from "@/components/onboarding/OnboardingComplete";
import { useNavigate } from "react-router-dom";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    userTypes: [] as string[],
    integrations: [] as string[]
  });
  const navigate = useNavigate();
  
  const totalSteps = 4;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Complete onboarding and navigate to dashboard
      navigate("/dashboard");
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  
  const handleStepOneComplete = (data: { name: string; email: string }) => {
    setUserData((prev) => ({ ...prev, ...data }));
    handleNext();
  };
  
  const handleStepTwoComplete = (data: { userTypes: string[] }) => {
    setUserData((prev) => ({ ...prev, ...data }));
    handleNext();
  };
  
  const handleStepThreeComplete = (data: { integrations: string[] }) => {
    setUserData((prev) => ({ ...prev, ...data }));
    handleNext();
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStepOne onComplete={handleStepOneComplete} />;
      case 2:
        return <OnboardingStepTwo onComplete={handleStepTwoComplete} />;
      case 3:
        return <OnboardingStepThree onComplete={handleStepThreeComplete} />;
      case 4:
        return <OnboardingComplete />;
      default:
        return <OnboardingStepOne onComplete={handleStepOneComplete} />;
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isLastStep={currentStep === totalSteps}
      isFirstStep={currentStep === 1}
    >
      {renderStep()}
    </OnboardingLayout>
  );
};

export default OnboardingPage;
