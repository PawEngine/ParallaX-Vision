import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { useFaceTracking } from '../hooks/useFaceTracking';
import { CONFIG } from '../config';

type FaceTrackerProps = {
  onRotationChange?: (rotation: { yaw: number; pitch: number; roll: number }) => void;
};

export const FaceTracker: React.FC<FaceTrackerProps> = ({ onRotationChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  // @ts-ignore
  const { rotation, isReady, isDetected, error } = useFaceTracking(videoRef);

  useEffect(() => {
    if (onRotationChange) {
      onRotationChange(rotation);
    }
  }, [rotation, onRotationChange]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
            width: CONFIG.camera.width, 
            height: CONFIG.camera.height
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', () => {
             videoRef.current?.play();
        });
      }
      setPermissionGranted(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setPermissionGranted(false);
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 z-50 transition-opacity duration-300 ${CONFIG.camera.showPreview ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Error / Status Overlay */}
       <div className="absolute -top-24 left-0 bg-black/80 text-white p-2 rounded text-xs font-mono w-48 mb-2 border border-gray-700 pointer-events-none">
          <div>Model: <span className={isReady ? "text-green-400" : "text-yellow-400"}>{isReady ? "READY" : "LOADING..."}</span></div>
          <div>Face: <span className={isDetected ? "text-green-400" : "text-red-400"}>{isDetected ? "DETECTED" : "NO FACE"}</span></div>
          {error && <div className="text-red-500 mt-1">{error}</div>}
          <div className="mt-1 opacity-50">Y: {rotation.yaw.toFixed(2)} P: {rotation.pitch.toFixed(2)}</div>
       </div>

      {!permissionGranted && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
           <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl flex flex-col items-center text-center shadow-2xl max-w-md mx-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <CameraOff className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Camera Access Required</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                To experience the parallax effect, we need access to your camera to detect head movement. 
                <br /><span className="text-xs text-gray-500 mt-2 block">Data is processed locally in your browser.</span>
              </p>
              <button 
                onClick={startCamera}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 text-lg shadow-lg shadow-blue-500/25"
              >
                <Camera className="w-5 h-5" />
                Enable Camera
              </button>
           </div>
        </div>
      )}

      {/* Debug Preview */}
      <div className="relative rounded-lg overflow-hidden shadow-lg border border-gray-700 bg-black w-48">
          <video 
            ref={videoRef}
            className="w-full h-auto -scale-x-100 transform object-cover" 
            playsInline
            muted
            autoPlay
            width={CONFIG.camera.width}
            height={CONFIG.camera.height}
          />
          <div className="absolute bottom-1 left-2 text-[10px] text-green-400 font-mono">
            {isReady ? '● TRACKING' : '○ WAITING'}
          </div>
      </div>
    </div>
  );
};
