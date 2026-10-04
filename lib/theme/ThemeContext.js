'use client';

import React, { createContext, useContext } from 'react';

export const THEMES = {
  slate: {
    id: 'slate',
    name: 'Slate Indigo & Vibrant Accents',
    icon: '🌌',
    description: 'Pitch-black background with indigo, cyan, emerald, amber & violet accents',
    bgClass: 'bg-black',
    textClass: 'text-slate-100',
    headerBg: 'bg-black/90 border-slate-900',
    cardBg: 'bg-zinc-950/90 border-slate-800/80 hover:border-slate-700',
    cardSelectedBg: 'bg-indigo-950/50 border-indigo-500/60 text-indigo-200',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/50',
    secondaryBtn: 'bg-zinc-950 border-slate-800 hover:border-slate-700 text-slate-200',
    badgeBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    accentText: 'text-indigo-400',
    highlightText: 'text-emerald-400',
    statAccent: 'text-indigo-400',

    // Multi-color Accent Palette paired with Indigo
    cyanAccent: 'text-cyan-400',
    emeraldAccent: 'text-emerald-400',
    amberAccent: 'text-amber-400',
    violetAccent: 'text-violet-400',
    roseAccent: 'text-rose-400',

    cyanBadge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    emeraldBadge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    amberBadge: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    violetBadge: 'bg-violet-500/10 border-violet-500/30 text-violet-300',
    roseBadge: 'bg-rose-500/10 border-rose-500/30 text-rose-300',

    skeletonLine: 'rgba(99, 102, 241, 0.75)', // Indigo skeleton lines
    skeletonJoint: '#06b6d4', // Cyan keypoint nodes
    skeletonThumb: '#10b981', // Emerald thumb tip node
    skeletonIndex: '#f59e0b', // Amber index tip node
    glowClass: 'shadow-[0_0_20px_rgba(99,102,241,0.2)]',
  },
};

const ThemeContext = createContext({
  theme: 'slate',
  themeConfig: THEMES.slate,
});

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ theme: 'slate', themeConfig: THEMES.slate }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
