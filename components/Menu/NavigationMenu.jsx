'use client';

import React from 'react';
import { Menu, ChevronRight, Check, Compass, Image as ImageIcon, Camera, Trash } from 'lucide-react';

const MENU_ICONS = {
  'Browse Photos': Compass,
  'Edit Photo': ImageIcon,
  'Take New Photo': Camera,
  'Clear All Photos': Trash,
};

export default function NavigationMenu({
  menuOptions = [],
  selectedIndex = 0,
  onSelectOption,
  onCloseMenu,
}) {
  return (
    <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col space-y-4 max-w-md w-full animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <Menu className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100 tracking-wider">NAVIGATION MENU</h3>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full">
          GESTURE CONTROLLED
        </span>
      </div>

      <div className="space-y-2">
        {menuOptions.map((option, idx) => {
          const isSelected = idx === selectedIndex;
          const IconComponent = MENU_ICONS[option] || ChevronRight;

          return (
            <div
              key={option}
              onClick={() => onSelectOption && onSelectOption(idx)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border-cyan-400/80 shadow-lg scale-[1.02]'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className={`text-sm font-semibold ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
                  {option}
                </span>
              </div>

              {isSelected && <Check className="w-4 h-4 text-cyan-400 animate-pulse" />}
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-center text-[11px] font-mono text-slate-500 flex items-center justify-center space-x-3 border-t border-slate-800/80">
        <span>☝ Point Up: Prev</span>
        <span>•</span>
        <span>👇 Point Down: Next</span>
        <span>•</span>
        <span>👌 OK: Select</span>
        <span>•</span>
        <span>✋ Palm: Back</span>
      </div>
    </div>
  );
}
