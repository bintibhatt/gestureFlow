'use client';

import React from 'react';
import { Menu, ChevronRight, Check, Compass, Image as ImageIcon, Camera, Trash, X } from 'lucide-react';

const MENU_ICONS = {
  'Browse Photos': Compass,
  'Edit Photo': ImageIcon,
  'Take New Photo': Camera,
  'Clear All Photos': Trash,
};

const NavigationMenu = React.memo(function NavigationMenu({
  menuOptions = [],
  selectedIndex = 0,
  onSelectOption,
  onCloseMenu,
}) {
  return (
    <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl shadow-2xl flex flex-col space-y-4 max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <Menu className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-100 tracking-wider">NAVIGATION MENU</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-sky-300 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md">
            GESTURE CONTROLLED
          </span>
          {onCloseMenu && (
            <button
              onClick={onCloseMenu}
              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              title="Close Menu (✋ Palm)"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        {menuOptions.map((option, idx) => {
          const isSelected = idx === selectedIndex;
          const IconComponent = MENU_ICONS[option] || ChevronRight;

          return (
            <div
              key={option}
              onClick={() => onSelectOption && onSelectOption(idx)}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-300 font-semibold shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-slate-100 font-semibold' : 'text-slate-300'}`}>
                  {option}
                </span>
              </div>

              {isSelected && <Check className="w-4 h-4 text-sky-400" />}
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-center text-[10px] sm:text-[11px] font-mono text-zinc-500 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 border-t border-zinc-800/80">
        <span>☝ Point Up: Prev</span>
        <span className="hidden xs:inline">•</span>
        <span>👇 Point Down: Next</span>
        <span className="hidden xs:inline">•</span>
        <span>👌 OK: Select</span>
        <span className="hidden xs:inline">•</span>
        <span>✋ Palm: Back</span>
      </div>
    </div>
  );
});

export default NavigationMenu;
