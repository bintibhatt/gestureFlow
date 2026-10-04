'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Cpu, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export default function OpeningWorkspaceModal({ isOpen, onClose }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Computer Vision Engine...');

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    // Step 1: 0% -> 35%
    setProgress(15);
    setStatusText('Loading MediaPipe Hand Tracker & WASM Binaries...');

    const timer1 = setTimeout(() => {
      setProgress(55);
      setStatusText('Configuring Real-Time Gesture Engine...');
    }, 600);

    const timer2 = setTimeout(() => {
      setProgress(88);
      setStatusText('Engine Ready! Preparing Workspace...');
    }, 1200);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Entering Workspace...');
      router.push('/use?autostart=true');
    }, 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full text-center flex flex-col items-center space-y-5 sm:space-y-6">
        {/* Top Header Tag */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono font-medium text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
          <span>INITIALIZING WORKSPACE</span>
        </div>

        {/* Animated Central Loader Icon */}
        <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl bg-black border border-zinc-800 shadow-sm">
          {progress < 100 ? (
            <Loader2 className="w-10 h-10 text-zinc-300 animate-spin" />
          ) : (
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          )}
        </div>

        {/* Title & Status Message */}
        <div className="space-y-1.5">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight">
            {progress < 100 ? 'Opening GestureFlow Workspace...' : 'Workspace Ready!'}
          </h3>
          <p className="text-xs font-mono text-zinc-400 h-5 flex items-center justify-center">
            {statusText}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-1.5">
          <div className="w-full h-2 bg-black rounded-full overflow-hidden p-0.5 border border-zinc-800">
            <div
              className="h-full rounded-full bg-zinc-100 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-zinc-400" />
              <span>WASM &amp; TFJS ENGINE</span>
            </span>
            <span className="font-bold text-zinc-200">{progress}%</span>
          </div>
        </div>

        {/* Security Note */}
        <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Client-Side Privacy • Camera stays in browser</span>
        </div>
      </div>
    </div>
  );
}

