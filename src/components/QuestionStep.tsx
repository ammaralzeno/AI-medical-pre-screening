
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type QuestionStepProps = {
  title: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  isLastStep?: boolean;
  isLoading?: boolean;
};

const QuestionStep = ({
  title,
  children,
  onNext,
  onBack,
  isLastStep = false,
  isLoading = false,
}: QuestionStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-medical-900">{title}</h2>
        <div className="space-y-4">{children}</div>
        <div className="flex justify-between mt-6">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="bg-white hover:bg-gray-50"
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          <Button
            onClick={onNext}
            className="ml-auto bg-medical-500 hover:bg-medical-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              isLastStep ? "Submit" : "Next"
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuestionStep;
