import React, { createContext, useContext, type ReactNode } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useSmoothRotation } from '../hooks/useSmoothRotation';

type ParallaxContextType = {
  yaw: MotionValue<number>;
  pitch: MotionValue<number>;
  roll: MotionValue<number>;
  sensitivity: number;
};

const ParallaxContext = createContext<ParallaxContextType | null>(null);

export const useParallax = () => {
  const context = useContext(ParallaxContext);
  if (!context) {
    throw new Error('useParallax must be used within a ParallaxContainer');
  }
  return context;
};

type ParallaxContainerProps = {
  children: ReactNode;
  rotation: { yaw: number; pitch: number; roll: number };
  sensitivity: number;
};

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({ 
  children, 
  rotation, 
  sensitivity 
}) => {
  const smoothRotation = useSmoothRotation(rotation);

  // Base card rotation (global tilt)
  // Convert radians to degrees for CSS rotate
  // Invert/Scale logic:
  // Head Left (Yaw +) -> Card Looks Left (rotateY -) or Right (rotateY +)?
  // Usually for "looking at object": Head Left -> Object rotates Y negative to show right side.
  const rotateY = useTransform(smoothRotation.yaw, (val) => -(val * 180 / Math.PI) * (sensitivity / 45));
  const rotateX = useTransform(smoothRotation.pitch, (val) => (val * 180 / Math.PI) * (sensitivity / 45));

  return (
    <ParallaxContext.Provider value={{ ...smoothRotation, sensitivity }}>
      <div className="perspective-1000 fixed inset-0 w-full h-full flex justify-center items-center overflow-hidden">
        <motion.div
          style={{
            rotateX,
            rotateY,
          }}
          className="transform-style-3d will-change-transform relative w-full h-full"
        >
          {children}
        </motion.div>
      </div>
    </ParallaxContext.Provider>
  );
};
