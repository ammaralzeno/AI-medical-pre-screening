
import { useState } from "react";
import { QuestionnaireProvider } from "@/components/QuestionnaireContext";
import { useQuestionnaire } from "@/components/QuestionnaireContext";
import ProgressBar from "@/components/ProgressBar";
import QuestionStep from "@/components/QuestionStep";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const totalSteps = 4;

const SelectCard = ({ selected, onClick, children, disabled = false }) => (
  <Card
    className={cn(
      "p-4 cursor-pointer transition-all border-2",
      selected ? "border-medical-500 bg-medical-50" : "border-transparent hover:border-medical-200",
      disabled && "opacity-50 cursor-not-allowed"
    )}
    onClick={!disabled ? onClick : undefined}
  >
    {children}
  </Card>
);

const MainQuestionnaire = () => {
  const { currentStep, setCurrentStep, formData, setFormData } = useQuestionnaire();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0:
        if (!formData.name?.trim()) {
          newErrors.name = "Name is required";
        }
        if (!formData.age) {
          newErrors.age = "Age is required";
        }
        break;
      case 1:
        if (!formData.mainSymptom) {
          newErrors.mainSymptom = "Please select a main symptom";
        }
        break;
      case 2:
        if (!formData.symptomDuration) {
          newErrors.symptomDuration = "Please select symptom duration";
        }
        break;
      case 3:
        if (!formData.additionalInfo?.trim()) {
          newErrors.additionalInfo = "Please provide additional information";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsAnalyzing(true);
      try {
        const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
          body: { formData }
        });

        if (error) throw error;

        console.log('AI Analysis:', data);
        toast({
          title: "Analysis Complete",
          description: "Your symptoms have been analyzed successfully.",
        });
      } catch (error) {
        console.error('Error analyzing symptoms:', error);
        toast({
          title: "Analysis Failed",
          description: "There was an error analyzing your symptoms. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (data: any) => {
    setFormData({ ...formData, ...data });
    setErrors({}); // Clear errors when user updates data
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-medical-900">
          Medical Pre-screening
        </h1>
        <ProgressBar totalSteps={totalSteps} />
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <QuestionStep
              key="step1"
              title="Basic Information"
              onNext={handleNext}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    value={formData.name || ""}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    onChange={(e) => updateFormData({ age: e.target.value })}
                    value={formData.age || ""}
                    className={errors.age ? "border-red-500" : ""}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500">{errors.age}</p>
                  )}
                </div>
              </div>
            </QuestionStep>
          )}

          {currentStep === 1 && (
            <QuestionStep
              key="step2"
              title="Main Symptoms"
              onNext={handleNext}
              onBack={handleBack}
            >
              <div className="space-y-4">
                <Label>What is your main symptom?</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "headache", label: "Headache", icon: "🤕" },
                    { value: "fever", label: "Fever", icon: "🤒" },
                    { value: "cough", label: "Cough", icon: "😷" },
                    { value: "fatigue", label: "Fatigue", icon: "😪" },
                  ].map((symptom) => (
                    <SelectCard
                      key={symptom.value}
                      selected={formData.mainSymptom === symptom.value}
                      onClick={() => updateFormData({ mainSymptom: symptom.value })}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-2xl">{symptom.icon}</span>
                        <span className="font-medium">{symptom.label}</span>
                      </div>
                    </SelectCard>
                  ))}
                </div>
                {errors.mainSymptom && (
                  <p className="text-sm text-red-500">{errors.mainSymptom}</p>
                )}
              </div>
            </QuestionStep>
          )}

          {currentStep === 2 && (
            <QuestionStep
              key="step3"
              title="Symptom Details"
              onNext={handleNext}
              onBack={handleBack}
            >
              <div className="space-y-4">
                <Label>How long have you been experiencing these symptoms?</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "lessThan24h", label: "Less than 24 hours", icon: "⏰" },
                    { value: "fewDays", label: "A few days", icon: "📅" },
                    { value: "week", label: "About a week", icon: "📆" },
                    { value: "moreThanWeek", label: "More than a week", icon: "📋" },
                  ].map((duration) => (
                    <SelectCard
                      key={duration.value}
                      selected={formData.symptomDuration === duration.value}
                      onClick={() => updateFormData({ symptomDuration: duration.value })}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-2xl">{duration.icon}</span>
                        <span className="font-medium">{duration.label}</span>
                      </div>
                    </SelectCard>
                  ))}
                </div>
                {errors.symptomDuration && (
                  <p className="text-sm text-red-500">{errors.symptomDuration}</p>
                )}
              </div>
            </QuestionStep>
          )}

          {currentStep === 3 && (
            <QuestionStep
              key="step4"
              title="Additional Information"
              onNext={handleNext}
              onBack={handleBack}
              isLastStep
              isLoading={isAnalyzing}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Please provide any additional details about your symptoms
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter any additional information here..."
                    className={cn(
                      "min-h-[100px]",
                      errors.additionalInfo ? "border-red-500" : ""
                    )}
                    value={formData.additionalInfo || ""}
                    onChange={(e) =>
                      updateFormData({ additionalInfo: e.target.value })
                    }
                  />
                  {errors.additionalInfo && (
                    <p className="text-sm text-red-500">{errors.additionalInfo}</p>
                  )}
                </div>
              </div>
            </QuestionStep>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <QuestionnaireProvider>
      <MainQuestionnaire />
    </QuestionnaireProvider>
  );
};

export default Index;
