

'use client'

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  size?: 'normal' | 'small';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: string): TimeLeft | null => {
  const difference = +new Date(targetDate) - +new Date();
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return null;
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, size = 'normal' }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  });

  if (!timeLeft) {
    return <div className="text-red-500 font-bold">Offer Expired!</div>;
  }
  
  const timeParts = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];
  
  if (size === 'small') {
      return (
         <div className="flex items-center gap-1.5 text-center">
          {timeParts.map((part) => (
            <div key={part.label} className="flex flex-col items-center justify-center bg-muted rounded-md w-12 h-12 p-1">
                <span className="text-base font-bold text-foreground">{String(part.value).padStart(2, '0')}</span>
                <span className="text-xs text-muted-foreground">{part.label}</span>
            </div>
          ))}
        </div>
      )
  }

  return (
    <div className="flex items-start gap-2 text-center">
      {timeParts.map((part, index) => (
        <div key={part.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center justify-center bg-muted rounded-md w-14 h-14 p-1">
                <span className="text-xl font-bold text-primary">{String(part.value).padStart(2, '0')}</span>
                <span className="text-xs text-muted-foreground">{part.label}</span>
            </div>
            {index < timeParts.length - 1 && <span className="text-2xl font-bold text-muted-foreground">:</span>}
        </div>
      ))}
    </div>
  );
};
