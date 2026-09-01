'use client';

import React from 'react';
import { History, Activity } from 'lucide-react';

export default function ActionHistory({ history = [] }) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col space-y-3 h-full max-h-[260px] overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">ACTION LOG</h3>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>REAL-TIME</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {history.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 py-8">
            No gesture actions recorded yet. Perform a gesture to trigger!
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs hover:border-slate-700 transition"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base">{item.gesture}</span>
                <span className="font-semibold text-slate-300">{item.action}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-cyan-400">
                  {item.context}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
