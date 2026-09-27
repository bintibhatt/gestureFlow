'use client';

import React, { useState } from 'react';
import { GESTURE_MAP, GESTURE_ICONS } from '../../lib/gesture/mapping';
import { BookOpen, X, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

const CONTEXT_NAMES = {
  HOME: 'Camera Mode',
  BROWSE: 'Gallery Mode',
  EDIT: 'Photo Editor Mode',
  MENU: 'Navigation Menu',
};

export default function GestureGuideModal({ isOpen, onClose, currentState = 'HOME' }) {
  const [selectedContext, setSelectedContext] = useState(currentState);

  if (!isOpen) return null;

  const currentGuide = GESTURE_MAP[selectedContext] || GESTURE_MAP.HOME || {};

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-xl shadow-xl max-w-2xl w-full flex flex-col space-y-4 sm:space-y-5 transform animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-100 tracking-tight flex items-center space-x-1.5">
                <span>Gesture Controls Reference</span>
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              </h3>
              <p className="text-[11px] text-zinc-400">Which hand gesture to use &amp; what action it performs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Context Mode Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-0.5">
          {Object.keys(CONTEXT_NAMES).map((ctxKey) => {
            const isActive = selectedContext === ctxKey;
            return (
              <button
                key={ctxKey}
                onClick={() => setSelectedContext(ctxKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                {CONTEXT_NAMES[ctxKey]}
              </button>
            );
          })}
        </div>

        {/* Gesture Mapping Grid for Selected Context */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <span>GESTURE &amp; HAND POSE</span>
            <span>ACTION PERFORMED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(currentGuide).map(([gestureName, item]) => {
              const emoji = GESTURE_ICONS[gestureName] || '✋';
              const actionLabel = item.label;

              return (
                <div
                  key={gestureName}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl shrink-0">
                      {emoji}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-zinc-200 capitalize">
                        {gestureName.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">Trigger Pose</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 text-right">
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                    <span className="text-xs font-medium text-zinc-200 max-w-[120px] truncate">
                      {actionLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Guidance */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center space-x-1.5 text-zinc-500 text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>Hold gesture steady for 2s to execute</span>
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
