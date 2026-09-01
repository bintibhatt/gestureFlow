# GestureFlow — V2

GestureFlow is a browser-based, gesture-controlled photo workspace that uses computer vision and real-time hand gesture recognition to let users interact with photos using natural hand movements.

---

## 🌟 Key Features

* **Real-time 8-Gesture Recognition**: High-performance detection for 👍 Thumbs Up, 👎 Thumbs Down, ✋ Palm, 👌 OK, ☝ Point Up, 👇 Point Down, ✌ Peace, and ✊ Fist.
* **Context-Aware Interaction**: Gestures dynamically change meaning based on the current state (**Gesture → Context → Action**).
* **Two Route Architecture**:
  * `/` — Product Landing Page & Interactive Architecture Visualizer
  * `/use` — Interactive Touchless Photo Workspace
* **User-Initiated Camera Control**: Camera starts strictly on explicit user consent (`Start Camera`).
* **Non-Destructive Image Editing**: Live adjustments for brightness, contrast, grayscale, $90^\circ$ rotation, and horizontal/vertical flipping.
* **Full Undo & Reset Support**: Unlimited edit snapshot history stack to revert or reset alterations at any time.
* **Safe Deletion Flow**: Multi-step confirmation dialog preventing accidental data loss (`CONFIRM_DELETE`).
* **100% Client-Side Privacy**: Zero camera video or photo uploads — all computer vision, ML inference, image filtering, and IndexedDB storage run entirely in the browser.

---

## 🖐️ Gesture Vocabulary & Context Matrix

| Gesture | HOME Context | MENU Context | BROWSE Context | EDIT Context | Sub-Edit Modes | CONFIRM_DELETE |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **👍 Thumbs Up** | 📸 Take Photo | &mdash; | &mdash; | &mdash; | &mdash; | &mdash; |
| **👎 Thumbs Down** | 🗑️ Delete Latest | &mdash; | 🗑️ Delete Selected | &mdash; | &mdash; | &mdash; |
| **✋ Open Palm** | 🖼️ Show Latest | 🔙 Back to Home | 🔙 Back to Home | 🔙 Back to Browse | 🔙 Done / Back | ❌ Cancel |
| **👌 OK Sign** | 📋 Open Menu | ✅ Select Item | ✏️ Edit Photo | ✅ Select Tool | &mdash; | 🗑️ Confirm Delete |
| **☝ Point Up** | &mdash; | ⬆️ Move Up | ➡️ Next Photo | ⬆️ Previous Tool | 🔼 Increase / CW / Flip H | &mdash; |
| **👇 Point Down** | &mdash; | ⬇️ Move Down | ⬅️ Prev Photo | ⬇️ Next Tool | 🔽 Decrease / CCW / Flip V | &mdash; |
| **✌ Peace Sign** | &mdash; | &mdash; | &mdash; | &mdash; | &mdash; | &mdash; |
| **✊ Fist** | &mdash; | &mdash; | &mdash; | &mdash; | &mdash; | &mdash; |

---

## 🏗️ System Architecture

```text
Webcam Stream
     ↓
MediaPipe Hands (21 Keypoints)
     ↓
Hybrid Gesture Classifier (LSTM + Geometric Heuristics)
     ↓
Temporal Stability & Cooldown Filter
     ↓
State Machine (HOME | MENU | BROWSE | EDIT | EDIT_* | CONFIRM_DELETE)
     ↓
Action Engine (Capture | Browse | Edit | Rotate | Flip | Undo | Reset | Delete)
     ↓
Photo Workspace & Canvas Processor
     ↓
IndexedDB Local Store
```

---

## 📂 Repository Structure

```
gesture-flow/
├── app/
│   ├── globals.css                # Global styles & scrollbars
│   ├── layout.js                  # Root Next.js layout
│   ├── page.js                    # Landing page (/)
│   └── use/
│       └── page.js                # Interactive photo workspace (/use)
├── components/
│   ├── Camera/
│   │   ├── CameraFeed.jsx         # Video stream & 21-keypoint skeleton overlay
│   │   └── CameraControls.jsx     # Camera toggle, landmarks toggle, manual snapshot
│   ├── Gesture/
│   │   ├── GestureHUD.jsx         # Real-time telemetry, confidence meter, cooldown
│   │   ├── GestureGuide.jsx       # Dynamic contextual cheat sheet
│   │   └── ActionHistory.jsx      # Audit trail of executed actions
│   ├── Menu/
│   │   └── NavigationMenu.jsx     # Gesture-controlled navigation menu modal
│   └── PhotoWorkspace/
│       ├── CanvasViewer.jsx       # Filtered & transformed photo canvas viewer
│       ├── EditToolbar.jsx        # Sub-mode tools (Brightness, Contrast, Rotate, Flip, Undo, Reset)
│       ├── PhotoGallery.jsx       # Thumbnail browser & selection strip
│       └── DeleteConfirmModal.jsx # Delete safety confirmation dialog
├── lib/
│   ├── actions/
│   │   └── index.js               # Action router & dispatcher
│   ├── gesture/
│   │   ├── engine.js              # GestureEngine with debouncing, stability & cooldown
│   │   ├── mapping.js             # Gesture definitions and state mapping matrix
│   │   └── modelLoader.js         # TF.js layers model & MediaPipe loader
│   ├── image/
│   │   └── processor.js           # Non-destructive canvas transforms, filters & undo
│   ├── state/
│   │   └── machine.js             # Central StateMachine with sub-states & pub/sub
│   └── storage/
│       └── db.js                  # Offline IndexedDB storage wrapper
├── ml/
│   ├── convert_model.py           # Keras H5 to TensorFlow.js converter
│   └── gesture_recognition.ipynb  # LSTM training notebook
├── model/
│   └── action.h5                  # Trained Keras Sequential LSTM model
├── public/
│   └── models/
│       └── gesture_model/         # TF.js model manifest & binary shards
├── package.json
└── README.md
```

---

## 💻 Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) (App Router), React, Tailwind CSS
* **Computer Vision**: [MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
* **Machine Learning**: [TensorFlow.js](https://www.tensorflow.org/js) (LSTM Sequence Model)
* **Graphics & Processing**: HTML5 Canvas API (Dynamic Transforms & CSS Filters)
* **Local Persistence**: IndexedDB via `idb`
* **Icons & Animation**: Lucide React, Framer Motion

---

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bintibhatt/gestureFlow.git
   cd gestureFlow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) for the landing page or [http://localhost:3000/use](http://localhost:3000/use) to launch the touch-free photo workspace.
