"use client";

import React from "react";

interface StepperProps {
    steps: string[];
    currentStep: number;
  }

  const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
    return (
      <div className="flex justify-between h-auto items-center py-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`stepper flex flex-col items-center ${
              currentStep === index + 1 ? "active" : ""
            } ${index + 1 < currentStep ? "complete" : ""}`}
          >
            <div
              className={`step w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= index + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <p className="text-gray-500 text-sm mt-2">{step}</p>
          </div>
        ))}
      </div>
    );
  };

export default Stepper;
