'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, Eye, EyeOff } from 'lucide-react';

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // Index
  [5, 9], [9, 10], [10, 11], [11, 12], // Middle
  [9, 13], [13, 14], [14, 15], [15, 16], // Ring
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
];

export default function CameraFeed({
  onVideoReady,
  handsData = [],
  showLandmarks = true,
  isCameraActive = true,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let currentStream = null;

    async function setupCamera() {
      if (!isCameraActive) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
        return;
      }

      setIsInitializing(true);
      setError(null);

      // Clean up previous stream tracks if any exist
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }

      const constraintOptions = [
        {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        },
        {
          video: {
            facingMode: 'user',
          },
          audio: false,
        },
        {
          video: true,
          audio: false,
        },
      ];

      let acquiredStream = null;
      let lastError = null;

      for (const constraints of constraintOptions) {
        try {
          acquiredStream = await navigator.mediaDevices.getUserMedia(constraints);
          if (acquiredStream) break;
        } catch (err) {
          lastError = err;
          console.warn('[CameraFeed] Constraint set failed, trying fallback:', constraints, err);
        }
      }

      if (acquiredStream) {
        currentStream = acquiredStream;
        if (videoRef.current) {
          const video = videoRef.current;
          video.srcObject = currentStream;

          const handleVideoMetadata = () => {
            if (video.videoWidth && video.videoHeight) {
              video.width = video.videoWidth;
              video.height = video.videoHeight;
            }
            video.play().catch((pErr) => console.warn('[CameraFeed] Video play error:', pErr));
            setIsInitializing(false);
            if (onVideoReady) {
              onVideoReady(video);
            }
          };

          video.onloadeddata = () => {
            if (video.videoWidth && video.videoHeight) {
              video.width = video.videoWidth;
              video.height = video.videoHeight;
            }
          };

          if (video.readyState >= 1) {
            handleVideoMetadata();
          } else {
            video.onloadedmetadata = handleVideoMetadata;
          }
        }
        setStream(currentStream);
      } else if (lastError) {
        console.error('[CameraFeed] All getUserMedia constraints failed:', lastError);
        let errorMsg = 'Failed to access camera.';
        if (lastError.name === 'NotReadableError' || lastError.message?.includes('start video source')) {
          errorMsg = 'Webcam is currently locked or in use by another app (e.g. Zoom, Teams, Discord, OBS, or another tab). Close other camera applications and retry.';
        } else if (lastError.name === 'NotAllowedError' || lastError.name === 'PermissionDeniedError') {
          errorMsg = 'Camera permission denied. Please allow camera permissions in your browser address bar and retry.';
        } else if (lastError.name === 'NotFoundError' || lastError.name === 'DevicesNotFoundError') {
          errorMsg = 'No webcam hardware found on your device. Please attach a camera and retry.';
        } else if (lastError.name === 'OverconstrainedError') {
          errorMsg = 'Requested camera resolution is not supported by your device.';
        } else {
          errorMsg = lastError.message || errorMsg;
        }
        setError(errorMsg);
        setIsInitializing(false);
      }
    }

    setupCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraActive, retryCount]);

  // Render Hand Skeleton & Landmarks on Overlay Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!showLandmarks || !handsData || handsData.length === 0) return;

    handsData.forEach((hand) => {
      const keypoints = hand.keypoints;
      if (!keypoints || keypoints.length === 0) return;

      // Draw skeleton lines
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)'; // Neon Cyan

      HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
        const p1 = keypoints[startIdx];
        const p2 = keypoints[endIdx];
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // Draw keypoints nodes
      keypoints.forEach((kp, idx) => {
        ctx.beginPath();
        const radius = idx % 4 === 0 ? 5 : 3;
        ctx.arc(kp.x, kp.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = idx % 4 === 0 ? '#ec4899' : '#06b6d4'; // Pink tips, Cyan joints
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });
  }, [handsData, showLandmarks]);

  return (
    <div className="relative w-full h-full min-h-[300px] bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group">
      {error ? (
        <div className="text-center p-6 space-y-3 max-w-md">
          <CameraOff className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
          <p className="text-rose-400 font-medium text-xs leading-relaxed">{error}</p>
          <div className="flex items-center justify-center space-x-2 pt-2">
            <button
              onClick={() => setRetryCount((prev) => prev + 1)}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Camera</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      ) : isInitializing ? (
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-slate-400 text-xs font-medium tracking-wide">Initializing Camera Feed...</p>
        </div>
      ) : null}

      <video
        ref={videoRef}
        playsInline
        muted
        className={`w-full h-full object-cover transform -scale-x-100 ${
          isInitializing || error ? 'hidden' : 'block'
        }`}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100"
      />

      {/* Live Badge Overlay */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-md border border-slate-800 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-emerald-400 tracking-wider uppercase text-[10px]">LIVE FEED</span>
      </div>
    </div>
  );
}
