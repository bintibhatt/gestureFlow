'use client';

import React, { useState } from 'react';
import { History, Activity, X, Trash2, Copy, Check, Terminal } from 'lucide-react';

export default function ActivityLogModal({ isOpen, onClose, history = [], onClearHistory }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLogs = () => {
    const logText = history
      .map((item) => `[${item.timestamp}] (${item.context}) ${item.gesture} ${item.action}`)
      .join('\n');
    navigator.clipboard.writeText(logText || 'No logs recorded.');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900/95 border-2 border-emerald-500/40 p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl max-w-xl w-full flex flex-col space-y-4 sm:space-y-5 transform animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 shrink-0">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-base font-extrabold text-slate-100 tracking-tight flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span>Gesture Activity Logs</span>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {history.length} EVENTS
                </span>
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400">Real-time log stream of confirmed gesture triggers</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              onClick={handleCopyLogs}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center space-x-1 text-xs"
              title="Copy logs to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
            {onClearHistory && history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 sm:p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 transition"
                title="Clear log history"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Terminal Logs List */}
        <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-2.5 pr-1 font-mono text-xs custom-scrollbar max-h-[300px] sm:max-h-[380px]">
          {history.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 space-y-2">
              <Activity className="w-8 h-8 text-slate-700 animate-pulse" />
              <span>No gesture activities recorded yet.</span>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-emerald-500/40 transition group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl group-hover:scale-125 transition-transform">{item.gesture}</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-200 font-sans">{item.action}</span>
                    <span className="text-[10px] text-slate-500">
                      State Context: <span className="text-cyan-400">{item.context}</span>
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  {item.timestamp}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Listening for gesture events...</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
}
