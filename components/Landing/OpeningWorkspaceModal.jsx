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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-slate-900/95 border-2 border-cyan-500/50 p-5 sm:p-8 rounded-3xl shadow-2xl shadow-cyan-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar text-center flex flex-col items-center space-y-5 sm:space-y-6 transform animate-in zoom-in-95 duration-200">
        {/* Glow Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none" />

        {/* Top Header Tag */}
        <div className="flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-semibold text-cyan-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>INITIALIZING WORKSPACE</span>
        </div>

        {/* Animated Central Loader Icon */}
        <div className="relative w-24 h-24 flex items-center justify-center rounded-3xl bg-slate-950 border-2 border-cyan-500/40 shadow-inner shadow-cyan-500/20">
          {progress < 100 ? (
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          ) : (
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
          )}
        </div>

        {/* Title & Status Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">
            {progress < 100 ? 'Opening GestureFlow Workspace...' : 'Workspace Ready!'}
          </h3>
          <p className="text-xs font-mono text-cyan-400 h-6 flex items-center justify-center">
            {statusText}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 transition-all duration-300 ease-out shadow-lg shadow-cyan-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>WASM &amp; TFJS ENGINE</span>
            </span>
            <span className="font-bold text-cyan-400">{progress}%</span>
          </div>
        </div>

        {/* Security Note */}
        <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Client-Side Privacy • Camera stays in browser</span>
        </div>
      </div>
    </div>
  );
}
