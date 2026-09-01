'use client';

import React from 'react';
import { Sun, Contrast, Eye, RotateCw, FlipHorizontal, Undo2, RotateCcw, Sparkles } from 'lucide-react';
import { EDIT_TOOLS, STATES } from '../../lib/state/machine';

export default function EditToolbar({
  currentState,
  editToolIndex = 0,
  onSelectTool,
  onTriggerAction,
}) {
  const isSubMode = [
    STATES.EDIT_BRIGHTNESS,
    STATES.EDIT_CONTRAST,
    STATES.EDIT_ROTATE,
    STATES.EDIT_FLIP,
  ].includes(currentState);

  return (
    <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 p-3 sm:p-4 rounded-3xl shadow-xl flex flex-col space-y-2.5 sm:space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          <span className="text-[11px] sm:text-xs font-bold text-slate-200 uppercase tracking-wider truncate">
            {isSubMode ? `SUB-MODE: ${currentState}` : 'PHOTO EDIT TOOLS'}
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 sm:px-2.5 py-0.5 rounded-full">
          {isSubMode ? '☝ Up / ✌ Down / ✋ Done' : '☝/👇 Nav & 👌 Select'}
        </span>
      </div>

      {/* Tool Buttons Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-1.5 sm:gap-2">
        {EDIT_TOOLS.map((tool, idx) => {
          const isSelected = !isSubMode && editToolIndex === idx;
          const isSubActive =
            (tool === 'Brightness' && currentState === STATES.EDIT_BRIGHTNESS) ||
            (tool === 'Contrast' && currentState === STATES.EDIT_CONTRAST) ||
            (tool === 'Rotate (90°)' && currentState === STATES.EDIT_ROTATE) ||
            (tool === 'Flip' && currentState === STATES.EDIT_FLIP);

          return (
            <button
              key={tool}
              onClick={() => onSelectTool && onSelectTool(idx, tool)}
              className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border text-xs font-semibold transition-all active:scale-95 ${
                isSubActive
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-500/40 shadow-lg'
                  : isSelected
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md scale-105'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="mb-0.5 sm:mb-1">
                {tool === 'Brightness' && <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
                {tool === 'Contrast' && <Contrast className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />}
                {tool === 'Grayscale' && <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />}
                {tool === 'Rotate (90°)' && <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />}
                {tool === 'Flip' && <FlipHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />}
                {tool === 'Undo' && <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />}
                {tool === 'Reset All' && <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />}
              </div>
              <span className="text-[10px] sm:text-[11px] truncate w-full text-center">{tool}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
