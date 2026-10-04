'use client';

import React from 'react';
import { getActionForGesture, GESTURE_ICONS } from '../../lib/gesture/mapping';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../lib/theme/ThemeContext';

const GestureHUD = React.memo(function GestureHUD({
  gestureData = {},
  currentState = 'HOME',
}) {
  const { themeConfig } = useTheme();
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

  return (
    <div className={`relative overflow-hidden backdrop-blur-xl border p-3.5 sm:p-5 rounded-xl shadow-md flex flex-col justify-between space-y-3 sm:space-y-4 ${themeConfig.cardBg}`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <Sparkles className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${themeConfig.cyanAccent}`} />
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">GESTURE HUD</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="px-2 py-0.5 rounded-md bg-black/60 border border-slate-800 font-mono text-[9px] sm:text-[10px] text-slate-400">
            {lifecycleState}
          </span>
          <span className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md border font-mono text-[10px] sm:text-[11px] font-medium tracking-wider ${themeConfig.cyanBadge}`}>
            {currentState}
          </span>
        </div>
      </div>

      {/* Main Gesture Display */}
      <div className="flex items-center space-x-3 bg-black/40 p-3 rounded-lg border border-slate-800/80">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center text-2xl sm:text-3xl relative transition-all duration-200 shrink-0 ${
            isConfirmed
              ? 'bg-slate-900 border-2 border-emerald-500 text-emerald-400 shadow-md'
              : gesture
              ? `${themeConfig.cardSelectedBg} shadow-sm`
              : 'bg-slate-900/60 border border-slate-800 text-slate-600'
          }`}
        >
          {gesture ? (
            <span>{gestureEmoji}</span>
          ) : (
            <span className="opacity-40 text-xs sm:text-sm font-mono">--</span>
          )}

          {isConfirmed && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold capitalize truncate">
              {gesture ? gesture.replace('_', ' ') : 'Waiting for Hand...'}
            </span>
            <span className={`text-[11px] sm:text-xs font-mono font-bold ml-1 ${themeConfig.accentText}`}>
              {gesture ? `${Math.round(confidence * 100)}%` : '0%'}
            </span>
          </div>

          {/* Confidence Progress Bar */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-150 ${
                isConfirmed
                  ? 'bg-emerald-400'
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${gesture ? Math.round(confidence * 100) : 0}%` }}
            />
          </div>

          {/* Mapped Action Hint */}
          <div className="flex items-center space-x-1 pt-0.5 text-xs">
            <Zap className={`w-3 h-3 ${themeConfig.amberAccent} shrink-0`} />
            <span className="opacity-70 text-[10px] sm:text-[11px]">Action:</span>
            <span className="font-medium text-[10px] sm:text-[11px] truncate">
              {mappedAction ? mappedAction.label : 'None for context'}
            </span>
          </div>
        </div>
      </div>

      {/* Cooldown Timer Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] opacity-70 font-mono">
          <span className="flex items-center space-x-1">
            <ShieldCheck className={`w-3 h-3 ${themeConfig.emeraldAccent}`} />
            <span>Trigger Readiness</span>
          </span>
          <span className={cooldownProgress >= 1 ? `${themeConfig.highlightText} font-semibold` : 'opacity-70'}>
            {cooldownProgress >= 1 ? 'READY' : 'COOLDOWN'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-100 ${
              cooldownProgress >= 1 ? 'bg-emerald-400' : 'bg-slate-700'
            }`}
            style={{ width: `${Math.round(cooldownProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
});

export default GestureHUD;
