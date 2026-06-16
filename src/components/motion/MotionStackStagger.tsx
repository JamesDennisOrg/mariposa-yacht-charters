// components/Motion/MotionStackStagger.tsx
'use client';

import { motion } from 'motion/react';

interface MotionStackStaggerProps {
  children: React.ReactNode;
  className?: string;
  baseDelay?: number;
  staggerDelay?: number;
  initialY?: number;
  duration?: number;
}

export default function MotionStackStagger({ 
  children,
  className = '',
  baseDelay = 0.1,
  staggerDelay = 0.05,
  initialY = 10,
  duration = 0.3
}: MotionStackStaggerProps) {
  
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: initialY }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: baseDelay + (index * staggerDelay),
            duration,
            ease: 'easeOut'
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}