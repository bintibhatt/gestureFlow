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
      <div className="relative bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-xl shadow-xl max-w-md w-full text-center flex flex-col items-center space-y-5 sm:space-y-6">
        {/* Top Header Tag */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-medium text-blue-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          <span>INITIALIZING WORKSPACE</span>
        </div>

        {/* Animated Central Loader Icon */}
        <div className="relative w-20 h-20 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800">
          {progress < 100 ? (
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
          ) : (
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          )}
        </div>

        {/* Title & Status Message */}
        <div className="space-y-1.5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
            {progress < 100 ? 'Opening GestureFlow Workspace...' : 'Workspace Ready!'}
          </h3>
          <p className="text-xs font-mono text-blue-400 h-5 flex items-center justify-center">
            {statusText}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-1.5">
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-blue-400" />
              <span>WASM &amp; TFJS ENGINE</span>
            </span>
            <span className="font-bold text-blue-400">{progress}%</span>
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
