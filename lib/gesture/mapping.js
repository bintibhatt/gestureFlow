import { STATES } from '../state/machine';

export const GESTURE_NAMES = {
  THUMBS_UP: 'thumbs_up',
  THUMBS_DOWN: 'thumbs_down',
  PALM: 'palm',
  OK: 'ok',
  POINT_UP: 'point_up',
  POINT_DOWN: 'point_down',
  PEACE: 'peace',
  FIST: 'fist',
};

export const GESTURE_ICONS = {
  thumbs_up: '👍',
  thumbs_down: '👎',
  palm: '✋',
  ok: '👌',
  point_up: '☝',
  point_down: '👇',
  peace: '✌',
  fist: '✊',
};

export const ACTION_TYPES = {
  // Global / General
  BACK: 'BACK',
  
  // HOME State
  TAKE_PHOTO: 'TAKE_PHOTO',
  SHOW_LATEST: 'SHOW_LATEST',
  CONFIRM_DELETE_LATEST: 'CONFIRM_DELETE_LATEST',
  OPEN_MENU: 'OPEN_MENU',

  // MENU State
  MENU_PREV: 'MENU_PREV',
  MENU_NEXT: 'MENU_NEXT',
  MENU_SELECT: 'MENU_SELECT',

  // BROWSE State
  NEXT_PHOTO: 'NEXT_PHOTO',
  PREV_PHOTO: 'PREV_PHOTO',
  ENTER_EDIT_MODE: 'ENTER_EDIT_MODE',
  CONFIRM_DELETE_SELECTED: 'CONFIRM_DELETE_SELECTED',

  // EDIT Menu (Tool Selection)
  EDIT_TOOL_PREV: 'EDIT_TOOL_PREV',
  EDIT_TOOL_NEXT: 'EDIT_TOOL_NEXT',
  EDIT_TOOL_SELECT: 'EDIT_TOOL_SELECT',

  // Sub-Editing Modes
  INCREASE_BRIGHTNESS: 'INCREASE_BRIGHTNESS',
  DECREASE_BRIGHTNESS: 'DECREASE_BRIGHTNESS',
  INCREASE_CONTRAST: 'INCREASE_CONTRAST',
  DECREASE_CONTRAST: 'DECREASE_CONTRAST',
  TOGGLE_GRAYSCALE: 'TOGGLE_GRAYSCALE',
  ROTATE_CW: 'ROTATE_CW',
  ROTATE_CCW: 'ROTATE_CCW',
  FLIP_HORIZONTAL: 'FLIP_HORIZONTAL',
  FLIP_VERTICAL: 'FLIP_VERTICAL',
  UNDO_EDIT: 'UNDO_EDIT',
  RESET_EDIT: 'RESET_EDIT',

  // CONFIRM_DELETE State
  EXECUTE_DELETE: 'EXECUTE_DELETE',
  CANCEL_DELETE: 'CANCEL_DELETE',
};

export const GESTURE_MAP = {
  [STATES.HOME]: {
    [GESTURE_NAMES.THUMBS_UP]: { action: ACTION_TYPES.TAKE_PHOTO, label: '👍 Take Photo' },
    [GESTURE_NAMES.PALM]: { action: ACTION_TYPES.SHOW_LATEST, label: '✋ Show Latest Photo' },
    [GESTURE_NAMES.THUMBS_DOWN]: { action: ACTION_TYPES.CONFIRM_DELETE_LATEST, label: '👎 Delete Latest' },
    [GESTURE_NAMES.OK]: { action: ACTION_TYPES.OPEN_MENU, label: '👌 Open Menu' },
  },

  [STATES.MENU]: {
    [GESTURE_NAMES.POINT_UP]: { action: ACTION_TYPES.MENU_PREV, label: '☝ Move Up' },
    [GESTURE_NAMES.POINT_DOWN]: { action: ACTION_TYPES.MENU_NEXT, label: '👇 Move Down' },
    [GESTURE_NAMES.OK]: { action: ACTION_TYPES.MENU_SELECT, label: '👌 Select' },
    [GESTURE_NAMES.PALM]: { action: ACTION_TYPES.BACK, label: '✋ Back to Home' },
  },

  [STATES.BROWSE]: {
    [GESTURE_NAMES.POINT_UP]: { action: ACTION_TYPES.NEXT_PHOTO, label: '☝ Next Photo' },
    [GESTURE_NAMES.POINT_DOWN]: { action: ACTION_TYPES.PREV_PHOTO, label: '👇 Previous Photo' },
    [GESTURE_NAMES.OK]: { action: ACTION_TYPES.ENTER_EDIT_MODE, label: '👌 Edit Photo' },
    [GESTURE_NAMES.THUMBS_DOWN]: { action: ACTION_TYPES.CONFIRM_DELETE_SELECTED, label: '👎 Delete Photo' },
    [GESTURE_NAMES.PALM]: { action: ACTION_TYPES.BACK, label: '✋ Back to Home' },
  },

  [STATES.EDIT]: {
    [GESTURE_NAMES.POINT_UP]: { action: ACTION_TYPES.EDIT_TOOL_PREV, label: '☝ Previous Tool' },
    [GESTURE_NAMES.POINT_DOWN]: { action: ACTION_TYPES.EDIT_TOOL_NEXT, label: '👇 Next Tool' },
    [GESTURE_NAMES.OK]: { action: ACTION_TYPES.EDIT_TOOL_SELECT, label: '👌 Select Tool' },
    [GESTURE_NAMES.PALM]: { action: ACTION_TYPES.BACK, label: '✋ Back to Browse' },
  },

  [STATES.EDIT_BRIGHTNESS]: {
    [GESTURE_NAMES.POINT_UP]: { action: ACTION_TYPES.INCREASE_BRIGHTNESS, label: '☝ Increase (+15%)' },
    [GESTURE_NAMES.POINT_DOWN]: { action: ACTION_TYPES.DECREASE_BRIGHTNESS, label: '👇 Decrease (-15%)' },
    [GESTURE_NAMES.PALM]: { action: ACTION_TYPES.BACK, label: '✋ Done / Back' },
  },

  [STATES.EDIT_CONTRAST]: {
    [GESTURE_NAMES.POINT_UP]: { action: ACTION_TYPES.INCREASE_CONTRAST, label: '☝ Increase (+15%)' },
    [GESTURE_NAMES.POINT_DOWN]: { action: ACTION_TYPES.DECREASE_CONTRAST, label: '👇 Decrease (-15%)' },
    [GESTURE_NAMES.PALM]: { action: ACTION_TYPES.BACK, label: '✋ Done / Back' },
  },

  [STATES.EDIT_ROTATE]: {
    [GESTURE_NAMES.POINT_UP]: { action: ACTION_TYPES.ROTATE_CW, label: '☝ Rotate Clockwise (+90°)' },
    [GESTURE_NAMES.POINT_DOWN]: { action: ACTION_TYPES.ROTATE_CCW, label: '👇 Rotate Counter-CW (-90°)' },
    [GESTURE_NAMES.PALM]: { action: ACTION_TYPES.BACK, label: '✋ Done / Back' },
  },

  [STATES.EDIT_FLIP]: {
    [GESTURE_NAMES.POINT_UP]: { action: ACTION_TYPES.FLIP_HORIZONTAL, label: '☝ Flip Horizontal' },
    [GESTURE_NAMES.POINT_DOWN]: { action: ACTION_TYPES.FLIP_VERTICAL, label: '👇 Flip Vertical' },
    [GESTURE_NAMES.PALM]: { action: ACTION_TYPES.BACK, label: '✋ Done / Back' },
  },

  [STATES.CONFIRM_DELETE]: {
    [GESTURE_NAMES.OK]: { action: ACTION_TYPES.EXECUTE_DELETE, label: '👌 Confirm Delete' },
    [GESTURE_NAMES.PALM]: { action: ACTION_TYPES.CANCEL_DELETE, label: '✋ Cancel' },
  },
};

export function getActionForGesture(gesture, currentState) {
  if (!gesture || !currentState) return null;
  const stateMapping = GESTURE_MAP[currentState];
  if (!stateMapping) return null;
  return stateMapping[gesture] || null;
}
