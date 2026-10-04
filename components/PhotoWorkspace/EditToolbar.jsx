'use client';

import React from 'react';
import { Sun, Contrast, Eye, RotateCw, FlipHorizontal, Undo2, RotateCcw, Sparkles } from 'lucide-react';
import { EDIT_TOOLS, STATES } from '../../lib/state/machine';
import { useTheme } from '../../lib/theme/ThemeContext';

const TOOL_COLORS = {
  Brightness: { icon: 'text-amber-400', active: 'bg-amber-950/40 border-amber-500/60 text-amber-200 shadow-amber-950/40' },
  Contrast: { icon: 'text-cyan-400', active: 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 shadow-cyan-950/40' },
  Grayscale: { icon: 'text-emerald-400', active: 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-emerald-950/40' },
  'Rotate (90°)': { icon: 'text-violet-400', active: 'bg-violet-950/40 border-violet-500/60 text-violet-200 shadow-violet-950/40' },
  Flip: { icon: 'text-indigo-400', active: 'bg-indigo-950/50 border-indigo-500/60 text-indigo-200 shadow-indigo-950/40' },
  Undo: { icon: 'text-rose-400', active: 'bg-rose-950/40 border-rose-500/60 text-rose-200 shadow-rose-950/40' },
  'Reset All': { icon: 'text-red-400', active: 'bg-red-950/40 border-red-500/60 text-red-200 shadow-red-950/40' },
};

const EditToolbar = React.memo(function EditToolbar({
  currentState,
  editToolIndex = 0,
  onSelectTool,
}) {
  const { themeConfig } = useTheme();
  const isSubMode = [
    STATES.EDIT_BRIGHTNESS,
    STATES.EDIT_CONTRAST,
    STATES.EDIT_ROTATE,
    STATES.EDIT_FLIP,
  ].includes(currentState);

  return (
    <div className={`p-3 sm:p-3.5 rounded-xl flex flex-col space-y-2.5 shadow-md border ${themeConfig.cardBg}`}>
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center space-x-2">
          <Sparkles className={`w-3.5 h-3.5 ${themeConfig.accentText}`} />
          <span className="text-[11px] sm:text-xs font-bold tracking-wider truncate uppercase">
            {isSubMode ? `SUB-MODE: ${currentState}` : 'PHOTO EDIT TOOLS'}
          </span>
        </div>
        <span className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-md border ${themeConfig.cyanBadge}`}>
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

          const isActive = isSubActive || isSelected;
          const colors = TOOL_COLORS[tool] || { icon: 'text-indigo-400', active: themeConfig.cardSelectedBg };

          return (
            <button
              key={tool}
              onClick={() => onSelectTool && onSelectTool(idx, tool)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-medium transition-all duration-150 ${
                isActive
                  ? `${colors.active} font-bold shadow-md scale-[1.02]`
                  : 'bg-black/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="mb-1">
                {tool === 'Brightness' && <Sun className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colors.icon}`} />}
                {tool === 'Contrast' && <Contrast className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colors.icon}`} />}
                {tool === 'Grayscale' && <Eye className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colors.icon}`} />}
                {tool === 'Rotate (90°)' && <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colors.icon}`} />}
                {tool === 'Flip' && <FlipHorizontal className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colors.icon}`} />}
                {tool === 'Undo' && <Undo2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colors.icon}`} />}
                {tool === 'Reset All' && <RotateCcw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colors.icon}`} />}
              </div>
              <span className="text-[10px] sm:text-[11px] truncate w-full text-center">{tool}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default EditToolbar;
