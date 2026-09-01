'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Sliders,
  Database,
  Camera,
  Layers,
  CheckCircle,
  Eye,
  Lock,
  Cpu,
  Monitor,
  Code2,
  BookOpen,
} from 'lucide-react';
import { GESTURE_MAP, GESTURE_ICONS } from '../lib/gesture/mapping';
import { STATES } from '../lib/state/machine';

export default function LandingPage() {
  const [activeDemoState, setActiveDemoState] = useState(STATES.HOME);

  const supportedGestures = [
    { emoji: '👍', name: 'Thumbs Up', role: 'Primary Action / Capture / Increase' },
    { emoji: '👎', name: 'Thumbs Down', role: 'Delete / Negative Action' },
    { emoji: '✋', name: 'Open Palm', role: 'Back / Cancel / View Latest' },
    { emoji: '👌', name: 'OK Sign', role: 'Open Menu / Confirm / Select' },
    { emoji: '☝', name: 'Point Up', role: 'Navigate Up / Next / Increase' },
    { emoji: '👇', name: 'Point Down', role: 'Navigate Down / Previous / Decrease' },
    { emoji: '✌', name: 'Peace Sign', role: 'Secondary Action / Shortcut' },
    { emoji: '✊', name: 'Fist', role: 'Secondary Toggle / Curl' },
  ];

  const demoContexts = [STATES.HOME, STATES.MENU, STATES.BROWSE, STATES.EDIT];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-100 flex items-center space-x-2">
              <span>GestureFlow</span>
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">Contextual Gesture Photo Workspace</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
          <a href="#how-it-works" className="hover:text-cyan-400 transition">How It Works</a>
          <a href="#gestures" className="hover:text-cyan-400 transition">Gesture Vocabulary</a>
          <a href="#privacy" className="hover:text-cyan-400 transition">Privacy</a>
          <a href="#tech" className="hover:text-cyan-400 transition">Tech Stack</a>
        </nav>

        <Link
          href="/use"
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <span>Try GestureFlow</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-28 max-w-6xl mx-auto text-center flex flex-col items-center justify-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-violet-500/15 to-pink-500/15 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-6 shadow-lg shadow-cyan-500/10 animate-in fade-in duration-500">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>TOUCHLESS COMPUTER VISION WORKSPACE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl leading-[1.1] mb-6">
          Interact with photos using{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400">
            pure hand gestures.
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          GestureFlow turns your webcam into a touch-free controller. Capture, browse, and edit photos in your browser with real-time computer vision, without touching a keyboard or mouse.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Link
            href="/use"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Launch Photo Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-800 transition"
          >
            Learn How It Works
          </a>
        </div>
      </section>

      {/* Core Concept: Gesture -> Context -> Action Visualizer */}
      <section id="how-it-works" className="px-6 py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              THE CORE INTERACTION PARADIGM
            </span>
            <h2 className="text-3xl font-bold text-slate-100 tracking-tight">
              Gesture &rarr; Context &rarr; Action
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              Gestures are not fixed to hardcoded triggers. The application state acts as a context filter that gives gestures intuitive, contextual meaning.
            </p>
          </div>

          {/* Interactive Context Switcher */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs font-mono text-slate-500 mr-2">SELECT CONTEXT:</span>
              {demoContexts.map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveDemoState(st)}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                    activeDemoState === st
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Gesture Mapping Grid for selected context */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(GESTURE_MAP[activeDemoState] || {}).map(([gestureName, item]) => {
                const emoji = GESTURE_ICONS[gestureName] || item.label.split(' ')[0];
                const actionLabel = item.label.split(' ').slice(1).join(' ') || item.label;

                return (
                  <div
                    key={gestureName}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col space-y-3 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                      {emoji}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase">
                        {gestureName.replace('_', ' ')}
                      </div>
                      <div className="text-sm font-bold text-slate-200 mt-0.5">
                        {actionLabel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Vocabulary Section */}
      <section id="gestures" className="px-6 py-16 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">
            EXPANDED VOCABULARY
          </span>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">
            8 Natural Hand Gestures
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Stabilized with multi-frame temporal confirmation, confidence thresholds, and cooldowns to prevent accidental triggers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {supportedGestures.map((g) => (
            <div
              key={g.name}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col items-center text-center space-y-2.5"
            >
              <div className="text-4xl mb-1">{g.emoji}</div>
              <h3 className="text-sm font-bold text-slate-200">{g.name}</h3>
              <p className="text-xs text-slate-400">{g.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture & Pipeline */}
      <section className="px-6 py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-3xl font-bold text-slate-100 tracking-tight">
              Modular 7-Stage Pipeline
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Clean separation of concerns from computer vision to canvas rendering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <h4 className="text-sm font-bold text-slate-200">MediaPipe Vision</h4>
              <p className="text-xs text-slate-400">Extracts 21 3D hand keypoints at 60 FPS in browser.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <h4 className="text-sm font-bold text-slate-200">Hybrid ML Engine</h4>
              <p className="text-xs text-slate-400">LSTM temporal classifier paired with geometric finger heuristics.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <h4 className="text-sm font-bold text-slate-200">State Machine</h4>
              <p className="text-xs text-slate-400">Contextual router mapping gestures dynamically based on state.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                04
              </div>
              <h4 className="text-sm font-bold text-slate-200">Local Canvas & IDB</h4>
              <p className="text-xs text-slate-400">Non-destructive transforms, undo stack, and offline IndexedDB.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Guarantee Section */}
      <section id="privacy" className="px-6 py-16 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-mono font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Shield className="w-3.5 h-3.5" />
              <span>ZERO SERVER UPLOADS</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-100 tracking-tight">
              Privacy by Design
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every camera frame, landmark coordinate, and photo is processed entirely inside your browser. No video is ever recorded, streamed, or sent to any remote server or third-party service.
            </p>
          </div>

          <div className="w-full md:w-auto grid grid-cols-1 gap-3 text-xs text-slate-300 font-medium">
            <div className="flex items-center space-x-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>100% Client-Side Machine Learning</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Photos Stored in Private IndexedDB</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <Eye className="w-4 h-4 text-violet-400" />
              <span>Camera Starts Only on Explicit Consent</span>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="tech" className="px-6 py-12 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-slate-400">
          <span className="text-slate-500">POWERED BY:</span>
          <span className="flex items-center space-x-1.5 text-slate-300">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Next.js &amp; React</span>
          </span>
          <span className="flex items-center space-x-1.5 text-slate-300">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>MediaPipe Hands</span>
          </span>
          <span className="flex items-center space-x-1.5 text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>TensorFlow.js</span>
          </span>
          <span className="flex items-center space-x-1.5 text-slate-300">
            <Sliders className="w-4 h-4 text-pink-400" />
            <span>HTML5 Canvas API</span>
          </span>
          <span className="flex items-center space-x-1.5 text-slate-300">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>IndexedDB</span>
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">GestureFlow</span>
            <span>&mdash; Browser-Based Gesture Interaction Workspace</span>
          </div>

          <Link
            href="/use"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
          >
            Launch App (/use) &rarr;
          </Link>
        </div>
      </footer>
    </main>
  );
}
