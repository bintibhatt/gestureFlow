'use client';

import React, { useEffect, useRef } from 'react';
import { renderTransformedImage, DEFAULT_FILTERS, DEFAULT_TRANSFORMS } from '../../lib/image/processor';
import { Image as ImageIcon, Sliders, RotateCw, FlipHorizontal, History, CheckCircle2 } from 'lucide-react';

export default function CanvasViewer({ photo, currentState }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!photo) return;
    const src = photo.originalDataUrl || photo.currentDataUrl || photo.dataUrl;
    if (!src) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      imgRef.current = img;
      if (canvasRef.current) {
        renderTransformedImage(
          canvasRef.current,
          img,
          photo.filters || DEFAULT_FILTERS,
          photo.transforms || DEFAULT_TRANSFORMS
        );
      }
    };
  }, [photo, photo?.filters, photo?.transforms]);

  if (!photo) {
    return (
      <div className="w-full h-full min-h-[380px] bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 flex flex-col items-center justify-center space-y-4 p-8 text-center shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 shadow-inner">
          <ImageIcon className="w-8 h-8 text-slate-400" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-slate-200 font-bold text-sm">No Photo Selected</h3>
          <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
            Show <span className="font-semibold text-cyan-400">👍 Thumbs Up</span> to capture a photo or <span className="font-semibold text-violet-400">👌 OK</span> to open the menu.
          </p>
        </div>
      </div>
    );
  }

  const { brightness = 100, contrast = 100, grayscale = 0, invert = 0 } = photo.filters || {};
  const { rotation = 0, flipH = false, flipV = false } = photo.transforms || {};
  const undoCount = photo.historyStack ? photo.historyStack.length : 0;

  const isEditing = currentState.startsWith('EDIT');

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between group shadow-2xl">
      {/* Top Bar Header */}
      <div className="z-10 flex items-center justify-between p-4 bg-gradient-to-b from-slate-950/90 to-transparent backdrop-blur-sm">
        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-bold text-slate-200">{photo.name || 'Captured Photo'}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
            {photo.width}x{photo.height}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {undoCount > 0 && (
            <span className="flex items-center space-x-1 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
              <History className="w-3 h-3" />
              <span>{undoCount} edits</span>
            </span>
          )}

          {isEditing && (
            <span className="flex items-center space-x-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
              <Sliders className="w-3 h-3" />
              <span>{currentState}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[460px] object-contain rounded-2xl shadow-2xl border border-slate-800/80 transition-all duration-300"
        />
      </div>

      {/* Bottom Telemetry & Transform Bar */}
      <div className="z-10 p-3.5 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-3">
          <span>
            BRT: <strong className="text-cyan-400">{brightness}%</strong>
          </span>
          <span>
            CONT: <strong className="text-cyan-400">{contrast}%</strong>
          </span>
          <span>
            GRAY: <strong className="text-cyan-400">{grayscale}%</strong>
          </span>
          <span>
            ROT: <strong className="text-cyan-400">{rotation}°</strong>
          </span>
          {(flipH || flipV) && (
            <span className="text-violet-400">
              FLIP: {flipH ? 'H' : ''}{flipV ? 'V' : ''}
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-500">
          {new Date(photo.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
