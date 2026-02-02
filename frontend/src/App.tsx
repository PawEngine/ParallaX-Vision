import { useState, useCallback, useEffect } from 'react';
import { FaceTracker } from './components/FaceTracker';
import { ParallaxContainer } from './components/ParallaxContainer';
import { ParallaxLayer } from './components/ParallaxLayer';
import { Scene3D } from './components/Scene3D';
import { DebugPanel } from './components/DebugPanel';
import { CONFIG } from './config';

function App() {
  const [rotation, setRotation] = useState({ yaw: 0, pitch: 0, roll: 0 });
  const [sensitivity, setSensitivity] = useState<number>(CONFIG.faceTracking.sensitivity);
  const [offset, setOffset] = useState({ yaw: 0, pitch: 0 });
  const [debug, setDebug] = useState<boolean>(CONFIG.ui.debugMode);
  const [model, setModel] = useState<'cube' | 'sphere' | 'torus' | 'knot'>('cube');

  // Apply calibration offset
  const calibratedRotation = {
    yaw: rotation.yaw - offset.yaw,
    pitch: rotation.pitch - offset.pitch,
    roll: rotation.roll 
  };

  const handleCalibrate = useCallback(() => {
    setOffset({
      yaw: rotation.yaw,
      pitch: rotation.pitch
    });
  }, [rotation]);

  // Simulation Mode
  const [simulate, setSimulate] = useState(false);
  const [simTime, setSimTime] = useState(0);

  useEffect(() => {
    let frame: number;
    if (simulate) {
        const loop = () => {
            setSimTime(Date.now() / 1000);
            frame = requestAnimationFrame(loop);
        };
        loop();
    }
    return () => cancelAnimationFrame(frame);
  }, [simulate]);

  const simulatedRotation = {
    yaw: Math.sin(simTime) * 0.5, // +/- 0.5 rad (~30 deg)
    pitch: Math.cos(simTime * 0.7) * 0.3, 
    roll: 0
  };
  
  const activeRotation = simulate ? simulatedRotation : calibratedRotation;

  return (
    <div className="relative min-h-screen w-full bg-gray-950 text-white overflow-hidden flex flex-col items-center justify-center">
      
      {/* Components */}
      <FaceTracker onRotationChange={setRotation} />
      
      <div className="fixed bottom-20 right-4 z-50">
         <button 
           onClick={() => setSimulate(!simulate)}
           className={`px-3 py-1 rounded text-xs font-mono border ${simulate ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
         >
           {simulate ? "STOP SIMUL" : "START SIMUL"}
         </button>
      </div>

      
      <DebugPanel 
        rotation={activeRotation}
        sensitivity={sensitivity}
        setSensitivity={setSensitivity}
        onCalibrate={handleCalibrate}
        isVisible={debug}
        model={model}
        setModel={setModel}
      />
      
      {/* Toggle Debug Button */}
      <div className="fixed top-4 right-4 z-50">
        <label className="flex items-center space-x-2 text-white text-xs font-mono cursor-pointer bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-black/60 transition-all hover:scale-105 active:scale-95 select-none">
          <input 
            type="checkbox" 
            checked={debug} 
            onChange={(e) => setDebug(e.target.checked)}
            className="accent-blue-500"
          />
          <span>Debug Mode</span>
        </label>
      </div>

      {/* Main Content Area */}
      <ParallaxContainer rotation={activeRotation} sensitivity={sensitivity}>
        
        {/* Layer 1: Stars / Distance */}
        <ParallaxLayer depth={-20} className="z-0">
          <div className="absolute w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[100px] -top-96 -left-96" />
          <div className="absolute w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] -bottom-96 -right-96" />
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full blur-[1px]" />
          <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-white/30 rounded-full blur-[2px]" />
        </ParallaxLayer>

        {/* Layer 3: Main Object (3D Scene) */}
        <div className="absolute inset-0 z-20 w-full h-full pointer-events-none">
            <div className="w-full h-full pointer-events-auto">
                <Scene3D model={model} />
            </div>
             {/* Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <h1 className="mt-96 text-xl font-mono text-blue-200 tracking-[0.5em] uppercase opacity-80" style={{ textShadow: "0 0 20px rgba(59,130,246,0.5)" }}>
                    ParallaX System
                </h1>
            </div>
        </div>

        {/* Layer 5: Foreground Dust */}
        <ParallaxLayer depth={20} className="z-40 pointer-events-none">
           <div className="absolute top-10 left-10 w-32 h-32 border border-blue-500/20 rounded-full" />
           <div className="absolute bottom-10 right-10 w-24 h-24 border border-purple-500/20 rounded-full" />
        </ParallaxLayer>

      </ParallaxContainer>
    </div>
  );
}

export default App;
