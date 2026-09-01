'use client';

import React from 'react';
import { GESTURE_MAP, GESTURE_ICONS } from '../../lib/gesture/mapping';
import { BookOpen } from 'lucide-react';

export default function GestureGuide({ currentState = 'HOME' }) {
  const currentGuide = GESTURE_MAP[currentState] || {};

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">GESTURE CHEAT SHEET</h3>
        </div>
        <span className="text-[11px] font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-full">
          {currentState}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {Object.entries(currentGuide).map(([gestureName, item]) => {
          const emoji = GESTURE_ICONS[gestureName] || item.label.split(' ')[0] || '✋';
          const title = item.label.split(' ').slice(1).join(' ') || item.label;

          return (
            <div
              key={gestureName}
              className="flex items-center space-x-2.5 p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-violet-500/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                {emoji}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-200 truncate">{title}</span>
                <span className="text-[10px] font-mono text-slate-500 capitalize">{gestureName.replace('_', ' ')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
