# GestureFlow

GestureFlow is a browser-based, gesture-controlled photo workspace that uses computer vision to let users capture, browse, and edit photos using hand gestures.

## Features

* Real-time hand gesture recognition
* Gesture-controlled navigation
* Camera-based photo capture
* Photo browsing and history
* Photo deletion
* Image editing
* Context-aware gesture actions
* Local browser-based processing
* No camera or photo uploads required

## Gesture Interaction

Gestures change meaning based on the current application state.

```text id="1v7j9p"
HOME
👍  Take Photo
✋  Show Latest Photo
👎  Delete Latest Photo
👌  Open Menu

MENU
☝  Move Up
👇  Move Down
👌  Select
✋  Back

BROWSE
☝  Next Photo
👇  Previous Photo
✋  Back

EDIT
☝  Navigate
👇  Navigate
👌  Select
✋  Back
```

## Architecture

```text id="y4y7tq"
Webcam
  ↓
MediaPipe
  ↓
Hand Landmarks
  ↓
Gesture Classifier
  ↓
State Machine
  ↓
Action Engine
  ↓
Photo Workspace
```

## Tech Stack

* Next.js
* React
* TypeScript
* MediaPipe
* TensorFlow.js
* Canvas API
* IndexedDB
* Vercel

## Goal

Build a modular gesture interaction system where recognized gestures control a contextual application interface rather than being tied to fixed actions.

**Gesture → Context → Action**
