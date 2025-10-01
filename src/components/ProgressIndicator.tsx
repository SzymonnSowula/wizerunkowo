"use client";
import React from 'react';
import { CheckCircle, Clock, Zap, Sparkles } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  isGenerating: boolean;
}

const steps = [
  { id: 1, label: 'Przesłano zdjęcie', icon: CheckCircle },
  { id: 2, label: 'Analiza AI', icon: Zap },
  { id: 3, label: 'Generowanie', icon: Sparkles },
  { id: 4, label: 'Gotowe!', icon: CheckCircle }
];

export default function ProgressIndicator({ currentStep, totalSteps, isGenerating }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-white/20 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isActive = isCurrent && isGenerating;
          
          const IconComponent = step.icon;
          
          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                ${isCompleted 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : isActive 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg animate-pulse' 
                    : 'bg-white/20 text-white/60'
                }
              `}>
                <IconComponent className={`w-5 h-5 ${isActive ? 'animate-spin' : ''}`} />
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium transition-colors duration-300 ${
                  isCompleted || isActive ? 'text-white' : 'text-white/60'
                }`}>
                  {step.label}
                </p>
                {isActive && (
                  <p className="text-xs text-blue-200 mt-1 animate-pulse">
                    W toku...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
