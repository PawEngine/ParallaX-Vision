import React from 'react';
import { motion, useTransform, useTime } from 'framer-motion';
import { useParallax } from './ParallaxContainer';

export const ThreeDCube: React.FC = () => {
  const { yaw, pitch } = useParallax();
  
  // Base auto-rotation
  const time = useTime();
  const rotateX = useTransform(time, [0, 10000], [0, 360]); // Slow idle rotation
  const rotateY = useTransform(time, [0, 20000], [0, 360]);

  // Combined rotation is tricky with standard CSS/Motion.
  // We can wrap the auto-rotating cube in a container that responds to face.
  
  const faceRotateX = useTransform(pitch, (val) => (val * 180 / Math.PI) * 1.5);
  const faceRotateY = useTransform(yaw, (val) => -(val * 180 / Math.PI) * 1.5);

  return (
    <div className="relative w-64 h-64 perspective-1000">
      <motion.div
        className="w-full h-full transform-style-3d relative"
        style={{
           rotateX: faceRotateX,
           rotateY: faceRotateY,
        }}
      >
        {/* The Cube itself */}
        <motion.div
            className="w-full h-full transform-style-3d relative"
            style={{
                rotateX: rotateX,
                rotateY: rotateY,
            }}
        >
          {/* Front */}
          <div className="absolute inset-0 bg-blue-500/30 border-2 border-blue-400/50 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_50px_rgba(59,130,246,0.5)]" style={{ transform: 'translateZ(128px)' }}>
            FRONT
          </div>
          {/* Back */}
          <div className="absolute inset-0 bg-purple-500/30 border-2 border-purple-400/50 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_50px_rgba(168,85,247,0.5)]" style={{ transform: 'rotateY(180deg) translateZ(128px)' }}>
            BACK
          </div>
          {/* Right */}
          <div className="absolute inset-0 bg-cyan-500/30 border-2 border-cyan-400/50 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_50px_rgba(34,211,238,0.5)]" style={{ transform: 'rotateY(90deg) translateZ(128px)' }}>
            RIGHT
          </div>
          {/* Left */}
          <div className="absolute inset-0 bg-pink-500/30 border-2 border-pink-400/50 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_50px_rgba(236,72,153,0.5)]" style={{ transform: 'rotateY(-90deg) translateZ(128px)' }}>
            LEFT
          </div>
           {/* Top */}
           <div className="absolute inset-0 bg-indigo-500/30 border-2 border-indigo-400/50 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_50px_rgba(99,102,241,0.5)]" style={{ transform: 'rotateX(90deg) translateZ(128px)' }}>
            TOP
          </div>
          {/* Bottom */}
          <div className="absolute inset-0 bg-emerald-500/30 border-2 border-emerald-400/50 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_50px_rgba(16,185,129,0.5)]" style={{ transform: 'rotateX(-90deg) translateZ(128px)' }}>
            BOTTOM
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
