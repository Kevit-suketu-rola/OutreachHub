import React from "react";

interface LoaderCircleProps {
  size?: string; // Tailwind size classes like "w-16 h-16"
  color?: string; // Tailwind color classes like "border-blue-500"
}

export const LoaderCircle: React.FC<LoaderCircleProps> = ({
  size = "w-16 h-16",
  color = "border-blue-500",
}) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-4 ${color} border-t-transparent ${size}`}
      ></div>
    </div>
  );
};
