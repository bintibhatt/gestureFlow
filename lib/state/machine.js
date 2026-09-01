/**
 * Central State Machine for GestureFlow contexts.
 * Contexts: HOME, MENU, BROWSE, EDIT, EDIT_BRIGHTNESS, EDIT_CONTRAST, EDIT_ROTATE, EDIT_FLIP, CONFIRM_DELETE
 */

export const STATES = {
  HOME: 'HOME',
  MENU: 'MENU',
  BROWSE: 'BROWSE',
  EDIT: 'EDIT',
  EDIT_BRIGHTNESS: 'EDIT_BRIGHTNESS',
  EDIT_CONTRAST: 'EDIT_CONTRAST',
  EDIT_ROTATE: 'EDIT_ROTATE',
  EDIT_FLIP: 'EDIT_FLIP',
  CONFIRM_DELETE: 'CONFIRM_DELETE',
};

export const MENU_OPTIONS = [
  'Browse Photos',
  'Edit Photo',
  'Take New Photo',
  'Clear All Photos',
];

export const EDIT_TOOLS = [
  'Brightness',
  'Contrast',
  'Grayscale',
  'Rotate (90°)',
  'Flip',
  'Undo',
  'Reset All',
];

class StateMachine {
  constructor() {
    this.state = STATES.HOME;
    this.previousState = STATES.HOME;
    this.selectedPhoto = null;
    this.photos = [];
    this.browseIndex = 0;
    this.menuIndex = 0;
    this.editToolIndex = 0;
    this.menuOptions = MENU_OPTIONS;
    this.editTools = EDIT_TOOLS;
    this.deleteCandidate = null; // Photo marked for delete confirmation
    this.deleteContext = 'HOME'; // Origin of deletion request
    this.actionHistory = [];
    this.listeners = new Set();
  }

  getState() {
    return {
      currentState: this.state,
      previousState: this.previousState,
      selectedPhoto: this.selectedPhoto,
      photos: this.photos,
      browseIndex: this.browseIndex,
      menuIndex: this.menuIndex,
      editToolIndex: this.editToolIndex,
      menuOptions: this.menuOptions,
      editTools: this.editTools,
      deleteCandidate: this.deleteCandidate,
      deleteContext: this.deleteContext,
      actionHistory: this.actionHistory,
    };
  }

  setState(newState, payload = {}) {
    if (Object.values(STATES).includes(newState)) {
      if (this.state !== newState) {
        this.previousState = this.state;
        this.state = newState;
      }
    }
    if (payload.selectedPhoto !== undefined) this.selectedPhoto = payload.selectedPhoto;
    if (payload.photos !== undefined) this.photos = payload.photos;
    if (payload.browseIndex !== undefined) this.browseIndex = payload.browseIndex;
    if (payload.menuIndex !== undefined) this.menuIndex = payload.menuIndex;
    if (payload.editToolIndex !== undefined) this.editToolIndex = payload.editToolIndex;
    if (payload.deleteCandidate !== undefined) this.deleteCandidate = payload.deleteCandidate;
    if (payload.deleteContext !== undefined) this.deleteContext = payload.deleteContext;
    
    this.notify();
  }

  transitionTo(newState, payload = {}) {
    console.log(`[StateMachine] Transition: ${this.state} -> ${newState}`, payload);
    this.setState(newState, payload);
  }

  logAction(gesture, actionName, context) {
    const entry = {
      id: Date.now() + Math.random(),
      gesture,
      action: actionName,
      context: context || this.state,
      timestamp: new Date().toLocaleTimeString(),
    };
    this.actionHistory = [entry, ...this.actionHistory.slice(0, 24)]; // Keep last 25
    this.notify();
  }

  clearHistory() {
    this.actionHistory = [];
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => listener(currentState));
  }
}

export const stateMachine = new StateMachine();
