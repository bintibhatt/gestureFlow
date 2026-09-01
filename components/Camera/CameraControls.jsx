'use client';

import React from 'react';
import { Camera, CameraOff, Eye, EyeOff, Camera as CameraIcon } from 'lucide-react';

export default function CameraControls({
  isCameraActive,
  onToggleCamera,
  showLandmarks,
  onToggleLandmarks,
  onManualCapture,
}) {
  return (
    <div className="flex items-center space-x-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl shadow-lg">
      <button
        onClick={onToggleCamera}
        className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
          isCameraActive
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
        }`}
      >
        {isCameraActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
        <span>{isCameraActive ? 'Disable Camera' : 'Enable Camera'}</span>
      </button>

      <button
        onClick={onToggleLandmarks}
        disabled={!isCameraActive}
        className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
          showLandmarks
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        } ${!isCameraActive && 'opacity-50 cursor-not-allowed'}`}
      >
        {showLandmarks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        <span>{showLandmarks ? 'Hide Landmarks' : 'Show Landmarks'}</span>
      </button>

      {onManualCapture && (
        <button
          onClick={onManualCapture}
          disabled={!isCameraActive}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CameraIcon className="w-4 h-4" />
          <span>Manual Capture</span>
        </button>
      )}
    </div>
  );
}
