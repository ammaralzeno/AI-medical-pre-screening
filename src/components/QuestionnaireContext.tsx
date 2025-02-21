
import React, { createContext, useContext, useState } from "react";

type QuestionnaireContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: any;
  setFormData: (data: any) => void;
};

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export function QuestionnaireProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  return (
    <QuestionnaireContext.Provider value={{ currentStep, setCurrentStep, formData, setFormData }}>
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error("useQuestionnaire must be used within a QuestionnaireProvider");
  }
  return context;
}
