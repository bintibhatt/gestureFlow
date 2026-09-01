'use client';

import React from 'react';
import { AlertTriangle, Trash2, X, Check } from 'lucide-react';

export default function DeleteConfirmModal({
  photo,
  onConfirm,
  onCancel,
}) {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl shadow-rose-950/40 flex flex-col space-y-5 text-center">
        {/* Warning Icon Header */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 shadow-lg shadow-rose-500/10">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Delete This Photo?</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            This photo will be permanently removed from your browser&apos;s local IndexedDB gallery.
          </p>
        </div>

        {/* Photo Preview Thumbnail */}
        <div className="relative aspect-video max-h-44 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 mx-auto w-full flex items-center justify-center shadow-inner">
          <img
            src={photo.currentDataUrl || photo.originalDataUrl || photo.dataUrl}
            alt={photo.name}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-300">
            {photo.name}
          </div>
        </div>

        {/* Gesture Guidance */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onConfirm}
            className="flex items-center justify-center space-x-2 p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition active:scale-95 border border-rose-500"
          >
            <span className="text-base">👌</span>
            <div className="text-left leading-tight">
              <div>Confirm Delete</div>
              <div className="text-[10px] opacity-80 font-normal">Show OK gesture</div>
            </div>
          </button>

          <button
            onClick={onCancel}
            className="flex items-center justify-center space-x-2 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition active:scale-95"
          >
            <span className="text-base">✋</span>
            <div className="text-left leading-tight">
              <div>Cancel</div>
              <div className="text-[10px] opacity-70 font-normal">Show Palm gesture</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
