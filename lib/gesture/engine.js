import * as tf from '@tensorflow/tfjs';
import { GESTURE_NAMES } from './mapping';

const ACTION_CLASSES = ['thumbsup', 'thumbsdown', 'peace', 'palm', 'fist', 'ok', 'point_up', 'point_down'];
const SEQUENCE_LENGTH = 30;
const PREDICTION_THRESHOLD = 0.70;
const COOLDOWN_MS = 1500;
const STABILITY_FRAMES_REQUIRED = 3;
const HOLD_CONFIRMATION_MS = 2000;

export const GESTURE_STATES = {
  NO_HAND: 'NO_HAND',
  NEUTRAL: 'NEUTRAL',
  GESTURE_DETECTED: 'GESTURE_DETECTED',
  CONFIRMED: 'CONFIRMED',
  EXECUTING: 'EXECUTING',
  COOLDOWN: 'COOLDOWN',
};

export class GestureEngine {
  constructor(gestureModel, handDetector) {
    this.gestureModel = gestureModel;
    this.handDetector = handDetector;
    this.keypointBuffer = [];
    this.predictionHistory = [];
    this.lastTriggerTime = 0;
    this.pendingGesture = null;
    this.holdStartTime = 0;
    this.isProcessing = false;
    this.lifecycleState = GESTURE_STATES.NO_HAND;
    this.listeners = new Set();
  }

  onGesture(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach((callback) => callback(data));
  }

  /**
   * Process a single video frame for hand landmarks and gesture prediction.
   */
  async processFrame(videoElement) {
    if (this.isProcessing || !videoElement || videoElement.readyState < 2) {
      return null;
    }

    // Ensure valid width and height attributes on video DOM node for detector engines
    if (videoElement.videoWidth && videoElement.videoHeight) {
      if (videoElement.width !== videoElement.videoWidth || videoElement.height !== videoElement.videoHeight) {
        videoElement.width = videoElement.videoWidth;
        videoElement.height = videoElement.videoHeight;
      }
    }

    this.isProcessing = true;
    let detectedGesture = null;
    let confidence = 0;
    let hands = [];

    try {
      if (this.handDetector) {
        hands = await this.handDetector.estimateHands(videoElement, {
          flipHorizontal: false,
        });
      }

      const now = Date.now();
      const isCoolingDown = now - this.lastTriggerTime < COOLDOWN_MS;

      if (!hands || hands.length === 0) {
        this.keypointBuffer = [];
        this.predictionHistory = [];
        this.pendingGesture = null;
        this.holdStartTime = 0;
        this.lifecycleState = GESTURE_STATES.NO_HAND;
        
        const result = {
          gesture: null,
          confidence: 0,
          triggeredGesture: null,
          pendingGesture: null,
          countdownProgress: 0,
          countdownSeconds: 2,
          hands: [],
          lifecycleState: GESTURE_STATES.NO_HAND,
          cooldownProgress: Math.min(1, (now - this.lastTriggerTime) / COOLDOWN_MS),
        };
        this.notifyListeners(result);
        return result;
      }

      // 1. Extract and buffer keypoints
      const keypoints = this.extractKeypoints(hands, videoElement);
      this.keypointBuffer.push(keypoints);
      if (this.keypointBuffer.length > SEQUENCE_LENGTH) {
        this.keypointBuffer.shift();
      }

      // 2. Rule-based Heuristic Analysis for all 8 gestures
      const primaryHand = hands[0];
      const ruleBased = this.detectRuleBasedGesture(primaryHand);
      if (ruleBased) {
        detectedGesture = ruleBased.gesture;
        confidence = ruleBased.confidence;
      }

      // 3. Fallback to LSTM TF Model for trained classes if 30-frame sequence is ready
      if (!detectedGesture && this.gestureModel && this.keypointBuffer.length === SEQUENCE_LENGTH) {
        try {
          const inputTensor = tf.tensor3d([this.keypointBuffer]);
          const prediction = this.gestureModel.predict(inputTensor);
          const probabilities = await prediction.data();
          inputTensor.dispose();
          prediction.dispose();

          const maxIndex = probabilities.indexOf(Math.max(...probabilities));
          const maxProb = probabilities[maxIndex];

          if (maxProb > PREDICTION_THRESHOLD) {
            const rawClass = ACTION_CLASSES[maxIndex];
            if (rawClass === 'thumbsup') detectedGesture = GESTURE_NAMES.THUMBS_UP;
            else if (rawClass === 'thumbsdown') detectedGesture = GESTURE_NAMES.THUMBS_DOWN;
            else if (rawClass === 'peace') detectedGesture = GESTURE_NAMES.PEACE;
            else if (rawClass === 'palm') detectedGesture = GESTURE_NAMES.PALM;
            else if (rawClass === 'fist') detectedGesture = GESTURE_NAMES.FIST;
            else if (rawClass === 'ok') detectedGesture = GESTURE_NAMES.OK;
            else if (rawClass === 'point_up') detectedGesture = GESTURE_NAMES.POINT_UP;
            else if (rawClass === 'point_down') detectedGesture = GESTURE_NAMES.POINT_DOWN;
            confidence = maxProb;
          }
        } catch (modelErr) {
          // Keep rule-based output
        }
      }

      // 4. Temporal Stability, 2-Second Hold Countdown & State Progression
      let triggerAction = null;
      let countdownProgress = 0;
      let countdownSeconds = 2;

      if (!detectedGesture || isCoolingDown) {
        this.pendingGesture = null;
        this.holdStartTime = 0;
        this.predictionHistory = [];
        this.lifecycleState = isCoolingDown ? GESTURE_STATES.COOLDOWN : GESTURE_STATES.NEUTRAL;
      } else {
        this.predictionHistory.push(detectedGesture);
        if (this.predictionHistory.length > 6) {
          this.predictionHistory.shift();
        }

        const counts = {};
        this.predictionHistory.forEach((g) => {
          counts[g] = (counts[g] || 0) + 1;
        });
        const mostFrequent = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));

        if (counts[mostFrequent] >= STABILITY_FRAMES_REQUIRED) {
          if (this.pendingGesture !== mostFrequent) {
            this.pendingGesture = mostFrequent;
            this.holdStartTime = now;
          }

          const elapsed = now - this.holdStartTime;
          countdownProgress = Math.min(1, elapsed / HOLD_CONFIRMATION_MS);
          const remainingMs = Math.max(0, HOLD_CONFIRMATION_MS - elapsed);
          countdownSeconds = Math.max(1, Math.ceil(remainingMs / 1000));

          if (elapsed >= HOLD_CONFIRMATION_MS) {
            this.lifecycleState = GESTURE_STATES.CONFIRMED;
            triggerAction = mostFrequent;
            this.lastTriggerTime = now;
            this.pendingGesture = null;
            this.holdStartTime = 0;
            this.predictionHistory = [];
            countdownProgress = 1.0;
            countdownSeconds = 0;
          } else {
            this.lifecycleState = GESTURE_STATES.GESTURE_DETECTED;
          }
        } else {
          this.pendingGesture = null;
          this.holdStartTime = 0;
          this.lifecycleState = GESTURE_STATES.GESTURE_DETECTED;
        }
      }

      const result = {
        gesture: detectedGesture,
        confidence,
        triggeredGesture: triggerAction,
        pendingGesture: this.pendingGesture,
        countdownProgress,
        countdownSeconds,
        hands,
        lifecycleState: this.lifecycleState,
        cooldownProgress: Math.min(1, (now - this.lastTriggerTime) / COOLDOWN_MS),
      };

      this.notifyListeners(result);
      return result;
    } catch (err) {
      console.error('[GestureEngine] Error processing frame:', err);
      return null;
    } finally {
      this.isProcessing = false;
    }
  }

  extractKeypoints(hands, videoElement) {
    const keypoints = [];
    const vw = videoElement ? videoElement.videoWidth || 640 : 640;
    const vh = videoElement ? videoElement.videoHeight || 480 : 480;

    // Helper to normalize keypoints 0.0 to 1.0
    const addNormalizedKeypoints = (hand) => {
      if (!hand || !hand.keypoints) {
        for (let i = 0; i < 63; i++) keypoints.push(0);
        return;
      }
      hand.keypoints.forEach((kp) => {
        const nx = kp.x / vw;
        const ny = kp.y / vh;
        const nz = kp.z ? kp.z / vw : 0;
        keypoints.push(nx, ny, nz);
      });
    };

    addNormalizedKeypoints(hands[0]);
    addNormalizedKeypoints(hands[1]);

    return keypoints;
  }

  detectRuleBasedGesture(hand) {
    if (!hand || !hand.keypoints) return null;

    const kp = hand.keypoints;
    if (kp.length < 21) return null;

    // Helper: 2D Euclidean distance
    const dist = (i, j) => Math.hypot(kp[i].x - kp[j].x, kp[i].y - kp[j].y);

    // Palm scale normalization (wrist 0 to middle MCP 9 distance)
    const palmScale = Math.max(10, dist(0, 9));
    const wrist = kp[0];

    // Robust extension check: Tip-to-Wrist vs MCP-to-Wrist & Tip-to-MCP distance
    const isIndexExtended = dist(8, 0) > dist(5, 0) * 1.18 || dist(8, 5) > palmScale * 0.65;
    const isMiddleExtended = dist(12, 0) > dist(9, 0) * 1.18 || dist(12, 9) > palmScale * 0.65;
    const isRingExtended = dist(16, 0) > dist(13, 0) * 1.18 || dist(16, 13) > palmScale * 0.65;
    const isPinkyExtended = dist(20, 0) > dist(17, 0) * 1.15 || dist(20, 17) > palmScale * 0.55;

    // Thumb extension & orientation
    const thumbDistToPinky = dist(4, 17) / palmScale;
    const isThumbOpen = thumbDistToPinky > 0.85;

    // Thumb direction relative to palm (canvas y=0 is top, y=max is bottom)
    const isThumbUp = kp[4].y < kp[2].y && kp[4].y < kp[1].y;
    const isThumbDown = kp[4].y > kp[2].y && kp[4].y > kp[1].y;

    const extendedFingers = [isIndexExtended, isMiddleExtended, isRingExtended, isPinkyExtended];
    const extendedFingersCount = extendedFingers.filter(Boolean).length;

    // 1. OK Gesture (👌): Thumb tip (4) & Index tip (8) pinched close, middle/ring/pinky open
    const thumbIndexPinchDist = dist(4, 8) / palmScale;
    if (thumbIndexPinchDist < 0.50 && (isMiddleExtended || isRingExtended || isPinkyExtended)) {
      return { gesture: GESTURE_NAMES.OK, confidence: 0.96 };
    }

    // 2. Peace / V-Sign (✌): Index and Middle extended, Ring and Pinky folded
    if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      return { gesture: GESTURE_NAMES.PEACE, confidence: 0.96 };
    }

    // 3. Point Up (☝): Index extended pointing UP, others folded
    if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended && kp[8].y < kp[5].y) {
      return { gesture: GESTURE_NAMES.POINT_UP, confidence: 0.95 };
    }

    // 4. Point Down (👇): Index extended pointing DOWN, others folded
    if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended && kp[8].y > kp[5].y) {
      return { gesture: GESTURE_NAMES.POINT_DOWN, confidence: 0.94 };
    }

    // 5. Thumbs Up (👍): Thumb up, 4 fingers folded into palm
    if (isThumbUp && extendedFingersCount <= 1 && !isIndexExtended && !isMiddleExtended) {
      return { gesture: GESTURE_NAMES.THUMBS_UP, confidence: 0.95 };
    }

    // 6. Thumbs Down (👎): Thumb down, 4 fingers folded into palm
    if (isThumbDown && extendedFingersCount <= 1 && !isIndexExtended && !isMiddleExtended) {
      return { gesture: GESTURE_NAMES.THUMBS_DOWN, confidence: 0.95 };
    }

    // 7. Open Palm (✋): 3 or 4 fingers extended
    if (extendedFingersCount >= 3) {
      return { gesture: GESTURE_NAMES.PALM, confidence: 0.96 };
    }

    // 8. Fist (✊): All 4 fingers folded close to palm MCPs
    const isIndexCurled = dist(8, 5) < palmScale * 0.55;
    const isMiddleCurled = dist(12, 9) < palmScale * 0.55;
    if (extendedFingersCount === 0 && isIndexCurled && isMiddleCurled && !isThumbUp && !isThumbDown) {
      return { gesture: GESTURE_NAMES.FIST, confidence: 0.94 };
    }

    return null;
  }
}
