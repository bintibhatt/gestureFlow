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
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-slate-900/80 border border-slate-800/80 p-1.5 rounded-lg max-w-full">
      <button
        onClick={onToggleCamera}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
          isCameraActive
            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'
            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
        }`}
        title={isCameraActive ? 'Disable Camera' : 'Enable Camera'}
      >
        {isCameraActive ? <CameraOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" /> : <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />}
        <span className="hidden xs:inline">{isCameraActive ? 'Off' : 'On'}</span>
        <span className="hidden sm:inline">{isCameraActive ? ' Camera' : ' Camera'}</span>
      </button>

      <button
        onClick={onToggleLandmarks}
        disabled={!isCameraActive}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
          showLandmarks
            ? 'bg-violet-500/10 text-violet-300 border border-violet-500/30 hover:bg-violet-500/20'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
        } ${!isCameraActive && 'opacity-50 cursor-not-allowed'}`}
        title={showLandmarks ? 'Hide Landmarks' : 'Show Landmarks'}
      >
        {showLandmarks ? <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400" /> : <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />}
        <span className="hidden sm:inline">{showLandmarks ? 'Hide Landmarks' : 'Show Landmarks'}</span>
        <span className="sm:hidden">Landmarks</span>
      </button>

      {onManualCapture && (
        <button
          onClick={onManualCapture}
          disabled={!isCameraActive}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-sky-500/20"
          title="Manual Snap Photo"
        >
          <CameraIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Manual Capture</span>
          <span className="sm:hidden">Snap</span>
        </button>
      )}
    </div>
  );
});

export default CameraControls;
