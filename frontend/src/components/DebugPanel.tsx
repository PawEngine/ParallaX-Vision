import React from 'react';
import { Settings, RefreshCw } from 'lucide-react';


type DebugPanelProps = {
  rotation: { yaw: number; pitch: number; roll: number };
  sensitivity: number;
  setSensitivity: (value: number) => void;
  onCalibrate: () => void;
  isVisible: boolean;
  model: 'cube' | 'sphere' | 'torus' | 'knot';
  setModel: (model: 'cube' | 'sphere' | 'torus' | 'knot') => void;
};

export const DebugPanel: React.FC<DebugPanelProps> = ({
  rotation,
  sensitivity,
  setSensitivity,
  onCalibrate,
  isVisible,
  model,
  setModel
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 z-40 bg-gray-900/90 backdrop-blur-md border border-gray-700 p-4 rounded-lg shadow-xl w-64 text-white text-xs font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
        <h3 className="font-bold flex items-center gap-2">
          <Settings className="w-3 h-3" />
          Debug Control
        </h3>
        <button 
          onClick={onCalibrate}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
          title="Reset Calibration (Zero Position)"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Model Selector */}
        <div className="space-y-1">
          <label className="text-gray-400 block mb-1">Model</label>
          <select 
            value={model} 
            onChange={(e) => setModel(e.target.value as any)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="cube">Cube</option>
            <option value="sphere">Sphere</option>
            <option value="torus">Torus</option>
            <option value="knot">Knot</option>
          </select>
        </div>

        {/* Rotation Stats */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Yaw:</span>
            <span className={rotation.yaw > 0 ? "text-blue-400" : "text-green-400"}>
              {(rotation.yaw * 180 / Math.PI).toFixed(1)}°
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Pitch:</span>
            <span className={rotation.pitch > 0 ? "text-blue-400" : "text-green-400"}>
              {(rotation.pitch * 180 / Math.PI).toFixed(1)}°
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Roll:</span>
            <span className={rotation.roll > 0 ? "text-blue-400" : "text-green-400"}>
              {(rotation.roll * 180 / Math.PI).toFixed(1)}°
            </span>
          </div>
        </div>

        {/* Sensitivity Slider */}
        <div className="space-y-2 pt-2 border-t border-gray-800">
          <div className="flex justify-between">
            <span className="text-gray-400">Sensitivity</span>
            <span>{sensitivity}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
