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
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-2xl max-w-xl w-full flex flex-col space-y-4 transform animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-100 tracking-tight flex flex-wrap items-center gap-1.5">
                <span>Gesture Activity Logs</span>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 font-semibold">
                  {history.length} EVENTS
                </span>
              </h3>
              <p className="text-[10px] sm:text-xs text-zinc-400">Real-time log stream of confirmed gesture triggers</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={handleCopyLogs}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition flex items-center space-x-1 text-xs border border-zinc-800"
              title="Copy logs to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {onClearHistory && history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition border border-zinc-800"
                title="Clear log history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition border border-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Logs List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs custom-scrollbar max-h-[300px] sm:max-h-[380px]">
          {history.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-zinc-500 space-y-2">
              <Activity className="w-7 h-7 text-zinc-700" />
              <span>No gesture activities recorded yet.</span>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-zinc-800 hover:border-zinc-700 transition"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-lg">{item.gesture}</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-200 font-sans">{item.action}</span>
                    <span className="text-[10px] text-zinc-500">
                      State Context: <span className="text-zinc-300">{item.context}</span>
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 font-mono">
                  {item.timestamp}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center space-x-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Listening for gesture events...</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs transition border border-zinc-800"
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
}


