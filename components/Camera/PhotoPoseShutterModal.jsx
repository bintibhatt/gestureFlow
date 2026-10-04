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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" />

          <div className="relative z-10 bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-sm w-full text-center flex flex-col items-center space-y-4">
            {/* Header pill */}
            <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono font-medium text-zinc-300">
              <Camera className="w-4 h-4 text-zinc-400" />
              <span>PHOTO POSE TIMER</span>
            </div>

            {/* Countdown Badge */}
            <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-black border-2 border-zinc-700 shadow-md">
              <span className="text-4xl font-black font-mono text-zinc-200 opacity-20 animate-ping absolute">
                {secondsLeft}
              </span>
              <span className="text-5xl font-black font-mono text-white tracking-tighter">
                {secondsLeft}
              </span>
            </div>

            {/* Text guidance */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center justify-center space-x-2">
                <Smile className="w-5 h-5 text-zinc-300" />
                <span>Strike a Pose!</span>
              </h3>
              <p className="text-xs text-zinc-400 max-w-[220px] mx-auto leading-relaxed">
                Lower your hand &amp; smile! Camera snaps in{' '}
                <span className="text-white font-bold font-mono">{secondsLeft} second{secondsLeft > 1 ? 's' : ''}</span>.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


