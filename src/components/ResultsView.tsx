
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Clock,
  Activity,
  ThumbsUp,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ResultsViewProps = {
  analysis: {
    preliminaryAssessment: { overview: string };
    potentialCauses: string[];
    riskLevel: "low" | "medium" | "high";
    recommendedActions: string[];
    urgencyLevel: number;
  };
  onReset: () => void;
};

const ResultsView = ({ analysis, onReset }: ResultsViewProps) => {
  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low":
        return <ThumbsUp className="h-6 w-6 text-green-500" />;
      case "medium":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "high":
        return <AlertOctagon className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-50 border-green-200";
      case "medium":
        return "bg-yellow-50 border-yellow-200";
      case "high":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-4"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-medical-900 mb-2">Analysis Results</h2>
        <p className="text-gray-600">Based on your provided information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Assessment Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <Activity className="h-8 w-8 text-medical-500" />
            <div>
              <CardTitle>Preliminary Assessment</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{analysis.preliminaryAssessment.overview}</p>
          </CardContent>
        </Card>

        {/* Risk Level Card */}
        <Card className={`border-2 ${getRiskColor(analysis.riskLevel)}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Risk Level</CardTitle>
              {getRiskIcon(analysis.riskLevel)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize mb-2 text-medical-900">
              {analysis.riskLevel}
            </div>
            <Progress
              value={
                analysis.riskLevel === "low"
                  ? 33
                  : analysis.riskLevel === "medium"
                  ? 66
                  : 100
              }
              className={`h-2 ${
                analysis.riskLevel === "low"
                  ? "bg-green-100"
                  : analysis.riskLevel === "medium"
                  ? "bg-yellow-100"
                  : "bg-red-100"
              }`}
            />
          </CardContent>
        </Card>

        {/* Urgency Level Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Urgency Level</CardTitle>
              <Clock className="h-6 w-6 text-medical-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{analysis.urgencyLevel}/10</div>
            <Progress value={analysis.urgencyLevel * 10} className="h-2" />
          </CardContent>
        </Card>

        {/* Potential Causes Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Potential Causes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.potentialCauses.map((cause, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <ArrowRight className="h-4 w-4 text-medical-500" />
                  {cause}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommended Actions Card */}
        <Card className="md:col-span-2 bg-medical-50 border-medical-200">
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {analysis.recommendedActions.map((action, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-3 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-medical-100">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{action}</p>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button
          onClick={onReset}
          variant="outline"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Start New Assessment
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultsView;
