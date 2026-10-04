'use client';

import React from 'react';
import { getActionForGesture, GESTURE_ICONS } from '../../lib/gesture/mapping';
import { Timer, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ActionCountdownModal({
  gestureData = {},
  currentState = 'HOME',
}) {
  const {
    pendingGesture,
    gesture,
    countdownProgress = 0,
    countdownSeconds = 2,
    triggeredGesture,
    lifecycleState,
  } = gestureData;

  const activeGesture = pendingGesture || gesture;
  const isExecuting = lifecycleState === 'CONFIRMED' || triggeredGesture;
  const isActive = (activeGesture && countdownProgress > 0) || isExecuting;

  if (!isActive) return null;

  const mappedAction = activeGesture ? getActionForGesture(activeGesture, currentState) : null;
  const emoji = activeGesture ? GESTURE_ICONS[activeGesture] || '✋' : '✋';
  const actionLabel = mappedAction ? mappedAction.label : 'Executing Action';

  // SVG Radial Progress Calculation (Radius = 36, Circumference ~ 226)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - countdownProgress * circumference;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      {/* Dimmed backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in" />

      {/* Main Glassmorphism Modal Box */}
      <div className="relative z-10 bg-zinc-950 border border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-xl max-w-sm w-full text-center flex flex-col items-center space-y-4">
        {/* Top Header Tag */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono font-medium text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span>GESTURE CONFIRMATION</span>
        </div>

        {/* Radial Countdown Indicator & Emoji Center */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
            {/* Background Track */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              className="stroke-zinc-900"
              strokeWidth="5"
              fill="transparent"
            />
            {/* Dynamic Progress Ring */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              className={`transition-all duration-150 ease-linear ${
                isExecuting
                  ? 'stroke-emerald-400'
                  : 'stroke-zinc-200'
              }`}
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Emoji & Seconds Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isExecuting ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            ) : (
              <>
                <span className="text-3xl">{emoji}</span>
                <span className="text-xs font-mono font-bold text-zinc-200 mt-0.5">
                  {countdownSeconds}s
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Title & Subtext */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-zinc-100 tracking-tight">
            {isExecuting ? 'Action Executed!' : `Performing: ${actionLabel}`}
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-[240px] mx-auto">
            {isExecuting
              ? 'Gesture action successfully performed.'
              : 'Hold hand steady for 2 seconds to confirm or lower hand to cancel.'}
          </p>
        </div>

        {/* Progress Bar & Status Pill */}
        <div className="w-full space-y-1.5 pt-1">
          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className={`h-full transition-all duration-150 ${
                isExecuting
                  ? 'bg-emerald-400'
                  : 'bg-zinc-200'
              }`}
              style={{ width: `${Math.round(countdownProgress * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
            <span className="flex items-center space-x-1 text-zinc-500">
              <Timer className="w-3 h-3 text-zinc-400" />
              <span>2-SEC HOLD</span>
            </span>
            <span className={isExecuting ? 'text-emerald-400 font-bold' : 'text-zinc-200 font-bold'}>
              {Math.round(countdownProgress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


