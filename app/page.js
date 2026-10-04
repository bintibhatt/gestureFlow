'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Camera,
  MessageSquare,
} from 'lucide-react';
import OpeningWorkspaceModal from '../components/Landing/OpeningWorkspaceModal';
import FeedbackModal from '../components/Feedback/FeedbackModal';
import GestureFlowMark from '../components/Brand/GestureFlowMark';
import { useTheme } from '../lib/theme/ThemeContext';

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function LandingPage() {
  const [isLaunching, setIsLaunching] = React.useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = React.useState(false);
  const { themeConfig } = useTheme();

  const supportedGestures = [
    { emoji: '👍', name: 'Thumbs Up', role: 'Snap Photo / Confirm', badge: themeConfig.emeraldBadge },
    { emoji: '👎', name: 'Thumbs Down', role: 'Delete Selected Photo', badge: themeConfig.roseBadge },
    { emoji: '✋', name: 'Open Palm', role: 'View Latest / Exit / Back', badge: themeConfig.cyanBadge },
    { emoji: '👌', name: 'OK Sign', role: 'Open Navigation Menu', badge: themeConfig.violetBadge },
    { emoji: '☝', name: 'Point Up', role: 'Navigate Up / Prev Tool', badge: themeConfig.amberBadge },
    { emoji: '👇', name: 'Point Down', role: 'Navigate Down / Next Tool', badge: themeConfig.badgeBg },
    { emoji: '✌', name: 'Peace Sign', role: 'Rotate Image 90° Right', badge: themeConfig.badgeBg },
    { emoji: '✊', name: 'Fist', role: 'Toggle Special Adjustments', badge: themeConfig.amberBadge },
  ];

  const handleLaunch = (e) => {
    e.preventDefault();
    setIsLaunching(true);
  };

  return (
    <main className={`min-h-screen ${themeConfig.bgClass} ${themeConfig.textClass} flex flex-col transition-colors duration-300`}>
      {/* Top Navbar */}
      <header className={`sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between border-b ${themeConfig.headerBg}`}>
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-900 border border-slate-700/60 flex items-center justify-center overflow-hidden">
            <GestureFlowMark className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            GestureFlow <span className="text-[10px] font-mono opacity-60 font-normal">v2.0</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${themeConfig.secondaryBtn}`}
          >
            <MessageSquare className={`w-3.5 h-3.5 ${themeConfig.cyanAccent}`} />
            <span className="hidden xs:inline">Feedback</span>
          </button>

          <a
            href="https://github.com/bintibhatt"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${themeConfig.secondaryBtn}`}
          >
            <GithubIcon className="w-3.5 h-3.5 opacity-70" />
            <span>Binti Bhatt</span>
          </a>

          <button
            onClick={handleLaunch}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition shadow-md ${themeConfig.primaryBtn}`}
          >
            <span>Launch</span>
            <span className="hidden sm:inline">Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section - Minimal & Small with Refined Multi-Color Indigo Accents */}
      <section className="px-4 sm:px-6 py-8 sm:py-12 md:py-14 max-w-xl mx-auto text-center flex flex-col items-center justify-center">
        <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[10px] sm:text-[11px] font-mono font-medium mb-4 ${themeConfig.cyanBadge}`}>
          <Sparkles className={`w-3 h-3 ${themeConfig.cyanAccent} shrink-0`} />
          <span className="truncate uppercase tracking-wide">Touchless AI Photo Workspace</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug mb-3">
          Control your photo workspace with <span className={themeConfig.accentText}>pure hand gestures.</span>
        </h1>

        <p className="opacity-70 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-6">
          Turn your webcam into a touch-free controller. Snap, browse, and edit photos in your browser with real-time MediaPipe AI.
        </p>

        <button
          onClick={handleLaunch}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-md ${themeConfig.primaryBtn}`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Launch Photo Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* 8 Natural Gestures Grid with Multi-Color Accent Badges */}
      <section className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto w-full border-t border-slate-800/60">
        <div className="text-center space-y-1 mb-5">
          <span className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-widest font-semibold ${themeConfig.cyanAccent}`}>
            GESTURE ENGINE
          </span>
          <h2 className="text-base sm:text-lg font-bold">8 Supported Hand Gestures</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {supportedGestures.map((g) => (
            <div
              key={g.name}
              className={`p-3.5 rounded-xl border transition flex flex-col items-center text-center space-y-1.5 ${themeConfig.cardBg}`}
            >
              <div className="text-2xl">{g.emoji}</div>
              <h3 className="text-xs font-semibold">{g.name}</h3>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${g.badge}`}>
                {g.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights & Privacy Guarantee */}
      <section className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto w-full border-t border-slate-800/60">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={`p-4 rounded-xl border space-y-1.5 ${themeConfig.cardBg}`}>
            <Shield className={`w-4 h-4 ${themeConfig.emeraldAccent}`} />
            <h3 className="text-xs font-bold">100% Client Privacy</h3>
            <p className="text-[11px] opacity-70 leading-relaxed">
              No video or photos leave your device. Processing runs in browser memory &amp; IndexedDB.
            </p>
          </div>

          <div className={`p-4 rounded-xl border space-y-1.5 ${themeConfig.cardBg}`}>
            <Zap className={`w-4 h-4 ${themeConfig.amberAccent}`} />
            <h3 className="text-xs font-bold">Accidental Trigger Protection</h3>
            <p className="text-[11px] opacity-70 leading-relaxed">
              2-second hold countdown pop-up and boundary margin checks ensure accurate gesture execution.
            </p>
          </div>

          <div className={`p-4 rounded-xl border space-y-1.5 ${themeConfig.cardBg}`}>
            <Camera className={`w-4 h-4 ${themeConfig.accentText}`} />
            <h3 className="text-xs font-bold">2s Pose Shutter</h3>
            <p className="text-[11px] opacity-70 leading-relaxed">
              Thumbs Up (👍) gives you 2 seconds to lower your hand and smile before snapping.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`mt-auto border-t border-slate-800/60 py-4 px-4 sm:px-6 text-center text-xs opacity-70 ${themeConfig.bgClass}`}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center justify-center space-x-1.5">
            <Sparkles className={`w-3.5 h-3.5 ${themeConfig.accentText}`} />
            <span className="font-semibold">GestureFlow</span>
            <span>&mdash; Created by</span>
            <a
              href="https://github.com/bintibhatt"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:underline font-medium flex items-center space-x-1 ${themeConfig.accentText}`}
            >
              <GithubIcon className="w-3 h-3" />
              <span>Binti Bhatt</span>
            </a>
          </div>

          <button onClick={handleLaunch} className={`hover:underline font-medium transition text-xs ${themeConfig.accentText}`}>
            Launch Workspace &rarr;
          </button>
        </div>
      </footer>

      {/* Workspace Initialization Modal */}
      <OpeningWorkspaceModal isOpen={isLaunching} onClose={() => setIsLaunching(false)} />

      {/* Feedback Modal */}
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
    </main>
  );
}
