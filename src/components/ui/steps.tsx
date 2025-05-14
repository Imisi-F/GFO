
import React from "react";
import { cn } from "@/lib/utils";

interface StepsProps {
  currentStep: number;
  className?: string;
  children: React.ReactNode;
}

interface StepProps {
  children: React.ReactNode;
  completed?: boolean;
}

interface StepTitleProps {
  children: React.ReactNode;
}

interface StepDescriptionProps {
  children: React.ReactNode;
}

const Steps = ({ currentStep, className, children }: StepsProps) => {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div className={cn("flex items-start w-full", className)}>
      {childrenArray.map((child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<StepProps>, {
            completed: index < currentStep,
            key: index,
          });
        }
        return child;
      })}
    </div>
  );
};

const Step = ({ children, completed }: StepProps) => {
  return (
    <div className="flex-1 flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center z-10">
        <div
          className={cn(
            "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors",
            completed 
              ? "bg-primary border-primary text-primary-foreground" 
              : "bg-muted border-slate-700 text-slate-400"
          )}
        >
          {completed ? (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : null}
        </div>
      </div>
      <div className="mt-2 w-full">{children}</div>
    </div>
  );
};

const StepTitle = ({ children }: StepTitleProps) => {
  return <div className="font-medium text-sm">{children}</div>;
};

const StepDescription = ({ children }: StepDescriptionProps) => {
  return <div className="text-xs text-slate-400">{children}</div>;
};

export { Steps, Step, StepTitle, StepDescription };
