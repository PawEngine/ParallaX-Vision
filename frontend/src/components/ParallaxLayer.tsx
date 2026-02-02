import React, { type ReactNode } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useParallax } from './ParallaxContainer';

type ParallaxLayerProps = {
  children?: ReactNode;
  depth?: number; // Positive = closer (moves more), Negative = further (moves less/inverse)
  className?: string;
  style?: React.CSSProperties;
};

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ 
  children, 
  depth = 10,
  className = "",
  style = {}
}) => {
  const { yaw, pitch, sensitivity } = useParallax();

  // Calculate translation based on depth
  // Head moves Left (Yaw +) -> Viewport moves Left -> Objects appear to move Right (Translate X +)
  // Depth multiplier controls magnitude.
  
  // Yaw is in radians. For small angles, approx linear.
  // 1 radian ~ 57 degrees. 45deg ~ 0.8 rad.
  // Sensitivity: 20 (degrees tilt).
  
  // We want pixels shift.
  // Let's say max offset is 'depth' pixels at full header turn.
  // We normalize rotation roughly to [-1, 1] range for calc.
  
  const translateX = useTransform(yaw, (val) => {
    // val is radians. 
    // If val is positive (Head Left), we want Content to move Right (Positive X)
    // Boost factor significantly.
    // val is radians (e.g. 0.5 rad ~ 30deg).
    // if depth=10, sensitivty=20.
    // 0.5 * 20 * 10 = 100px shift.
    const factor = -val * 20; 
    return factor * depth * (sensitivity / 10);
  });

  const translateY = useTransform(pitch, (val) => {
    // Pitch positive (Head Up) -> Content moves Down (Positive Y)
    const factor = -val * 20;
    return factor * depth * (sensitivity / 10);
  });

  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
      style={{
        x: translateX,
        y: translateY,
        z: depth, // Actual Z-index for 3D sorting if transform-style is preserved
        ...style
      }}
    >
      <div className="pointer-events-auto">
        {children}
      </div>
    </motion.div>
  );
};
