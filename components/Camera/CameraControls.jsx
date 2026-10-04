'use client';

import React from 'react';
import { Camera, CameraOff, Eye, EyeOff, Camera as CameraIcon } from 'lucide-react';

const CameraControls = React.memo(function CameraControls({
  isCameraActive,
  onToggleCamera,
  showLandmarks,
  onToggleLandmarks,
  onManualCapture,
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl max-w-full">
      <button
        onClick={onToggleCamera}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
          isCameraActive
            ? 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800'
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
        }`}
        title={isCameraActive ? 'Disable Camera' : 'Enable Camera'}
      >
        {isCameraActive ? <CameraOff className="w-3.5 h-3.5 text-zinc-400" /> : <Camera className="w-3.5 h-3.5 text-emerald-400" />}
        <span className="hidden xs:inline">{isCameraActive ? 'Off' : 'On'}</span>
        <span className="hidden sm:inline"> Camera</span>
      </button>

      <button
        onClick={onToggleLandmarks}
        disabled={!isCameraActive}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
          showLandmarks
            ? 'bg-zinc-900 text-zinc-200 border border-zinc-700 hover:bg-zinc-800'
            : 'bg-zinc-950 text-zinc-500 hover:bg-zinc-900 border border-zinc-800'
        } ${!isCameraActive && 'opacity-50 cursor-not-allowed'}`}
        title={showLandmarks ? 'Hide Landmarks' : 'Show Landmarks'}
      >
        {showLandmarks ? <Eye className="w-3.5 h-3.5 text-zinc-300" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
        <span className="hidden sm:inline">{showLandmarks ? 'Hide Landmarks' : 'Show Landmarks'}</span>
        <span className="sm:hidden">Landmarks</span>
      </button>

      {onManualCapture && (
        <button
          onClick={onManualCapture}
          disabled={!isCameraActive}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          title="Manual Snap Photo"
        >
          <CameraIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Manual Capture</span>
          <span className="sm:hidden">Snap</span>
        </button>
      )}
    </div>
  );
});

export default CameraControls;


