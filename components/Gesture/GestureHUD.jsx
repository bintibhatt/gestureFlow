'use client';

import React from 'react';
import { getActionForGesture, GESTURE_ICONS } from '../../lib/gesture/mapping';
import { Sparkles, Zap, ShieldCheck, Activity } from 'lucide-react';

export default function GestureHUD({
  gestureData = {},
  currentState = 'HOME',
}) {
  const {
    gesture,
    confidence = 0,
    cooldownProgress = 1,
    triggeredGesture,
    lifecycleState = 'NO_HAND',
  } = gestureData;

  const mappedAction = gesture ? getActionForGesture(gesture, currentState) : null;
  const gestureEmoji = gesture ? GESTURE_ICONS[gesture] || '✋' : '✋';

  const isConfirmed = lifecycleState === 'CONFIRMED' || triggeredGesture;
  const isCooldown = lifecycleState === 'COOLDOWN';

  return (
    <div className="relative overflow-hidden bg-slate-900/85 backdrop-blur-xl border border-slate-800 p-3.5 sm:p-5 rounded-3xl shadow-2xl flex flex-col justify-between space-y-3 sm:space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">GESTURE HUD</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 font-mono text-[9px] sm:text-[10px] text-slate-400">
            {lifecycleState}
          </span>
          <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] sm:text-[11px] font-bold tracking-wider">
            {currentState}
          </span>
        </div>
      </div>

      {/* Main Gesture Display */}
      <div className="flex items-center space-x-3 sm:space-x-4 bg-slate-950/60 p-3 sm:p-4 rounded-2xl border border-slate-800/80">
        <div
          className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner relative transition-all duration-200 shrink-0 ${
            isConfirmed
              ? 'bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border-2 border-emerald-400 scale-105 shadow-emerald-500/20 shadow-lg'
              : gesture
              ? 'bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/40'
              : 'bg-slate-900 border border-slate-800 text-slate-600'
          }`}
        >
          {gesture ? (
            <span className="transform transition-transform hover:scale-125">{gestureEmoji}</span>
          ) : (
            <span className="text-slate-600 text-xs sm:text-sm font-mono">--</span>
          )}

          {isConfirmed && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-400 rounded-full animate-ping" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-200 capitalize truncate">
              {gesture ? gesture.replace('_', ' ') : 'Waiting for Hand...'}
            </span>
            <span className="text-[11px] sm:text-xs font-mono text-cyan-400 font-bold ml-1">
              {gesture ? `${Math.round(confidence * 100)}%` : '0%'}
            </span>
          </div>

          {/* Confidence Progress Bar */}
          <div className="w-full h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                isConfirmed
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                  : 'bg-gradient-to-r from-cyan-500 to-violet-500'
              }`}
              style={{ width: `${gesture ? Math.round(confidence * 100) : 0}%` }}
            />
          </div>

          {/* Mapped Action Hint */}
          <div className="flex items-center space-x-1 pt-0.5 text-xs">
            <Zap className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="text-slate-400 text-[10px] sm:text-[11px]">Action:</span>
            <span className="text-amber-300 font-semibold text-[10px] sm:text-[11px] truncate">
              {mappedAction ? mappedAction.label : 'None for context'}
            </span>
          </div>
        </div>
      </div>

      {/* Cooldown Timer Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Trigger Readiness</span>
          </span>
          <span className={cooldownProgress >= 1 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
            {cooldownProgress >= 1 ? 'READY' : 'COOLDOWN'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              cooldownProgress >= 1 ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.round(cooldownProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
