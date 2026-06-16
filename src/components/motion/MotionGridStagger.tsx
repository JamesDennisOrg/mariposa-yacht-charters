// components/MotionGridStagger.tsx
'use client';

import { motion } from 'motion/react';
import { useMemo } from 'react';

interface MotionGridStaggerProps {
  children: React.ReactNode;
  className?: string;
  columnCount?: number;
  baseDelay?: number;
  staggerFactor?: number;
  initialY?: number;
  duration?: number;
}

export default function MotionGridStagger({ 
  children,
  className = '',
  columnCount = 2,
  baseDelay = 0.05,
  staggerFactor = 0.1,
  initialY = 20,
  duration = 0.3
}: MotionGridStaggerProps) {
  
  // Convert children to array safely
  const childArray = useMemo(() => {
    return Array.isArray(children) ? children : [children];
  }, [children]);

  return (
    <div className={className}>
      {childArray.map((child, index) => {
        // Calculate delay based on row and column position
        const row = Math.floor(index / columnCount);
        const col = index % columnCount;
        const delay = baseDelay + (row + col) * staggerFactor;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: initialY }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay,
              duration,
              ease: 'easeOut'
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}