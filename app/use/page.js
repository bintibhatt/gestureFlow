'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import CameraFeed from '../../components/Camera/CameraFeed';
import CameraControls from '../../components/Camera/CameraControls';
import GestureHUD from '../../components/Gesture/GestureHUD';
import CanvasViewer from '../../components/PhotoWorkspace/CanvasViewer';
import PhotoGallery from '../../components/PhotoWorkspace/PhotoGallery';
import EditToolbar from '../../components/PhotoWorkspace/EditToolbar';
import NavigationMenu from '../../components/Menu/NavigationMenu';
import DeleteConfirmModal from '../../components/PhotoWorkspace/DeleteConfirmModal';
import ActionCountdownModal from '../../components/Gesture/ActionCountdownModal';
import PhotoPoseShutterModal from '../../components/Camera/PhotoPoseShutterModal';
import GestureGuideModal from '../../components/Gesture/GestureGuideModal';
import ActivityLogModal from '../../components/Gesture/ActivityLogModal';
import FeedbackModal from '../../components/Feedback/FeedbackModal';

import { stateMachine, STATES } from '../../lib/state/machine';
import { loadGestureModel, loadHandDetector } from '../../lib/gesture/modelLoader';
import { GestureEngine } from '../../lib/gesture/engine';
import { getActionForGesture, ACTION_TYPES } from '../../lib/gesture/mapping';
import { executeAction } from '../../lib/actions';
import { getPhotos, savePhoto } from '../../lib/storage/db';
import { captureFrame } from '../../lib/image/processor';
import { Sparkles, Camera, ArrowLeft, Shield, Video, Power, Menu, BookOpen, Terminal, History, Image as ImageIcon, MessageSquare } from 'lucide-react';

export default function GestureAppPage() {
  const [appState, setAppState] = useState(stateMachine.getState());
  const [hasStartedCamera, setHasStartedCamera] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [gestureData, setGestureData] = useState({
    gesture: null,
    confidence: 0,
    cooldownProgress: 1,
    lifecycleState: 'NO_HAND',
  });
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isEngineReady, setIsEngineReady] = useState(false);

  // Photo Pose Countdown State
  const [poseCountdown, setPoseCountdown] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const isPosingRef = useRef(false);

  const videoElementRef = useRef(null);
  const gestureEngineRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Auto-start camera when redirected from Landing Page launch modal & clean up query string
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('autostart') === 'true') {
        setHasStartedCamera(true);
        setIsCameraActive(true);
        // Silently remove ?autostart=true from browser address bar
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Subscribe to StateMachine updates
  useEffect(() => {
    const unsubscribe = stateMachine.subscribe((state) => {
      setAppState(state);
    });

    // Load initial photos from IndexedDB
    getPhotos().then((photos) => {
      stateMachine.setState(STATES.HOME, {
        photos,
        selectedPhoto: photos[0] || null,
      });
    });

    return () => unsubscribe();
  }, []);

  // Initialize Gesture Model & Hand Detector Engine
  useEffect(() => {
    async function initEngine() {
      setIsModelLoading(true);
      try {
        const gestureModel = await loadGestureModel();
        const handDetector = await loadHandDetector();
        gestureEngineRef.current = new GestureEngine(gestureModel, handDetector);
        setIsEngineReady(true);
      } catch (err) {
        console.error('[GestureAppPage] Engine initialization error:', err);
      } finally {
        setIsModelLoading(false);
      }
    }
    initEngine();
  }, []);

  // 2-Second Pose Countdown Callback for Photo Capture
  const triggerPosePhotoCapture = useCallback((videoElement) => {
    if (isPosingRef.current) return;
    isPosingRef.current = true;
    setPoseCountdown(2);

    let currentSeconds = 2;
    const interval = setInterval(() => {
      currentSeconds -= 1;
      if (currentSeconds > 0) {
        setPoseCountdown(currentSeconds);
      } else {
        clearInterval(interval);
        setPoseCountdown(null);
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 500);

        // Perform actual photo snapshot after 2-second pose delay
        executeAction(ACTION_TYPES.TAKE_PHOTO, { videoElement }).finally(() => {
          isPosingRef.current = false;
        });
      }
    }, 1000);
  }, []);

  // Real-time Frame Processing Loop
  const processFrameLoop = useCallback(async () => {
    if (gestureEngineRef.current && videoElementRef.current && isCameraActive && hasStartedCamera) {
      const video = videoElementRef.current;
      if (video.readyState >= 2 && !video.paused && !video.ended) {
        const result = await gestureEngineRef.current.processFrame(video);
        if (result) {
          setGestureData(result);

          // Execute action if gesture was confirmed
          if (result.triggeredGesture) {
            const mapped = getActionForGesture(result.triggeredGesture, stateMachine.getState().currentState);
            if (mapped && mapped.action) {
              if (mapped.action === ACTION_TYPES.TAKE_PHOTO) {
                // Give user 3 seconds to pose before snapping photo!
                triggerPosePhotoCapture(video);
              } else {
                await executeAction(mapped.action, {
                  videoElement: video,
                });
              }
            }
          }
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(processFrameLoop);
  }, [isCameraActive, hasStartedCamera, triggerPosePhotoCapture]);

  useEffect(() => {
    if (hasStartedCamera && isCameraActive && isEngineReady) {
      animationFrameRef.current = requestAnimationFrame(processFrameLoop);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [processFrameLoop, hasStartedCamera, isCameraActive, isEngineReady]);

  // Video element readiness callback
  const handleVideoReady = (videoEl) => {
    videoElementRef.current = videoEl;
  };

  // Start Camera Consent Flow
  const handleStartCamera = () => {
    setHasStartedCamera(true);
    setIsCameraActive(true);
  };

  // Manual Photo Capture (Triggers 3s Pose Countdown)
  const handleManualCapture = async () => {
    if (videoElementRef.current) {
      triggerPosePhotoCapture(videoElementRef.current);
    }
  };

  // Select Photo from Gallery
  const handleSelectPhoto = (idx, photo) => {
    stateMachine.setState(appState.currentState, {
      browseIndex: idx,
      selectedPhoto: photo,
    });
  };

  // Request Photo Deletion (opens Confirmation modal)
  const handleRequestDelete = (photo) => {
    stateMachine.transitionTo(STATES.CONFIRM_DELETE, {
      deleteCandidate: photo,
      deleteContext: appState.currentState,
    });
  };

  // Edit Tool selection via click fallback
  const handleSelectEditTool = async (idx, toolName) => {
    stateMachine.setState(appState.currentState, { editToolIndex: idx });
    await executeAction('EDIT_TOOL_SELECT');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-2 shadow-xl">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition bg-slate-950 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Home</span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-slate-100 flex items-center space-x-1.5 sm:space-x-2">
                <span>GestureFlow</span>
                <span className="hidden sm:inline text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  V2 Interactive
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Workspace Quick Menu & State Badges */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 overflow-x-auto max-w-full py-0.5 custom-scrollbar">
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-400/40 hover:border-violet-400 text-violet-300 text-xs font-bold shadow-lg shadow-violet-500/10 transition group shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Gesture Guide</span>
            <span className="md:hidden">Guide</span>
          </button>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 hover:border-emerald-400 text-emerald-300 text-xs font-bold shadow-lg shadow-emerald-500/10 transition group relative shrink-0"
          >
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
            <span className="hidden md:inline">Activity Logs</span>
            <span className="md:hidden">Logs</span>
            {appState.actionHistory.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[10px] font-bold">
                {appState.actionHistory.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-cyan-400 text-xs font-semibold transition shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Feedback</span>
          </button>

          <button
            onClick={() => executeAction(ACTION_TYPES.OPEN_MENU)}
            className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold transition shrink-0"
          >
            <Menu className="w-4 h-4 text-cyan-400" />
            <span>Actions Menu</span>
            <span className="text-[10px] font-mono text-cyan-400">👌</span>
          </button>

          <div className="flex items-center space-x-1.5 bg-slate-950 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] sm:text-xs font-mono shrink-0">
            <span className="text-slate-500 hidden xs:inline">MODE:</span>
            <span className="font-bold text-cyan-400">{appState.currentState}</span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono shrink-0">
            <span className="text-slate-500">ENGINE:</span>
            <span className={isModelLoading ? 'text-amber-400' : 'text-emerald-400'}>
              {isModelLoading ? 'LOADING...' : 'READY'}
            </span>
          </div>
        </div>
      </header>

      {/* Camera Consent Splash Screen */}
      {!hasStartedCamera ? (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-xl w-full bg-slate-900/85 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl text-center space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-violet-600/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400 shadow-xl shadow-cyan-500/10">
              <Video className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                Ready to interact touch-free?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                GestureFlow uses your webcam to recognize hand gestures locally in your browser. No video or photos are ever sent to a server.
              </p>
            </div>

            <div className="bg-slate-950/70 rounded-2xl p-3.5 sm:p-4 border border-slate-800 text-left space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <Shield className="w-4 h-4 shrink-0" />
                <span>100% Client-Side Privacy Guarantee</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 text-[11px] sm:text-xs">
                <li>Webcam stream stays in browser memory only</li>
                <li>Computer vision & inference run locally via WebAssembly/WebGL</li>
                <li>Photos are stored in your private local IndexedDB</li>
              </ul>
            </div>

            <button
              onClick={handleStartCamera}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 mx-auto"
            >
              <Power className="w-4 h-4" />
              <span>Start Camera &amp; Enter Workspace</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Interactive Workspace */
        <div className="flex-1 p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 max-w-7xl mx-auto w-full">
          {/* Left Column: Camera Feed & Real-Time Gesture HUD (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 flex flex-col">
            <div className="space-y-3 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-3.5 sm:p-4 rounded-3xl shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Webcam Feed</span>
                </span>
                <CameraControls
                  isCameraActive={isCameraActive}
                  onToggleCamera={() => setIsCameraActive(!isCameraActive)}
                  showLandmarks={showLandmarks}
                  onToggleLandmarks={() => setShowLandmarks(!showLandmarks)}
                  onManualCapture={handleManualCapture}
                />
              </div>
              <div className="w-full relative rounded-2xl overflow-hidden flex items-center justify-center">
                <CameraFeed
                  onVideoReady={handleVideoReady}
                  handsData={gestureData.hands}
                  showLandmarks={showLandmarks}
                  isCameraActive={isCameraActive}
                />
              </div>
            </div>

            {/* Gesture Telemetry HUD */}
            <GestureHUD gestureData={gestureData} currentState={appState.currentState} />
          </div>

          {/* Right Column: Photo Canvas Workspace & Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 flex flex-col">
            {/* Main Canvas Viewer */}
            <div className="flex-1 min-h-[260px] sm:min-h-[380px]">
              <CanvasViewer photo={appState.selectedPhoto} currentState={appState.currentState} />
            </div>

            {/* Edit Toolbar (if in EDIT or sub-EDIT state) */}
            {appState.currentState.startsWith('EDIT') && (
              <EditToolbar
                currentState={appState.currentState}
                editToolIndex={appState.editToolIndex}
                onSelectTool={handleSelectEditTool}
              />
            )}

            {/* Photo Gallery Grid */}
            <PhotoGallery
              photos={appState.photos}
              selectedIndex={appState.browseIndex}
              onSelectPhoto={handleSelectPhoto}
              onRequestDelete={handleRequestDelete}
            />
          </div>
        </div>
      )}

      {/* Navigation Menu Modal */}
      {appState.currentState === STATES.MENU && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => stateMachine.transitionTo(STATES.HOME)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <NavigationMenu
              menuOptions={appState.menuOptions}
              selectedIndex={appState.menuIndex}
              onSelectOption={async (idx) => {
                stateMachine.setState(STATES.MENU, { menuIndex: idx });
                await executeAction('MENU_SELECT');
              }}
              onCloseMenu={() => stateMachine.transitionTo(STATES.HOME)}
            />
          </div>
        </div>
      )}

      {/* Confirm Delete Safety Modal */}
      {appState.currentState === STATES.CONFIRM_DELETE && (
        <DeleteConfirmModal
          photo={appState.deleteCandidate}
          onConfirm={async () => await executeAction('EXECUTE_DELETE')}
          onCancel={async () => await executeAction('CANCEL_DELETE')}
        />
      )}

      {/* 3-Second Action Countdown Pop-up Overlay */}
      <ActionCountdownModal gestureData={gestureData} currentState={appState.currentState} />

      {/* Photo Pose Shutter Timer & Camera Flash Overlay */}
      <PhotoPoseShutterModal secondsLeft={poseCountdown} isFlashing={isFlashing} />

      {/* Gesture Controls Reference Menu Modal */}
      <GestureGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        currentState={appState.currentState}
      />

      {/* Activity Logs Terminal Modal */}
      <ActivityLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        history={appState.actionHistory}
        onClearHistory={() => stateMachine.clearHistory()}
      />

      {/* User Feedback Modal */}
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
    </main>
  );
}
