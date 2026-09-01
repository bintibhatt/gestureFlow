import * as tf from '@tensorflow/tfjs';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

let gestureModel = null;
let handDetector = null;

export async function loadGestureModel() {
  if (gestureModel) return gestureModel;

  try {
    await tf.ready();
    console.log('[ModelLoader] Loading custom gesture model from /models/gesture_model/model.json...');
    gestureModel = await tf.loadLayersModel('/models/gesture_model/model.json');
    console.log('[ModelLoader] Custom gesture model loaded successfully.');
    return gestureModel;
  } catch (err) {
    console.error('[ModelLoader] Failed to load custom gesture model:', err);
    return null;
  }
}

export async function loadHandDetector() {
  if (handDetector) return handDetector;

  try {
    await tf.ready();
    console.log('[ModelLoader] Initializing MediaPipe Hand Detector (Local WASM /mediapipe/hands)...');

    // Attach global Hands reference if needed by detector factory
    if (typeof window !== 'undefined' && window.Hands && !window.exports?.Hands) {
      console.log('[ModelLoader] Using global window.Hands for MediaPipe detector.');
    }

    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
      runtime: 'mediapipe',
      solutionPath: '/mediapipe/hands',
      modelType: 'full',
      maxHands: 2,
    };
    handDetector = await handPoseDetection.createDetector(model, detectorConfig);
    console.log('[ModelLoader] Hand detector initialized successfully via MediaPipe Local WASM.');
    return handDetector;
  } catch (err) {
    console.warn('[ModelLoader] MediaPipe WASM runtime initialization failed, attempting TFJS runtime fallback:', err);
    try {
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = {
        runtime: 'tfjs',
        modelType: 'full',
        maxHands: 2,
      };
      handDetector = await handPoseDetection.createDetector(model, detectorConfig);
      console.log('[ModelLoader] Hand detector initialized via TFJS runtime fallback.');
      return handDetector;
    } catch (fallbackErr) {
      console.error('[ModelLoader] Failed to initialize hand detector:', fallbackErr);
      return null;
    }
  }
}
