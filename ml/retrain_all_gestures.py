import os
import json
import numpy as np

ACTIONS = np.array(['thumbsup', 'thumbsdown', 'peace', 'palm', 'fist', 'ok', 'point_up', 'point_down'])
NUM_CLASSES = len(ACTIONS)
SEQUENCE_LENGTH = 30
FEATURES_DIM = 126

def generate_hand_landmarks(action):
    # Generates 21 base 3D landmarks (x, y, z) for specified gesture
    lm = np.zeros((21, 3))
    # Wrist
    lm[0] = [0.5, 0.7, 0.0]
    
    if action == 'thumbsup':
        lm[1:5] = [[0.4, 0.5, 0], [0.45, 0.4, 0], [0.48, 0.3, 0], [0.5, 0.15, 0]]  # Thumb up
        lm[5:9] = [[0.4, 0.6, 0], [0.42, 0.65, 0], [0.44, 0.7, 0], [0.45, 0.7, 0]]  # Index folded
        lm[9:13] = [[0.5, 0.6, 0], [0.5, 0.65, 0], [0.5, 0.7, 0], [0.5, 0.7, 0]]    # Middle folded
        lm[13:17] = [[0.58, 0.6, 0], [0.57, 0.65, 0], [0.56, 0.7, 0], [0.55, 0.7, 0]] # Ring folded
        lm[17:21] = [[0.65, 0.6, 0], [0.63, 0.65, 0], [0.61, 0.7, 0], [0.6, 0.7, 0]]  # Pinky folded
    elif action == 'thumbsdown':
        lm[0] = [0.5, 0.3, 0.0]
        lm[1:5] = [[0.4, 0.5, 0], [0.45, 0.6, 0], [0.48, 0.7, 0], [0.5, 0.85, 0]]  # Thumb down
        lm[5:9] = [[0.4, 0.4, 0], [0.42, 0.35, 0], [0.44, 0.3, 0], [0.45, 0.3, 0]]
        lm[9:13] = [[0.5, 0.4, 0], [0.5, 0.35, 0], [0.5, 0.3, 0], [0.5, 0.3, 0]]
        lm[13:17] = [[0.58, 0.4, 0], [0.57, 0.35, 0], [0.56, 0.3, 0], [0.55, 0.3, 0]]
        lm[17:21] = [[0.65, 0.4, 0], [0.63, 0.35, 0], [0.61, 0.3, 0], [0.6, 0.3, 0]]
    elif action == 'palm':
        lm[1:5] = [[0.35, 0.65, 0], [0.28, 0.55, 0], [0.22, 0.45, 0], [0.15, 0.35, 0]] # Thumb open
        lm[5:9] = [[0.4, 0.5, 0], [0.38, 0.35, 0], [0.36, 0.25, 0], [0.35, 0.15, 0]]   # Index open
        lm[9:13] = [[0.5, 0.5, 0], [0.5, 0.33, 0], [0.5, 0.22, 0], [0.5, 0.12, 0]]     # Middle open
        lm[13:17] = [[0.6, 0.5, 0], [0.62, 0.35, 0], [0.64, 0.25, 0], [0.65, 0.15, 0]] # Ring open
        lm[17:21] = [[0.7, 0.55, 0], [0.73, 0.42, 0], [0.76, 0.32, 0], [0.78, 0.22, 0]] # Pinky open
    elif action == 'fist':
        lm[1:5] = [[0.42, 0.65, 0], [0.45, 0.62, 0], [0.48, 0.6, 0], [0.5, 0.58, 0]]
        lm[5:9] = [[0.4, 0.55, 0], [0.42, 0.6, 0], [0.44, 0.65, 0], [0.45, 0.65, 0]]
        lm[9:13] = [[0.5, 0.55, 0], [0.5, 0.6, 0], [0.5, 0.65, 0], [0.5, 0.65, 0]]
        lm[13:17] = [[0.58, 0.55, 0], [0.57, 0.6, 0], [0.56, 0.65, 0], [0.55, 0.65, 0]]
        lm[17:21] = [[0.65, 0.55, 0], [0.63, 0.6, 0], [0.61, 0.65, 0], [0.6, 0.65, 0]]
    elif action == 'peace':
        lm[1:5] = [[0.42, 0.65, 0], [0.45, 0.62, 0], [0.48, 0.6, 0], [0.5, 0.58, 0]]
        lm[5:9] = [[0.4, 0.5, 0], [0.37, 0.35, 0], [0.34, 0.25, 0], [0.32, 0.15, 0]]   # Index open
        lm[9:13] = [[0.5, 0.5, 0], [0.52, 0.33, 0], [0.54, 0.22, 0], [0.56, 0.12, 0]]  # Middle open V
        lm[13:17] = [[0.58, 0.55, 0], [0.57, 0.6, 0], [0.56, 0.65, 0], [0.55, 0.65, 0]] # Ring folded
        lm[17:21] = [[0.65, 0.55, 0], [0.63, 0.6, 0], [0.61, 0.65, 0], [0.6, 0.65, 0]]  # Pinky folded
    elif action == 'ok':
        lm[1:5] = [[0.42, 0.6, 0], [0.43, 0.5, 0], [0.44, 0.4, 0], [0.42, 0.35, 0]]    # Thumb pinched
        lm[5:9] = [[0.4, 0.5, 0], [0.39, 0.43, 0], [0.4, 0.38, 0], [0.42, 0.35, 0]]    # Index pinched to thumb
        lm[9:13] = [[0.5, 0.5, 0], [0.52, 0.33, 0], [0.54, 0.22, 0], [0.56, 0.12, 0]]  # Middle open
        lm[13:17] = [[0.6, 0.5, 0], [0.62, 0.35, 0], [0.64, 0.25, 0], [0.65, 0.15, 0]] # Ring open
        lm[17:21] = [[0.7, 0.55, 0], [0.73, 0.42, 0], [0.76, 0.32, 0], [0.78, 0.22, 0]] # Pinky open
    elif action == 'point_up':
        lm[1:5] = [[0.42, 0.65, 0], [0.45, 0.62, 0], [0.48, 0.6, 0], [0.5, 0.58, 0]]
        lm[5:9] = [[0.45, 0.5, 0], [0.45, 0.35, 0], [0.45, 0.22, 0], [0.45, 0.1, 0]]   # Index straight UP
        lm[9:13] = [[0.5, 0.55, 0], [0.5, 0.6, 0], [0.5, 0.65, 0], [0.5, 0.65, 0]]     # Middle folded
        lm[13:17] = [[0.58, 0.55, 0], [0.57, 0.6, 0], [0.56, 0.65, 0], [0.55, 0.65, 0]] # Ring folded
        lm[17:21] = [[0.65, 0.55, 0], [0.63, 0.6, 0], [0.61, 0.65, 0], [0.6, 0.65, 0]]  # Pinky folded
    elif action == 'point_down':
        lm[0] = [0.5, 0.3, 0.0]
        lm[1:5] = [[0.42, 0.35, 0], [0.45, 0.38, 0], [0.48, 0.4, 0], [0.5, 0.42, 0]]
        lm[5:9] = [[0.45, 0.5, 0], [0.45, 0.65, 0], [0.45, 0.78, 0], [0.45, 0.9, 0]]   # Index straight DOWN
        lm[9:13] = [[0.5, 0.45, 0], [0.5, 0.4, 0], [0.5, 0.35, 0], [0.5, 0.35, 0]]     # Middle folded
        lm[13:17] = [[0.58, 0.45, 0], [0.57, 0.4, 0], [0.56, 0.35, 0], [0.55, 0.35, 0]] # Ring folded
        lm[17:21] = [[0.65, 0.45, 0], [0.63, 0.4, 0], [0.61, 0.35, 0], [0.6, 0.35, 0]]  # Pinky folded

    return lm

def create_dataset(samples_per_action=100):
    sequences = []
    labels = []
    
    label_map = {action: idx for idx, action in enumerate(ACTIONS)}
    
    for action in ACTIONS:
        base_lm = generate_hand_landmarks(action)
        for s in range(samples_per_action):
            seq = []
            # Generate 30 frames with smooth motion & slight Gaussian noise
            noise_scale = np.random.uniform(0.005, 0.02)
            shift_x = np.random.uniform(-0.05, 0.05)
            shift_y = np.random.uniform(-0.05, 0.05)
            
            for f in range(SEQUENCE_LENGTH):
                frame_lm = base_lm.copy()
                # Apply small motion shift + noise
                frame_lm[:, 0] += shift_x + np.sin(f / 5.0) * 0.005 + np.random.normal(0, noise_scale, 21)
                frame_lm[:, 1] += shift_y + np.cos(f / 5.0) * 0.005 + np.random.normal(0, noise_scale, 21)
                
                # Flatten hand 1 (63 values) + dummy hand 2 (63 zeros) -> 126 features
                hand1_flat = frame_lm.flatten()
                hand2_flat = np.zeros(63)
                combined = np.concatenate([hand1_flat, hand2_flat])
                seq.append(combined)
                
            sequences.append(seq)
            labels.append(label_map[action])
            
    return np.array(sequences), np.array(labels)

def train_and_export_all_gestures():
    print("=" * 60)
    print("🤖 GestureFlow Model Retraining Tool (All 8 Gestures)")
    print("=" * 60)
    print(f"Classes to train ({NUM_CLASSES}): {list(ACTIONS)}")
    
    try:
        import tensorflow as tf
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import LSTM, Dense
        from tensorflow.keras.utils import to_categorical
        from sklearn.model_selection import train_test_split
    except ImportError:
        print("❌ TensorFlow/Keras not installed in Python environment.")
        print("Run: pip install tensorflow scikit-learn h5py numpy")
        return

    print("\n1. Generating synthetic 3D keypoint sequence dataset...")
    X, y_labels = create_dataset(samples_per_action=120)
    y = to_categorical(y_labels, num_classes=NUM_CLASSES)
    
    print(f"Dataset shape: X={X.shape}, y={y.shape}")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)
    
    print("\n2. Compiling 3-layer LSTM Neural Network...")
    model = Sequential([
        LSTM(64, return_sequences=True, activation='relu', input_shape=(30, 126), name='lstm_3'),
        LSTM(128, return_sequences=True, activation='relu', name='lstm_4'),
        LSTM(64, return_sequences=False, activation='relu', name='lstm_5'),
        Dense(64, activation='relu', name='dense_3'),
        Dense(32, activation='relu', name='dense_4'),
        Dense(NUM_CLASSES, activation='softmax', name='dense_5')
    ])
    
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['categorical_accuracy'])
    
    print("\n3. Training model for 40 epochs...")
    model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=40, batch_size=16, verbose=1)
    
    os.makedirs('model', exist_ok=True)
    h5_path = 'model/action.h5'
    model.save(h5_path)
    print(f"\n✅ Retrained full model saved to {h5_path}")
    
    print("\n4. Converting model/action.h5 to TensorFlow.js format...")
    import convert_model
    print("🎉 All 8 Gestures Model Retrained & Exported to public/models/gesture_model/model.json!")

if __name__ == '__main__':
    train_and_export_all_gestures()
