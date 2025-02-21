
import { useState } from "react";
import { QuestionnaireProvider } from "@/components/QuestionnaireContext";
import { useQuestionnaire } from "@/components/QuestionnaireContext";
import ProgressBar from "@/components/ProgressBar";
import QuestionStep from "@/components/QuestionStep";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

const totalSteps = 4;

const MainQuestionnaire = () => {
  const { currentStep, setCurrentStep, formData, setFormData } = useQuestionnaire();

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (data: any) => {
    setFormData({ ...formData, ...data });
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    onChange={(e) => updateFormData({ age: e.target.value })}
                  />
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
                <RadioGroup
                  onValueChange={(value) => updateFormData({ mainSymptom: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="headache" id="headache" />
                    <Label htmlFor="headache">Headache</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fever" id="fever" />
                    <Label htmlFor="fever">Fever</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cough" id="cough" />
                    <Label htmlFor="cough">Cough</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fatigue" id="fatigue" />
                    <Label htmlFor="fatigue">Fatigue</Label>
                  </div>
                </RadioGroup>
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
                <div className="space-y-2">
                  <Label>How long have you been experiencing these symptoms?</Label>
                  <RadioGroup
                    onValueChange={(value) =>
                      updateFormData({ symptomDuration: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lessThan24h" id="lessThan24h" />
                      <Label htmlFor="lessThan24h">Less than 24 hours</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fewDays" id="fewDays" />
                      <Label htmlFor="fewDays">A few days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="week" id="week" />
                      <Label htmlFor="week">About a week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moreThanWeek" id="moreThanWeek" />
                      <Label htmlFor="moreThanWeek">More than a week</Label>
                    </div>
                  </RadioGroup>
                </div>
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
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Please provide any additional details about your symptoms
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter any additional information here..."
                    className="min-h-[100px]"
                    onChange={(e) =>
                      updateFormData({ additionalInfo: e.target.value })
                    }
                  />
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
