'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, THEMES } from '../../lib/theme/ThemeContext';
import { Palette, Check, ChevronDown } from 'lucide-react';

export default function ThemeSelector({ compact = false }) {
  const { theme, setTheme, themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border transition text-xs font-medium ${themeConfig.secondaryBtn}`}
        title="Change UI Theme Palette"
      >
        <Palette className={`w-3.5 h-3.5 ${themeConfig.accentText}`} />
        <span className="text-xs">{themeConfig.icon}</span>
        {!compact && <span className="hidden sm:inline font-semibold">{themeConfig.name}</span>}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-950 border border-slate-800 shadow-xl z-50 p-1.5 space-y-1 backdrop-blur-md">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800/80 mb-1">
            Choose Color Palette
          </div>
          {Object.values(THEMES).map((t) => {
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left flex items-start space-x-2 p-2 rounded-lg text-xs transition ${
                  isSelected
                    ? 'bg-slate-800/90 text-white font-medium border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span className="text-base leading-none pt-0.5">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{t.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">
                    {t.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
