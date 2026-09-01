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
        className="bg-slate-900/95 border-2 border-violet-500/40 p-5 sm:p-8 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col space-y-4 sm:space-y-6 transform animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-violet-400 shadow-lg shadow-violet-500/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
                <span>Gesture Controls Reference</span>
                <Sparkles className="w-4 h-4 text-violet-400" />
              </h3>
              <p className="text-xs text-slate-400">Which hand gesture to use & what action it performs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Context Mode Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {Object.keys(CONTEXT_NAMES).map((ctxKey) => {
            const isActive = selectedContext === ctxKey;
            return (
              <button
                key={ctxKey}
                onClick={() => setSelectedContext(ctxKey)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {CONTEXT_NAMES[ctxKey]}
              </button>
            );
          })}
        </div>

        {/* Gesture Mapping Grid for Selected Context */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>GESTURE & HAND POSE</span>
            <span>ACTION PERFORMED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(currentGuide).map(([gestureName, item]) => {
              const emoji = GESTURE_ICONS[gestureName] || '✋';
              const actionLabel = item.label;

              return (
                <div
                  key={gestureName}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-violet-500/50 transition-all shadow-inner group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-md">
                      {emoji}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200 capitalize">
                        {gestureName.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-violet-400">Trigger Pose</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-right">
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />
                    <span className="text-xs font-semibold text-amber-300 max-w-[120px] truncate">
                      {actionLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Guidance */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1.5 text-slate-500">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Hold any gesture steady for 2s to execute action</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
