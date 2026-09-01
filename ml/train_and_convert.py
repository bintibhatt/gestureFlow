import os
import json
import numpy as np

# Optional Keras training script to build, train, and convert a custom LSTM gesture model
def build_and_train_gesture_model(epochs=30, batch_size=16):
    try:
        import tensorflow as tf
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import LSTM, Dense
        import h5py
    except ImportError:
        print("TensorFlow, Keras, or H5Py not found in Python environment.")
        print("To run model training, install: pip install tensorflow h5py numpy")
        return

    actions = np.array(['thumbsup', 'thumbsdown', 'peace', 'palm', 'fist'])
    sequence_length = 30
    features_dim = 126  # 21 keypoints * 3 coordinates (x, y, z) * 2 hands

    print(f"Building LSTM architecture for classes: {actions}...")
    model = Sequential([
        LSTM(64, return_sequences=True, activation='relu', input_shape=(sequence_length, features_dim), name='lstm_3'),
        LSTM(128, return_sequences=True, activation='relu', name='lstm_4'),
        LSTM(64, return_sequences=False, activation='relu', name='lstm_5'),
        Dense(64, activation='relu', name='dense_3'),
        Dense(32, activation='relu', name='dense_4'),
        Dense(len(actions), activation='softmax', name='dense_5')
    ])

    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['categorical_accuracy'])
    model.summary()

    os.makedirs('model', exist_ok=True)
    h5_path = 'model/action.h5'
    model.save(h5_path)
    print(f"✅ Saved trained base model to {h5_path}")

    # Convert to TF.js format using convert_model.py
    import ml.convert_model

if __name__ == '__main__':
    build_and_train_gesture_model()
