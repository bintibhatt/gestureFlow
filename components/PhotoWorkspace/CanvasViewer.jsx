'use client';

import React, { useEffect, useRef } from 'react';
import { renderTransformedImage, DEFAULT_FILTERS, DEFAULT_TRANSFORMS } from '../../lib/image/processor';
import { Image as ImageIcon, Sliders, RotateCw, FlipHorizontal, History, CheckCircle2 } from 'lucide-react';

const CanvasViewer = React.memo(function CanvasViewer({ photo, currentState }) {
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
      <div className="w-full h-full min-h-[380px] bg-zinc-950/90 rounded-xl border border-zinc-800 flex flex-col items-center justify-center space-y-4 p-8 text-center shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
          <ImageIcon className="w-7 h-7 text-zinc-400" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-zinc-100 font-bold text-sm">No Photo Selected</h3>
          <p className="text-zinc-400 text-xs max-w-xs leading-relaxed">
            Show <span className="font-semibold text-emerald-400">👍 Thumbs Up</span> to capture a photo or <span className="font-semibold text-cyan-400">👌 OK</span> to open the menu.
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
    <div className="relative w-full h-full min-h-[250px] sm:min-h-[380px] bg-black rounded-xl border border-zinc-800 overflow-hidden flex flex-col justify-between group shadow-xl">
      {/* Top Bar Header */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-1.5 p-3 bg-zinc-950/90 border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-zinc-200 truncate max-w-[140px] sm:max-w-[220px]">
            {photo.name || 'Captured Photo'}
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
            {photo.width}x{photo.height}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {undoCount > 0 && (
            <span className="flex items-center space-x-1 text-[9px] sm:text-[10px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
              <History className="w-3 h-3 text-cyan-400" />
              <span>{undoCount} edits</span>
            </span>
          )}

          {isEditing && (
            <span className="flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
              <Sliders className="w-3 h-3 text-amber-400" />
              <span>{currentState}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[300px] sm:max-h-[460px] object-contain rounded-lg border border-zinc-800/80 transition-all duration-300"
        />
      </div>

      {/* Bottom Telemetry & Transform Bar */}
      <div className="z-10 p-2.5 bg-zinc-950 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono text-zinc-400">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span>
            BRT: <strong className="text-zinc-200">{brightness}%</strong>
          </span>
          <span>
            CONT: <strong className="text-zinc-200">{contrast}%</strong>
          </span>
          <span>
            GRAY: <strong className="text-zinc-200">{grayscale}%</strong>
          </span>
          <span>
            ROT: <strong className="text-zinc-200">{rotation}°</strong>
          </span>
          {(flipH || flipV) && (
            <span className="text-zinc-200 font-semibold">
              FLIP: {flipH ? 'H' : ''}{flipV ? 'V' : ''}
            </span>
          )}
        </div>
        <span className="text-[9px] sm:text-[10px] text-zinc-500">
          {new Date(photo.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
});

export default CanvasViewer;

