
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

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
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep >= step.step;
          const isCompleted = currentStep > step.step;
          return (
            <React.Fragment key={step.step}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "step-icon",
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    isCompleted && "bg-green-600 text-white"
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.step}
                </div>
                <p className={cn(
                  "mt-2 text-xs sm:text-sm font-semibold transition-colors duration-300",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-1 mx-2",
                  isCompleted ? "bg-primary" : "bg-muted"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
