/**
 * Image processing utilities for canvas operations, transforms, filters, and camera frame captures.
 */

export const DEFAULT_FILTERS = {
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  invert: 0,
  blur: 0,
};

export const DEFAULT_TRANSFORMS = {
  rotation: 0, // 0, 90, 180, 270 degrees
  flipH: false,
  flipV: false,
};

export function captureFrame(videoElement) {
  if (!videoElement || videoElement.readyState < 2) {
    return null;
  }

  const canvas = document.createElement('canvas');
  const width = videoElement.videoWidth || 640;
  const height = videoElement.videoHeight || 480;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  // Mirror horizontally so snapshot matches what user saw on screen
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(videoElement, 0, 0, width, height);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

  return {
    id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    originalDataUrl: dataUrl,
    currentDataUrl: dataUrl,
    name: `Snapshot ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
    width,
    height,
    timestamp: new Date().toISOString(),
    filters: { ...DEFAULT_FILTERS },
    transforms: { ...DEFAULT_TRANSFORMS },
    historyStack: [], // edit state snapshots for Undo
  };
}

/**
 * Render filtered and transformed image onto an HTML5 Canvas element
 */
export function renderTransformedImage(canvas, imageElement, filters = DEFAULT_FILTERS, transforms = DEFAULT_TRANSFORMS) {
  if (!canvas || !imageElement) return;

  const ctx = canvas.getContext('2d');
  const origW = imageElement.naturalWidth || imageElement.width || 640;
  const origH = imageElement.naturalHeight || imageElement.height || 480;

  const { rotation = 0, flipH = false, flipV = false } = transforms || {};
  const isPerpendicular = rotation === 90 || rotation === 270;

  // Swap canvas dimensions if rotated 90 or 270 deg
  canvas.width = isPerpendicular ? origH : origW;
  canvas.height = isPerpendicular ? origW : origH;

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply CSS Filters
  const { brightness = 100, contrast = 100, grayscale = 0, invert = 0, blur = 0 } = filters || {};
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) invert(${invert}%) blur(${blur}px)`;

  // Move origin to center of canvas for transforms
  ctx.translate(canvas.width / 2, canvas.height / 2);

  // Rotation
  ctx.rotate((rotation * Math.PI) / 180);

  // Flipping
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  // Draw image centered
  ctx.drawImage(imageElement, -origW / 2, -origH / 2, origW, origH);

  ctx.restore();
}

/**
 * Creates a clone of current photo state for the Undo stack
 */
export function createEditSnapshot(photo) {
  return {
    filters: { ...(photo.filters || DEFAULT_FILTERS) },
    transforms: { ...(photo.transforms || DEFAULT_TRANSFORMS) },
  };
}

/**
 * Apply non-destructive adjustments to photo
 */
export function modifyPhotoState(photo, actionType, payload = {}) {
  if (!photo) return null;

  // Push current state to undo stack before editing
  const currentSnapshot = createEditSnapshot(photo);
  const updatedHistory = [...(photo.historyStack || []), currentSnapshot].slice(-15); // keep last 15 undos

  let updatedFilters = { ...(photo.filters || DEFAULT_FILTERS) };
  let updatedTransforms = { ...(photo.transforms || DEFAULT_TRANSFORMS) };

  switch (actionType) {
    case 'BRIGHTNESS': {
      const delta = payload.delta || 15;
      updatedFilters.brightness = Math.min(220, Math.max(30, updatedFilters.brightness + delta));
      break;
    }
    case 'CONTRAST': {
      const delta = payload.delta || 15;
      updatedFilters.contrast = Math.min(220, Math.max(30, updatedFilters.contrast + delta));
      break;
    }
    case 'GRAYSCALE': {
      updatedFilters.grayscale = updatedFilters.grayscale > 0 ? 0 : 100;
      break;
    }
    case 'ROTATE_CW': {
      updatedTransforms.rotation = (updatedTransforms.rotation + 90) % 360;
      break;
    }
    case 'ROTATE_CCW': {
      updatedTransforms.rotation = (updatedTransforms.rotation + 270) % 360;
      break;
    }
    case 'FLIP_H': {
      updatedTransforms.flipH = !updatedTransforms.flipH;
      break;
    }
    case 'FLIP_V': {
      updatedTransforms.flipV = !updatedTransforms.flipV;
      break;
    }
    case 'UNDO': {
      if (photo.historyStack && photo.historyStack.length > 0) {
        const lastState = photo.historyStack[photo.historyStack.length - 1];
        const newStack = photo.historyStack.slice(0, -1);
        return {
          ...photo,
          filters: { ...lastState.filters },
          transforms: { ...lastState.transforms },
          historyStack: newStack,
        };
      }
      return photo;
    }
    case 'RESET': {
      return {
        ...photo,
        filters: { ...DEFAULT_FILTERS },
        transforms: { ...DEFAULT_TRANSFORMS },
        historyStack: [],
      };
    }
    default:
      return photo;
  }

  return {
    ...photo,
    filters: updatedFilters,
    transforms: updatedTransforms,
    historyStack: updatedHistory,
  };
}
