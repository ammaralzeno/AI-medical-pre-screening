
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
          d="M50,5 
             Q65,5 65,20 
             L65,30 
             Q80,30 80,45
             L80,60
             Q80,70 70,70
             L60,70
             L60,95
             Q60,98 57,98
             L43,98
             Q40,98 40,95
             L40,70
             L30,70
             Q20,70 20,60
             L20,45
             Q20,30 35,30
             L35,20
             Q35,5 50,5"
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
