
import { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

type BodyPart = {
  id: string;
  name: string;
  coords: { x: number; y: number };
  radius: number;
};

const bodyParts: BodyPart[] = [
  { id: "head", name: "Head", coords: { x: 50, y: 15 }, radius: 15 },
  { id: "neck", name: "Neck", coords: { x: 50, y: 28 }, radius: 10 },
  { id: "chest", name: "Chest", coords: { x: 50, y: 38 }, radius: 18 },
  { id: "stomach", name: "Stomach", coords: { x: 50, y: 55 }, radius: 15 },
  { id: "leftArm", name: "Left Arm", coords: { x: 20, y: 40 }, radius: 12 },
  { id: "rightArm", name: "Right Arm", coords: { x: 80, y: 40 }, radius: 12 },
  { id: "leftLeg", name: "Left Leg", coords: { x: 35, y: 80 }, radius: 15 },
  { id: "rightLeg", name: "Right Leg", coords: { x: 65, y: 80 }, radius: 15 },
  { id: "back", name: "Back", coords: { x: 50, y: 45 }, radius: 16 },
];

type BodyMapProps = {
  selectedParts: string[];
  onPartClick: (partId: string) => void;
};

const BodyMap = ({ selectedParts, onPartClick }: BodyMapProps) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-[3/4]">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" }}
      >
        <path
          d="M50,2 
             Q70,2 70,20 
             L70,30 
             Q90,30 90,45
             L90,65
             Q90,75 80,75
             L65,75
             L65,98
             Q65,99 62,99
             L38,99
             Q35,99 35,98
             L35,75
             L20,75
             Q10,75 10,65
             L10,45
             Q10,30 30,30
             L30,20
             Q30,2 50,2"
          fill="#f8fafc"
          stroke="#94a3b8"
          strokeWidth="0.5"
        />

        {bodyParts.map((part) => (
          <g key={part.id} onClick={() => onPartClick(part.id)}>
            <circle
              cx={part.coords.x}
              cy={part.coords.y}
              r={part.radius}
              className={cn(
                "cursor-pointer transition-all duration-200",
                "fill-transparent hover:fill-medical-100/50 stroke-medical-200",
                selectedParts.includes(part.id) &&
                  "fill-medical-500/20 stroke-medical-500",
                hoveredPart === part.id && "stroke-medical-400"
              )}
              style={{ strokeWidth: "1" }}
              onMouseEnter={() => setHoveredPart(part.id)}
              onMouseLeave={() => setHoveredPart(null)}
            />
            <circle
              cx={part.coords.x}
              cy={part.coords.y}
              r={part.radius + 6}
              className="fill-transparent cursor-pointer"
              onMouseEnter={() => setHoveredPart(part.id)}
              onMouseLeave={() => setHoveredPart(null)}
            />
          </g>
        ))}
      </svg>

      <div className="absolute inset-0">
        {bodyParts.map((part) => (
          <div
            key={part.id}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
              selectedParts.includes(part.id)
                ? "bg-medical-100 text-medical-700"
                : "bg-transparent text-gray-500",
              hoveredPart === part.id && "text-medical-600"
            )}
            style={{
              left: `${part.coords.x}%`,
              top: `${part.coords.y}%`,
              cursor: "pointer",
            }}
            onClick={() => onPartClick(part.id)}
          >
            {part.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BodyMap;
