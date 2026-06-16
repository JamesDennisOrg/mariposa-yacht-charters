// components/Motion/MotionReveal.tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface MotionRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

export default function MotionReveal({ 
  children, 
  direction = 'up',
  delay = 0,
  duration = 0.5,
  distance = 30,
  threshold = 0.1,
  once = true,
  className = ''
}: MotionRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  // Determine initial position based on direction
  const getInitialPosition = () => {
    switch(direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      case 'none': return {};
      default: return { y: distance };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0,
        ...getInitialPosition()
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0 
      } : { 
        opacity: 0,
        ...getInitialPosition()
      }}
      transition={{ 
        duration, 
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}