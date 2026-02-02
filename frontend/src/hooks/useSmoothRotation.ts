import { useSpring } from 'framer-motion';
import { useEffect } from 'react';

type Rotation = {
  yaw: number;
  pitch: number;
  roll: number;
};

export const useSmoothRotation = (rotation: Rotation) => {
  // Spring config from CONFIG or default
  const springConfig = { 
    stiffness: 100, 
    damping: 20,
    mass: 1
  };

  const yawSpring = useSpring(0, springConfig);
  const pitchSpring = useSpring(0, springConfig);
  const rollSpring = useSpring(0, springConfig);

  useEffect(() => {
    // MediaPipe Yaw: Negative = Right, Positive = Left
    // Pitch: Negative = Down, Positive = Up (in radians approx)
    
    // We update the spring targets directly
    yawSpring.set(rotation.yaw);
    pitchSpring.set(rotation.pitch);
    rollSpring.set(rotation.roll);
  }, [rotation, yawSpring, pitchSpring, rollSpring]);

  return { yaw: yawSpring, pitch: pitchSpring, roll: rollSpring };
};
