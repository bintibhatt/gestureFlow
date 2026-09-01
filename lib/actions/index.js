import { ACTION_TYPES } from '../gesture/mapping';
import { stateMachine, STATES } from '../state/machine';
import { savePhoto, getPhotos, getLatestPhoto, deletePhoto, updatePhoto, clearAllPhotos } from '../storage/db';
import { captureFrame, modifyPhotoState } from '../image/processor';

export async function executeAction(actionType, context = {}) {
  const { videoElement } = context;
  const currentMachineState = stateMachine.getState();
  const {
    currentState,
    photos,
    browseIndex,
    menuIndex,
    menuOptions,
    editToolIndex,
    editTools,
    selectedPhoto,
    deleteCandidate,
    deleteContext,
  } = currentMachineState;

  console.log(`[ActionExecutor] Executing: ${actionType} in context: ${currentState}`);

  switch (actionType) {
    // ----------------------------------------------------
    // HOME ACTIONS
    // ----------------------------------------------------
    case ACTION_TYPES.TAKE_PHOTO: {
      if (!videoElement) {
        console.warn('[ActionExecutor] No video element available for TAKE_PHOTO');
        return;
      }
      const captured = captureFrame(videoElement);
      if (captured) {
        const saved = await savePhoto(captured);
        const updatedPhotos = await getPhotos();
        stateMachine.setState(currentState, {
          photos: updatedPhotos,
          selectedPhoto: saved,
          browseIndex: 0,
        });
        stateMachine.logAction('👍', 'Captured Photo', currentState);
      }
      break;
    }

    case ACTION_TYPES.SHOW_LATEST: {
      const allPhotos = await getPhotos();
      if (allPhotos.length > 0) {
        stateMachine.transitionTo(STATES.BROWSE, {
          photos: allPhotos,
          browseIndex: 0,
          selectedPhoto: allPhotos[0],
        });
        stateMachine.logAction('✋', 'Showing Latest Photo', currentState);
      } else {
        console.log('[ActionExecutor] No photos saved in gallery yet.');
      }
      break;
    }

    case ACTION_TYPES.CONFIRM_DELETE_LATEST: {
      const latest = await getLatestPhoto();
      if (latest) {
        stateMachine.transitionTo(STATES.CONFIRM_DELETE, {
          deleteCandidate: latest,
          deleteContext: STATES.HOME,
        });
        stateMachine.logAction('👎', 'Requested Delete (Latest)', currentState);
      }
      break;
    }

    case ACTION_TYPES.OPEN_MENU: {
      stateMachine.transitionTo(STATES.MENU, { menuIndex: 0 });
      stateMachine.logAction('👌', 'Opened Menu', currentState);
      break;
    }

    // ----------------------------------------------------
    // MENU ACTIONS
    // ----------------------------------------------------
    case ACTION_TYPES.MENU_PREV: {
      const prevIdx = (menuIndex - 1 + menuOptions.length) % menuOptions.length;
      stateMachine.setState(STATES.MENU, { menuIndex: prevIdx });
      stateMachine.logAction('☝', `Navigated to ${menuOptions[prevIdx]}`, currentState);
      break;
    }

    case ACTION_TYPES.MENU_NEXT: {
      const nextIdx = (menuIndex + 1) % menuOptions.length;
      stateMachine.setState(STATES.MENU, { menuIndex: nextIdx });
      stateMachine.logAction('👇', `Navigated to ${menuOptions[nextIdx]}`, currentState);
      break;
    }

    case ACTION_TYPES.MENU_SELECT: {
      const selectedOption = menuOptions[menuIndex];
      stateMachine.logAction('👌', `Selected "${selectedOption}"`, currentState);

      if (menuIndex === 0) {
        // Browse Photos
        const allPhotos = await getPhotos();
        stateMachine.transitionTo(STATES.BROWSE, {
          photos: allPhotos,
          browseIndex: 0,
          selectedPhoto: allPhotos[0] || null,
        });
      } else if (menuIndex === 1) {
        // Edit Photo
        const allPhotos = await getPhotos();
        const photoToEdit = selectedPhoto || allPhotos[0] || null;
        if (photoToEdit) {
          stateMachine.transitionTo(STATES.EDIT, {
            selectedPhoto: photoToEdit,
            editToolIndex: 0,
          });
        } else {
          stateMachine.transitionTo(STATES.HOME);
        }
      } else if (menuIndex === 2) {
        // Take New Photo
        stateMachine.transitionTo(STATES.HOME);
      } else if (menuIndex === 3) {
        // Clear All Photos
        await clearAllPhotos();
        stateMachine.transitionTo(STATES.HOME, {
          photos: [],
          selectedPhoto: null,
          browseIndex: 0,
        });
      }
      break;
    }

    // ----------------------------------------------------
    // BROWSE ACTIONS
    // ----------------------------------------------------
    case ACTION_TYPES.NEXT_PHOTO: {
      if (photos.length > 0) {
        const nextBrowseIdx = (browseIndex + 1) % photos.length;
        stateMachine.setState(STATES.BROWSE, {
          browseIndex: nextBrowseIdx,
          selectedPhoto: photos[nextBrowseIdx],
        });
        stateMachine.logAction('☝', `Next Photo (${nextBrowseIdx + 1}/${photos.length})`, currentState);
      }
      break;
    }

    case ACTION_TYPES.PREV_PHOTO: {
      if (photos.length > 0) {
        const prevBrowseIdx = (browseIndex - 1 + photos.length) % photos.length;
        stateMachine.setState(STATES.BROWSE, {
          browseIndex: prevBrowseIdx,
          selectedPhoto: photos[prevBrowseIdx],
        });
        stateMachine.logAction('👇', `Previous Photo (${prevBrowseIdx + 1}/${photos.length})`, currentState);
      }
      break;
    }

    case ACTION_TYPES.ENTER_EDIT_MODE: {
      if (selectedPhoto) {
        stateMachine.transitionTo(STATES.EDIT, { editToolIndex: 0 });
        stateMachine.logAction('👌', 'Entered Photo Editor', currentState);
      }
      break;
    }

    case ACTION_TYPES.CONFIRM_DELETE_SELECTED: {
      if (selectedPhoto) {
        stateMachine.transitionTo(STATES.CONFIRM_DELETE, {
          deleteCandidate: selectedPhoto,
          deleteContext: STATES.BROWSE,
        });
        stateMachine.logAction('👎', 'Requested Delete (Current Photo)', currentState);
      }
      break;
    }

    // ----------------------------------------------------
    // EDIT MENU ACTIONS
    // ----------------------------------------------------
    case ACTION_TYPES.EDIT_TOOL_PREV: {
      const prevToolIdx = (editToolIndex - 1 + editTools.length) % editTools.length;
      stateMachine.setState(STATES.EDIT, { editToolIndex: prevToolIdx });
      stateMachine.logAction('☝', `Tool: ${editTools[prevToolIdx]}`, currentState);
      break;
    }

    case ACTION_TYPES.EDIT_TOOL_NEXT: {
      const nextToolIdx = (editToolIndex + 1) % editTools.length;
      stateMachine.setState(STATES.EDIT, { editToolIndex: nextToolIdx });
      stateMachine.logAction('👇', `Tool: ${editTools[nextToolIdx]}`, currentState);
      break;
    }

    case ACTION_TYPES.EDIT_TOOL_SELECT: {
      const tool = editTools[editToolIndex];
      stateMachine.logAction('👌', `Selected Tool: ${tool}`, currentState);

      if (tool === 'Brightness') {
        stateMachine.transitionTo(STATES.EDIT_BRIGHTNESS);
      } else if (tool === 'Contrast') {
        stateMachine.transitionTo(STATES.EDIT_CONTRAST);
      } else if (tool === 'Grayscale') {
        if (selectedPhoto) {
          const updated = modifyPhotoState(selectedPhoto, 'GRAYSCALE');
          await updatePhoto(updated);
          const allPhotos = await getPhotos();
          stateMachine.setState(STATES.EDIT, { selectedPhoto: updated, photos: allPhotos });
          stateMachine.logAction('👌', 'Toggled Grayscale', currentState);
        }
      } else if (tool === 'Rotate (90°)') {
        stateMachine.transitionTo(STATES.EDIT_ROTATE);
      } else if (tool === 'Flip') {
        stateMachine.transitionTo(STATES.EDIT_FLIP);
      } else if (tool === 'Undo') {
        if (selectedPhoto) {
          const updated = modifyPhotoState(selectedPhoto, 'UNDO');
          await updatePhoto(updated);
          const allPhotos = await getPhotos();
          stateMachine.setState(STATES.EDIT, { selectedPhoto: updated, photos: allPhotos });
          stateMachine.logAction('👌', 'Undid Edit Operation', currentState);
        }
      } else if (tool === 'Reset All') {
        if (selectedPhoto) {
          const updated = modifyPhotoState(selectedPhoto, 'RESET');
          await updatePhoto(updated);
          const allPhotos = await getPhotos();
          stateMachine.setState(STATES.EDIT, { selectedPhoto: updated, photos: allPhotos });
          stateMachine.logAction('👌', 'Reset All Edits', currentState);
        }
      }
      break;
    }

    // ----------------------------------------------------
    // SUB-EDITING ACTIONS
    // ----------------------------------------------------
    case ACTION_TYPES.INCREASE_BRIGHTNESS: {
      if (selectedPhoto) {
        const updated = modifyPhotoState(selectedPhoto, 'BRIGHTNESS', { delta: 15 });
        await updatePhoto(updated);
        const allPhotos = await getPhotos();
        stateMachine.setState(currentState, { selectedPhoto: updated, photos: allPhotos });
        stateMachine.logAction('☝', `Brightness: ${updated.filters.brightness}%`, currentState);
      }
      break;
    }

    case ACTION_TYPES.DECREASE_BRIGHTNESS: {
      if (selectedPhoto) {
        const updated = modifyPhotoState(selectedPhoto, 'BRIGHTNESS', { delta: -15 });
        await updatePhoto(updated);
        const allPhotos = await getPhotos();
        stateMachine.setState(currentState, { selectedPhoto: updated, photos: allPhotos });
        stateMachine.logAction('👇', `Brightness: ${updated.filters.brightness}%`, currentState);
      }
      break;
    }

    case ACTION_TYPES.INCREASE_CONTRAST: {
      if (selectedPhoto) {
        const updated = modifyPhotoState(selectedPhoto, 'CONTRAST', { delta: 15 });
        await updatePhoto(updated);
        const allPhotos = await getPhotos();
        stateMachine.setState(currentState, { selectedPhoto: updated, photos: allPhotos });
        stateMachine.logAction('☝', `Contrast: ${updated.filters.contrast}%`, currentState);
      }
      break;
    }

    case ACTION_TYPES.DECREASE_CONTRAST: {
      if (selectedPhoto) {
        const updated = modifyPhotoState(selectedPhoto, 'CONTRAST', { delta: -15 });
        await updatePhoto(updated);
        const allPhotos = await getPhotos();
        stateMachine.setState(currentState, { selectedPhoto: updated, photos: allPhotos });
        stateMachine.logAction('👇', `Contrast: ${updated.filters.contrast}%`, currentState);
      }
      break;
    }

    case ACTION_TYPES.ROTATE_CW: {
      if (selectedPhoto) {
        const updated = modifyPhotoState(selectedPhoto, 'ROTATE_CW');
        await updatePhoto(updated);
        const allPhotos = await getPhotos();
        stateMachine.setState(currentState, { selectedPhoto: updated, photos: allPhotos });
        stateMachine.logAction('☝', `Rotated CW: ${updated.transforms.rotation}°`, currentState);
      }
      break;
    }

    case ACTION_TYPES.ROTATE_CCW: {
      if (selectedPhoto) {
        const updated = modifyPhotoState(selectedPhoto, 'ROTATE_CCW');
        await updatePhoto(updated);
        const allPhotos = await getPhotos();
        stateMachine.setState(currentState, { selectedPhoto: updated, photos: allPhotos });
        stateMachine.logAction('👇', `Rotated CCW: ${updated.transforms.rotation}°`, currentState);
      }
      break;
    }

    case ACTION_TYPES.FLIP_HORIZONTAL: {
      if (selectedPhoto) {
        const updated = modifyPhotoState(selectedPhoto, 'FLIP_H');
        await updatePhoto(updated);
        const allPhotos = await getPhotos();
        stateMachine.setState(currentState, { selectedPhoto: updated, photos: allPhotos });
        stateMachine.logAction('☝', `Flipped Horizontal (${updated.transforms.flipH ? 'ON' : 'OFF'})`, currentState);
      }
      break;
    }

    case ACTION_TYPES.FLIP_VERTICAL: {
      if (selectedPhoto) {
        const updated = modifyPhotoState(selectedPhoto, 'FLIP_V');
        await updatePhoto(updated);
        const allPhotos = await getPhotos();
        stateMachine.setState(currentState, { selectedPhoto: updated, photos: allPhotos });
        stateMachine.logAction('👇', `Flipped Vertical (${updated.transforms.flipV ? 'ON' : 'OFF'})`, currentState);
      }
      break;
    }

    // ----------------------------------------------------
    // CONFIRM_DELETE ACTIONS
    // ----------------------------------------------------
    case ACTION_TYPES.EXECUTE_DELETE: {
      if (deleteCandidate) {
        await deletePhoto(deleteCandidate.id);
        const updatedPhotos = await getPhotos();
        const newBrowseIndex = Math.max(0, Math.min(browseIndex, updatedPhotos.length - 1));
        const newSelected = updatedPhotos[newBrowseIndex] || null;

        const returnState = updatedPhotos.length === 0 ? STATES.HOME : deleteContext || STATES.BROWSE;
        stateMachine.transitionTo(returnState, {
          photos: updatedPhotos,
          browseIndex: newBrowseIndex,
          selectedPhoto: newSelected,
          deleteCandidate: null,
        });
        stateMachine.logAction('👌', 'Photo Deleted Permanently', currentState);
      }
      break;
    }

    case ACTION_TYPES.CANCEL_DELETE: {
      const returnState = deleteContext || STATES.HOME;
      stateMachine.transitionTo(returnState, { deleteCandidate: null });
      stateMachine.logAction('✋', 'Cancelled Photo Deletion', currentState);
      break;
    }

    // ----------------------------------------------------
    // GLOBAL BACK ACTION
    // ----------------------------------------------------
    case ACTION_TYPES.BACK: {
      if (
        currentState === STATES.EDIT_BRIGHTNESS ||
        currentState === STATES.EDIT_CONTRAST ||
        currentState === STATES.EDIT_ROTATE ||
        currentState === STATES.EDIT_FLIP
      ) {
        stateMachine.transitionTo(STATES.EDIT);
      } else if (currentState === STATES.EDIT) {
        stateMachine.transitionTo(STATES.BROWSE);
      } else if (currentState === STATES.CONFIRM_DELETE) {
        stateMachine.transitionTo(deleteContext || STATES.HOME, { deleteCandidate: null });
      } else {
        stateMachine.transitionTo(STATES.HOME);
      }
      stateMachine.logAction('✋', 'Navigated Back', currentState);
      break;
    }

    default:
      console.warn(`[ActionExecutor] Unrecognized action type: ${actionType}`);
  }
}
