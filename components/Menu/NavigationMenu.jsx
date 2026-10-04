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
    <div className="bg-zinc-950 border border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-2xl flex flex-col space-y-4 max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <Menu className="w-4 h-4 text-zinc-300" />
          <h3 className="text-xs sm:text-sm font-bold text-zinc-100 tracking-wider">NAVIGATION MENU</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md font-medium">
            GESTURE CONTROLLED
          </span>
          {onCloseMenu && (
            <button
              onClick={onCloseMenu}
              className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition border border-zinc-800"
              title="Close Menu (✋ Palm)"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {menuOptions.map((option, idx) => {
          const isSelected = idx === selectedIndex;
          const IconComponent = MENU_ICONS[option] || ChevronRight;

          return (
            <div
              key={option}
              onClick={() => onSelectOption && onSelectOption(idx)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-zinc-900 border-zinc-700 text-white font-semibold shadow-sm'
                  : 'bg-black/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-white font-semibold' : 'text-zinc-300'}`}>
                  {option}
                </span>
              </div>

              {isSelected && <Check className="w-4 h-4 text-white" />}
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


