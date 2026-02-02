import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useParallax } from './ParallaxContainer';

export type ModelType = 'cube' | 'sphere' | 'torus' | 'knot';

type Scene3DProps = {
  model: ModelType;
};

// Internal component to handle frame updates
// We pass MotionValues as props to bridge the context gap
const RotatingModel: React.FC<{ model: ModelType; yaw: any; pitch: any }> = ({ model, yaw, pitch }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Geometry selector
  const geometry = useMemo(() => {
    switch (model) {
      case 'sphere': return <sphereGeometry args={[1.5, 64, 64]} />;
      case 'torus': return <torusGeometry args={[1.2, 0.4, 32, 100]} />;
      case 'knot': return <torusKnotGeometry args={[1, 0.3, 100, 32]} />;
      case 'cube': 
      default: return <boxGeometry args={[2.5, 2.5, 2.5]} />;
    }
  }, [model]);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Auto rotation (idle) - Use absolute time
    const time = state.clock.getElapsedTime();
    const baseRotationY = time * 0.2; // Slow constant rotation
    const baseRotationX = time * 0.1;

    // Face Tracking interaction
    const faceYaw = yaw.get(); 
    const facePitch = pitch.get();

    // Map Face Yaw (Left/Right) to Mesh rotation Y
    // Also try position shift (Parallax)
    meshRef.current.position.x = -faceYaw * 7; 
    meshRef.current.position.y = -facePitch * 7;
    
    // Set Absolute Rotation
    // Base + Face Offset (Reduced factor as requested)
    meshRef.current.rotation.y = baseRotationY + (faceYaw * 1.5); 
    meshRef.current.rotation.x = baseRotationX + (facePitch * 1.5);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group>
            {/* Main Object with Physical Material */}
            <mesh ref={meshRef}>
                {geometry}
                <meshPhysicalMaterial 
                    color="#6366f1" // Indigo
                    roughness={0.2} 
                    metalness={0.9} 
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    emissive="#312e81"
                    emissiveIntensity={0.3}
                />
            </mesh>
            
            {/* Wireframe Overlay for "Tech" feel */}
            <mesh position={[0,0,0]} scale={[1.02, 1.02, 1.02]} ref={{ current: meshRef.current } as any}>
                 {geometry}
                 <meshBasicMaterial color="#a5b4fc" wireframe wireframeLinewidth={1} transparent opacity={0.3} />
            </mesh>
        </group>
    </Float>
  );
};

export const Scene3D: React.FC<Scene3DProps> = ({ model }) => {
  // Read context OUTSIDE Canvas
  const { yaw, pitch } = useParallax();

  return (
    <div className="w-full h-full absolute inset-0 z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -5, -10]} intensity={2} color="#ec4899" /> {/* Pink rim light */}
        <pointLight position={[0, -10, 5]} intensity={1} color="#3b82f6" /> {/* Blue under light */}
        
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <RotatingModel model={model} yaw={yaw} pitch={pitch} />
        
        {/* Post Processing can be added here if needed */}
      </Canvas>
    </div>
  );
};

