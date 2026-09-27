'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Camera,
  Layers,
  Lock,
  Cpu,
  Monitor,
  Database,
  Sliders,
  MessageSquare,
} from 'lucide-react';
import { GESTURE_ICONS } from '../lib/gesture/mapping';
import OpeningWorkspaceModal from '../components/Landing/OpeningWorkspaceModal';
import FeedbackModal from '../components/Feedback/FeedbackModal';
import GestureFlowMark from '../components/Brand/GestureFlowMark';

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

  const supportedGestures = [
    { emoji: '👍', name: 'Thumbs Up', role: 'Snap Photo / Confirm' },
    { emoji: '👎', name: 'Thumbs Down', role: 'Delete Selected Photo' },
    { emoji: '✋', name: 'Open Palm', role: 'View Latest / Exit / Back' },
    { emoji: '👌', name: 'OK Sign', role: 'Open Navigation Menu' },
    { emoji: '☝', name: 'Point Up', role: 'Navigate Up / Prev Tool' },
    { emoji: '👇', name: 'Point Down', role: 'Navigate Down / Next Tool' },
    { emoji: '✌', name: 'Peace Sign', role: 'Rotate Image 90° Right' },
    { emoji: '✊', name: 'Fist', role: 'Toggle Special Adjustments' },
  ];

  const handleLaunch = (e) => {
    e.preventDefault();
    setIsLaunching(true);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
            <GestureFlowMark className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-zinc-100">
            GestureFlow <span className="text-[10px] sm:text-xs font-mono font-normal text-zinc-400">v2.0</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden xs:inline">Feedback</span>
          </button>

          <a
            href="https://github.com/bintibhatt"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 transition"
          >
            <GithubIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>Binti Bhatt</span>
          </a>

          <button
            onClick={handleLaunch}
            className="flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition shadow-sm"
          >
            <span>Launch</span>
            <span className="hidden sm:inline">Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-14 sm:py-20 md:py-28 max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] sm:text-xs font-mono font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">AI-POWERED TOUCHLESS CAMERA WORKSPACE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-100 leading-tight mb-4 sm:mb-6">
          Control your photo workspace with{' '}
          <span className="text-zinc-300 underline underline-offset-8 decoration-zinc-700">
            pure hand gestures.
          </span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-6 sm:mb-8">
          Turn your webcam into a touch-free controller. Snap, browse, and edit photos in your browser with real-time MediaPipe AI &amp; TensorFlow.js.
        </p>

        <button
          onClick={handleLaunch}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm transition flex items-center justify-center space-x-2 shadow-md"
        >
          <Camera className="w-4 h-4" />
          <span>Launch Photo Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* 8 Natural Gestures Grid */}
      <section className="px-4 sm:px-6 py-8 sm:py-12 max-w-5xl mx-auto w-full border-t border-zinc-800/80">
        <div className="text-center space-y-1 mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-mono text-zinc-400 uppercase tracking-wider">
            GESTURE RECOGNITION ENGINE
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">8 Supported Hand Gestures</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {supportedGestures.map((g) => (
            <div
              key={g.name}
              className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col items-center text-center space-y-1.5 group"
            >
              <div className="text-2xl sm:text-3xl group-hover:scale-105 transition-transform">{g.emoji}</div>
              <h3 className="text-xs font-semibold text-zinc-200">{g.name}</h3>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-tight">{g.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights & Privacy Guarantee */}
      <section className="px-4 sm:px-6 py-8 sm:py-12 max-w-5xl mx-auto w-full border-t border-zinc-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-200">100% Client-Side Privacy</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No video or photos ever leave your device. Computer vision and photo storage run entirely in local browser memory &amp; IndexedDB.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <Zap className="w-5 h-5 text-zinc-300" />
            <h3 className="text-sm font-semibold text-zinc-200">Accidental Trigger Protection</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Equipped with a 2-second confirmation countdown pop-up and boundary margin checks so gestures only fire when intended.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 sm:col-span-2 md:col-span-1">
            <Camera className="w-5 h-5 text-zinc-300" />
            <h3 className="text-sm font-semibold text-zinc-200">2s Pose Shutter Timer</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              After confirming Thumbs Up (👍), a 2-second camera pose countdown gives you time to lower your hand and smile before the photo snaps!
            </p>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950 py-6 px-4 sm:px-6 text-center text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center space-x-1.5 sm:space-x-2">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <span className="font-semibold text-zinc-300">GestureFlow</span>
            <span>&mdash; Created by</span>
            <a
              href="https://github.com/bintibhatt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-zinc-100 font-medium flex items-center space-x-1"
            >
              <GithubIcon className="w-3 h-3 text-zinc-400" />
              <span>Binti Bhatt</span>
            </a>
          </div>

          <button onClick={handleLaunch} className="text-zinc-300 hover:text-white font-medium transition">
            Launch App (/use) &rarr;
          </button>
        </div>
      </footer>

      {/* Opening Workspace Initialization Modal */}
      <OpeningWorkspaceModal isOpen={isLaunching} onClose={() => setIsLaunching(false)} />

      {/* User Feedback Modal */}
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
    </main>
  );
}
