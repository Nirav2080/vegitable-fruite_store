
'use client'

import { cn } from '@/lib/utils'

const steps = [
  { step: 1, label: 'Cart' },
  { step: 2, label: 'Details' },
  { step: 3, label: 'Payment' },
];

interface CheckoutProgressProps {
  currentStep: number;
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep >= step.step;
          const isCompleted = currentStep > step.step;
          return (
            <div key={step.step} className="z-10 flex flex-col items-center">
              <div 
                className={cn(
                  "step transition-colors duration-300",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {step.step}
              </div>
              <p className={cn(
                "mt-2 text-sm font-semibold transition-colors duration-300",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {step.label}
              </p>
               {index < steps.length - 1 && (
                  <div 
                    className="step-line"
                    style={{ 
                      left: 'calc(50% + 1rem)', 
                      width: 'calc(100% - 2rem)',
                      transform: 'translateX(0) translateY(-50%)'
                     }}
                  >
                     <div className={cn(
                       "h-full transition-all duration-500",
                       isCompleted ? "bg-primary" : "bg-muted"
                     )}></div>
                  </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
