import os
import cv2
import json
import time
import numpy as np
import mediapipe as mp
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split

# Actions to detect
ACTIONS = np.array(['thumbsup', 'thumbsdown', 'peace', 'palm', 'fist'])
DATA_PATH = os.path.join('MP_DATA')
NO_SEQUENCES = 30
SEQUENCE_LENGTH = 30

mp_hands = mp.solutions.hands

def extract_keypoints(results):
    if not results.multi_hand_landmarks:
        return np.zeros(21 * 3 * 2)
    
    landmarks_list = []
    for hand_landmarks in results.multi_hand_landmarks:
        for lm in hand_landmarks.landmark:
            landmarks_list.extend([lm.x, lm.y, lm.z])
            
    # Pad to 126 features if only 1 hand detected
    if len(landmarks_list) == 63:
        landmarks_list.extend(np.zeros(63))
    elif len(landmarks_list) > 126:
        landmarks_list = landmarks_list[:126]
        
    return np.array(landmarks_list)

def collect_data():
    print("\n--- Starting Data Collection ---")
    print(f"Actions: {ACTIONS}")
    print(f"Collecting {NO_SEQUENCES} sequences of {SEQUENCE_LENGTH} frames for each action.\n")
    
    os.makedirs(DATA_PATH, exist_ok=True)
    for action in ACTIONS:
        for sequence in range(NO_SEQUENCES):
            os.makedirs(os.path.join(DATA_PATH, action, str(sequence)), exist_ok=True)
            
    cap = cv2.VideoCapture(0)
    with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5) as hands:
        for action in ACTIONS:
            for sequence in range(NO_SEQUENCES):
                for frame_num in range(SEQUENCE_LENGTH):
                    ret, frame = cap.read()
                    if not ret:
                        break
                        
                    # Recolor & process frame
                    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    results = hands.process(image)
                    
                    # Display status info
                    if frame_num == 0:
                        cv2.putText(frame, 'STARTING COLLECTION', (120, 200),
                                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 4, cv2.LINE_AA)
                        cv2.putText(frame, f'Collecting for {action} Video #{sequence}', (15, 30),
                                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
                        cv2.imshow('OpenCV Feed', frame)
                        cv2.waitKey(2000)
                    else:
                        cv2.putText(frame, f'Collecting for {action} Video #{sequence}', (15, 30),
                                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
                        cv2.imshow('OpenCV Feed', frame)
                        
                    # Save keypoints
                    keypoints = extract_keypoints(results)
                    npy_path = os.path.join(DATA_PATH, action, str(sequence), str(frame_num))
                    np.save(npy_path, keypoints)
                    
                    if cv2.waitKey(10) & 0xFF == ord('q'):
                        break
                        
    cap.release()
    cv2.destroyAllWindows()
    print("✅ Data Collection Completed!")

def train_model():
    print("\n--- Training Model ---")
    label_map = {label: num for num, label in enumerate(ACTIONS)}
    sequences, labels = [], []
    
    for action in ACTIONS:
        for sequence in range(NO_SEQUENCES):
            window = []
            for frame_num in range(SEQUENCE_LENGTH):
                res = np.load(os.path.join(DATA_PATH, action, str(sequence), f"{frame_num}.npy"))
                window.append(res)
            sequences.append(window)
            labels.append(label_map[action])
            
    X = np.array(sequences)
    y = to_categorical(labels).astype(int)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.05)
    
    model = Sequential([
        LSTM(64, return_sequences=True, activation='relu', input_shape=(30, 126), name='lstm_3'),
        LSTM(128, return_sequences=True, activation='relu', name='lstm_4'),
        LSTM(64, return_sequences=False, activation='relu', name='lstm_5'),
        Dense(64, activation='relu', name='dense_3'),
        Dense(32, activation='relu', name='dense_4'),
        Dense(len(ACTIONS), activation='softmax', name='dense_5')
    ])
    
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['categorical_accuracy'])
    model.fit(X_train, y_train, epochs=50, batch_size=16)
    
    os.makedirs('model', exist_ok=True)
    h5_path = 'model/action.h5'
    model.save(h5_path)
    print(f"✅ Successfully trained and saved updated model to {h5_path}")
    
    # Run conversion script to export to public/models/gesture_model/model.json
    import convert_model
    print("✅ Successfully converted updated action.h5 to TensorFlow.js format!")

if __name__ == '__main__':
    print("GestureFlow Training Tool")
    print("1. Collect New Dataset from Webcam")
    print("2. Train Model on Existing MP_DATA & Update action.h5")
    choice = input("Select an option (1 or 2): ").strip()
    if choice == '1':
        collect_data()
        train_model()
    elif choice == '2':
        train_model()
    else:
        print("Invalid choice. Running model training...")
        train_model()
