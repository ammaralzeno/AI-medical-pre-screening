
import { useQuestionnaire } from "./QuestionnaireContext";

const ProgressBar = ({ totalSteps }: { totalSteps: number }) => {
  const { currentStep } = useQuestionnaire();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
      <div
        className="h-2.5 rounded-full transition-all duration-500 ease-out bg-medical-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
