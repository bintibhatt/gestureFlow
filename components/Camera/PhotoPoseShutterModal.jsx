'use client';

import React from 'react';
import { Camera, Sparkles, Smile } from 'lucide-react';

export default function PhotoPoseShutterModal({ secondsLeft, isFlashing }) {
  if (secondsLeft === null && !isFlashing) return null;

  return (
    <>
      {/* Camera Flash Burst Effect */}
      {isFlashing && (
        <div className="fixed inset-0 z-50 bg-white animate-out fade-out duration-700 pointer-events-none" />
      )}

      {/* Shutter Pose Countdown Modal */}
      {secondsLeft !== null && secondsLeft > 0 && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-fade-in" />

          <div className="relative z-10 bg-slate-900/90 border-2 border-amber-400/60 p-8 rounded-3xl shadow-2xl shadow-amber-500/20 max-w-sm w-full text-center flex flex-col items-center space-y-4 animate-in zoom-in-95">
            {/* Header pill */}
            <div className="flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-xs font-mono font-bold text-amber-400">
              <Camera className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>PHOTO POSE TIMER</span>
            </div>

            {/* Countdown Badge */}
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-slate-950 border-4 border-amber-400/80 shadow-inner shadow-amber-500/30">
              <span className="text-5xl font-black font-mono text-amber-300 animate-ping absolute opacity-30">
                {secondsLeft}
              </span>
              <span className="text-6xl font-black font-mono text-amber-400 tracking-tighter">
                {secondsLeft}
              </span>
            </div>

            {/* Text guidance */}
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-100 flex items-center justify-center space-x-2">
                <Smile className="w-5 h-5 text-amber-400" />
                <span>Strike a Pose!</span>
              </h3>
              <p className="text-xs text-slate-300 max-w-[220px] mx-auto leading-relaxed">
                Lower your hand & smile! Camera snaps in{' '}
                <span className="text-amber-400 font-bold font-mono">{secondsLeft} second{secondsLeft > 1 ? 's' : ''}</span>.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
