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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 sm:p-6 max-w-md w-full text-center flex flex-col space-y-4 shadow-xl">
        {/* Warning Icon Header */}
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight">Delete This Photo?</h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            This photo will be permanently removed from your browser&apos;s local IndexedDB gallery.
          </p>
        </div>

        {/* Photo Preview Thumbnail */}
        <div className="relative aspect-video max-h-36 sm:max-h-44 rounded-lg overflow-hidden border border-zinc-800 bg-black mx-auto w-full flex items-center justify-center">
          <img
            src={photo.currentDataUrl || photo.originalDataUrl || photo.dataUrl}
            alt={photo.name}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 border border-zinc-800 text-[10px] font-mono text-zinc-300">
            {photo.name}
          </div>
        </div>

        {/* Gesture Guidance */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={onConfirm}
            className="flex items-center justify-center space-x-2 p-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition shadow-sm"
          >
            <span className="text-base">👌</span>
            <div className="text-left leading-tight">
              <div>Confirm Delete</div>
              <div className="text-[10px] opacity-80 font-normal">Show OK gesture</div>
            </div>
          </button>

          <button
            onClick={onCancel}
            className="flex items-center justify-center space-x-2 p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
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


