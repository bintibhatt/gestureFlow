'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import CameraFeed from '../../components/Camera/CameraFeed';
import CameraControls from '../../components/Camera/CameraControls';
import GestureHUD from '../../components/Gesture/GestureHUD';
import GestureGuide from '../../components/Gesture/GestureGuide';
import ActionHistory from '../../components/Gesture/ActionHistory';
import CanvasViewer from '../../components/PhotoWorkspace/CanvasViewer';
import PhotoGallery from '../../components/PhotoWorkspace/PhotoGallery';
import EditToolbar from '../../components/PhotoWorkspace/EditToolbar';
import NavigationMenu from '../../components/Menu/NavigationMenu';
import DeleteConfirmModal from '../../components/PhotoWorkspace/DeleteConfirmModal';
import ActionCountdownModal from '../../components/Gesture/ActionCountdownModal';
import PhotoPoseShutterModal from '../../components/Camera/PhotoPoseShutterModal';

import { stateMachine, STATES } from '../../lib/state/machine';
import { loadGestureModel, loadHandDetector } from '../../lib/gesture/modelLoader';
import { GestureEngine } from '../../lib/gesture/engine';
import { getActionForGesture, ACTION_TYPES } from '../../lib/gesture/mapping';
import { executeAction } from '../../lib/actions';
import { getPhotos, savePhoto } from '../../lib/storage/db';
import { captureFrame } from '../../lib/image/processor';
import { Sparkles, Camera, ArrowLeft, Shield, Video, Power } from 'lucide-react';

export default function GestureAppPage() {
  const [appState, setAppState] = useState(stateMachine.getState());
  const [hasStartedCamera, setHasStartedCamera] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
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

  // 3-Second Pose Countdown Callback for Photo Capture
  const triggerPosePhotoCapture = useCallback((videoElement) => {
    if (isPosingRef.current) return;
    isPosingRef.current = true;
    setPoseCountdown(3);

    let currentSeconds = 3;
    const interval = setInterval(() => {
      currentSeconds -= 1;
      if (currentSeconds > 0) {
        setPoseCountdown(currentSeconds);
      } else {
        clearInterval(interval);
        setPoseCountdown(null);
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 500);

        // Perform actual photo snapshot after 3-second pose delay
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
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-100 flex items-center space-x-2">
                <span>GestureFlow Workspace</span>
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  V2 Interactive
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* State Badges */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-500">CONTEXT:</span>
            <span className="font-bold text-cyan-400">{appState.currentState}</span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-500">ENGINE:</span>
            <span className={isModelLoading ? 'text-amber-400' : 'text-emerald-400'}>
              {isModelLoading ? 'LOADING...' : 'READY'}
            </span>
          </div>
        </div>
      </header>

      {/* Camera Consent Splash Screen */}
      {!hasStartedCamera ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-slate-900/85 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-violet-600/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400 shadow-xl shadow-cyan-500/10">
              <Video className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                Ready to interact touch-free?
              </h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                GestureFlow uses your webcam to recognize hand gestures locally in your browser. No video or photos are ever sent to a server.
              </p>
            </div>

            <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 text-left space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <Shield className="w-4 h-4" />
                <span>100% Client-Side Privacy Guarantee</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                <li>Webcam stream stays in browser memory only</li>
                <li>Computer vision & inference run locally via WebAssembly/WebGL</li>
                <li>Photos are stored in your private local IndexedDB</li>
              </ul>
            </div>

            <button
              onClick={handleStartCamera}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 mx-auto"
            >
              <Power className="w-4 h-4" />
              <span>Start Camera &amp; Enter Workspace</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Interactive Workspace */
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
          {/* Left Column: Camera & Gesture Telemetry (5 cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
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
              <div className="h-[280px]">
                <CameraFeed
                  onVideoReady={handleVideoReady}
                  handsData={gestureData.hands}
                  showLandmarks={showLandmarks}
                  isCameraActive={isCameraActive}
                />
              </div>
            </div>

            {/* Gesture HUD */}
            <GestureHUD gestureData={gestureData} currentState={appState.currentState} />

            {/* Action History Log */}
            <ActionHistory history={appState.actionHistory} />
          </div>

          {/* Right Column: Photo Canvas Workspace, Controls & Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col">
            {/* Main Canvas Viewer */}
            <div className="flex-1 min-h-[380px]">
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

            {/* Dynamic Gesture Cheat Sheet */}
            <GestureGuide currentState={appState.currentState} />
          </div>
        </div>
      )}

      {/* Navigation Menu Modal */}
      {appState.currentState === STATES.MENU && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <NavigationMenu
            menuOptions={appState.menuOptions}
            selectedIndex={appState.menuIndex}
            onSelectOption={async (idx) => {
              stateMachine.setState(STATES.MENU, { menuIndex: idx });
              await executeAction('MENU_SELECT');
            }}
          />
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
    </main>
  );
}
