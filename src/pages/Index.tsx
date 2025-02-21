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
import ResultsView from "@/components/ResultsView";
import BodyMap from "@/components/BodyMap";
import { Thermometer, ThermometerSun, Flame, Clock, CalendarDays, Calendar, CalendarRange } from "lucide-react";

const totalSteps = 5; // Increased from 4 to 5

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
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { toast } = useToast();

  const resetQuestionnaire = () => {
    setCurrentStep(0);
    setFormData({});
    setAnalysisResults(null);
    setErrors({});
  };

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
        if (!formData.gender) {
          newErrors.gender = "Gender is required";
        }
        if (formData.hasMedicalConditions === undefined) {
          newErrors.hasMedicalConditions = "Please indicate if you have any medical conditions";
        }
        if (formData.hasMedicalConditions && !formData.medicalConditionsDetails?.trim()) {
          newErrors.medicalConditionsDetails = "Please provide details about your medical conditions";
        }
        break;
      case 1:
        if (!formData.painAreas || formData.painAreas.length === 0) {
          newErrors.painAreas = "Please select at least one area where you feel pain";
        }
        break;
      case 2:
        if (!formData.painIntensity) {
          newErrors.painIntensity = "Please select pain intensity";
        }
        if (!formData.symptomDuration) {
          newErrors.symptomDuration = "Please select symptom duration";
        }
        break;
      case 3:
        if (formData.hasNumbness === undefined) {
          newErrors.hasNumbness = "Please indicate if you have numbness, weakness, or loss of function";
        }
        if (formData.hasChestPain === undefined) {
          newErrors.hasChestPain = "Please indicate if you have chest pain or difficulty breathing";
        }
        break;
      case 4:
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
      try {
        setIsAnalyzing(true); // Set loading state before API call
        const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
          body: { formData }
        });

        if (error) throw error;

        // Small delay to ensure loading state is visible
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAnalysisResults(data);
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

  const handlePainAreaClick = (partId: string) => {
    const currentPainAreas = formData.painAreas || [];
    const updatedPainAreas = currentPainAreas.includes(partId)
      ? currentPainAreas.filter((area: string) => area !== partId)
      : [...currentPainAreas, partId];
    updateFormData({ painAreas: updatedPainAreas });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {!analysisResults ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-8 text-medical-900">
              Medical Pre-screening
            </h1>
            <ProgressBar totalSteps={totalSteps} />
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <QuestionStep
                  key="step1"
                  title="Personal Information"
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
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {["male", "female", "other"].map((gender) => (
                          <SelectCard
                            key={gender}
                            selected={formData.gender === gender}
                            onClick={() => updateFormData({ gender })}
                          >
                            <span className="capitalize">{gender}</span>
                          </SelectCard>
                        ))}
                      </div>
                      {errors.gender && (
                        <p className="text-sm text-red-500">{errors.gender}</p>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Label>Do you have any existing medical conditions?</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {["yes", "no"].map((option) => (
                          <SelectCard
                            key={option}
                            selected={formData.hasMedicalConditions === (option === "yes")}
                            onClick={() => updateFormData({ hasMedicalConditions: option === "yes" })}
                          >
                            <span className="capitalize">{option}</span>
                          </SelectCard>
                        ))}
                      </div>
                      {errors.hasMedicalConditions && (
                        <p className="text-sm text-red-500">{errors.hasMedicalConditions}</p>
                      )}
                      {formData.hasMedicalConditions && (
                        <div className="space-y-2">
                          <Label htmlFor="medicalConditions">Please describe your medical conditions</Label>
                          <Textarea
                            id="medicalConditions"
                            placeholder="E.g., diabetes, hypertension, asthma..."
                            value={formData.medicalConditionsDetails || ""}
                            onChange={(e) => updateFormData({ medicalConditionsDetails: e.target.value })}
                            className={errors.medicalConditionsDetails ? "border-red-500" : ""}
                          />
                          {errors.medicalConditionsDetails && (
                            <p className="text-sm text-red-500">{errors.medicalConditionsDetails}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </QuestionStep>
              )}

              {currentStep === 1 && (
                <QuestionStep
                  key="step2"
                  title="Pain Location"
                  onNext={handleNext}
                  onBack={handleBack}
                >
                  <div className="space-y-4">
                    <Label>Where do you feel pain or discomfort?</Label>
                    <p className="text-sm text-gray-500">Click on the body parts where you experience pain</p>
                    <Card className="p-8">
                      <BodyMap
                        selectedParts={formData.painAreas || []}
                        onPartClick={handlePainAreaClick}
                      />
                    </Card>
                    {errors.painAreas && (
                      <p className="text-sm text-red-500">{errors.painAreas}</p>
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
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label>How intense is your pain?</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { 
                            value: "mild", 
                            label: "Mild", 
                            icon: (props) => <Thermometer className="w-8 h-8 text-medical-500" {...props} /> 
                          },
                          { 
                            value: "moderate", 
                            label: "Moderate", 
                            icon: (props) => <ThermometerSun className="w-8 h-8 text-medical-500" {...props} /> 
                          },
                          { 
                            value: "severe", 
                            label: "Severe", 
                            icon: (props) => <Flame className="w-8 h-8 text-medical-500" {...props} /> 
                          },
                        ].map((intensity) => (
                          <SelectCard
                            key={intensity.value}
                            selected={formData.painIntensity === intensity.value}
                            onClick={() => updateFormData({ painIntensity: intensity.value })}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <intensity.icon />
                              <span className="font-medium">{intensity.label}</span>
                            </div>
                          </SelectCard>
                        ))}
                      </div>
                      {errors.painIntensity && (
                        <p className="text-sm text-red-500">{errors.painIntensity}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label>How long have you been experiencing these symptoms?</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { 
                            value: "lessThan24h", 
                            label: "Less than 24 hours", 
                            icon: (props) => <Clock className="w-8 h-8 text-medical-500" {...props} /> 
                          },
                          { 
                            value: "fewDays", 
                            label: "A few days", 
                            icon: (props) => <CalendarDays className="w-8 h-8 text-medical-500" {...props} /> 
                          },
                          { 
                            value: "week", 
                            label: "About a week", 
                            icon: (props) => <Calendar className="w-8 h-8 text-medical-500" {...props} /> 
                          },
                          { 
                            value: "moreThanWeek", 
                            label: "More than a week", 
                            icon: (props) => <CalendarRange className="w-8 h-8 text-medical-500" {...props} /> 
                          },
                        ].map((duration) => (
                          <SelectCard
                            key={duration.value}
                            selected={formData.symptomDuration === duration.value}
                            onClick={() => updateFormData({ symptomDuration: duration.value })}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <duration.icon />
                              <span className="font-medium">{duration.label}</span>
                            </div>
                          </SelectCard>
                        ))}
                      </div>
                      {errors.symptomDuration && (
                        <p className="text-sm text-red-500">{errors.symptomDuration}</p>
                      )}
                    </div>
                  </div>
                </QuestionStep>
              )}

              {currentStep === 3 && (
                <QuestionStep
                  key="step4"
                  title="Important Health Indicators"
                  onNext={handleNext}
                  onBack={handleBack}
                >
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label>Do you have numbness, weakness, or loss of function?</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {["yes", "no"].map((option) => (
                          <SelectCard
                            key={option}
                            selected={formData.hasNumbness === (option === "yes")}
                            onClick={() => updateFormData({ hasNumbness: option === "yes" })}
                          >
                            <span className="capitalize">{option}</span>
                          </SelectCard>
                        ))}
                      </div>
                      {errors.hasNumbness && (
                        <p className="text-sm text-red-500">{errors.hasNumbness}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label>Are you experiencing chest pain or difficulty breathing?</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {["yes", "no"].map((option) => (
                          <SelectCard
                            key={option}
                            selected={formData.hasChestPain === (option === "yes")}
                            onClick={() => updateFormData({ hasChestPain: option === "yes" })}
                          >
                            <span className="capitalize">{option}</span>
                          </SelectCard>
                        ))}
                      </div>
                      {errors.hasChestPain && (
                        <p className="text-sm text-red-500">{errors.hasChestPain}</p>
                      )}
                    </div>
                  </div>
                </QuestionStep>
              )}

              {currentStep === 4 && (
                <QuestionStep
                  key="step5"
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
                        placeholder="Describe when the symptoms started, what makes them better or worse, and any other relevant information..."
                        className={cn(
                          "min-h-[150px]",
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
          </>
        ) : (
          <ResultsView
            analysis={analysisResults}
            onReset={resetQuestionnaire}
          />
        )}
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
