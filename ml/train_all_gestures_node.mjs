import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import path from 'path';

const ACTIONS = ['thumbsup', 'thumbsdown', 'peace', 'palm', 'fist', 'ok', 'point_up', 'point_down'];
const NUM_CLASSES = ACTIONS.length;
const SEQUENCE_LENGTH = 30;
const FEATURES_DIM = 126;

function generateBaseLandmarks(action) {
  const lm = new Array(21).fill(0).map(() => [0, 0, 0]);
  lm[0] = [0.5, 0.7, 0.0]; // Wrist

  if (action === 'thumbsup') {
    lm[1] = [0.4, 0.5, 0]; lm[2] = [0.45, 0.4, 0]; lm[3] = [0.48, 0.3, 0]; lm[4] = [0.5, 0.15, 0];
    for (let i = 5; i <= 20; i++) lm[i] = [0.5, 0.65, 0.1];
  } else if (action === 'thumbsdown') {
    lm[0] = [0.5, 0.3, 0.0];
    lm[1] = [0.4, 0.5, 0]; lm[2] = [0.45, 0.6, 0]; lm[3] = [0.48, 0.7, 0]; lm[4] = [0.5, 0.85, 0];
    for (let i = 5; i <= 20; i++) lm[i] = [0.5, 0.35, 0.1];
  } else if (action === 'palm') {
    lm[1] = [0.35, 0.65, 0]; lm[2] = [0.28, 0.55, 0]; lm[3] = [0.22, 0.45, 0]; lm[4] = [0.15, 0.35, 0];
    lm[5] = [0.4, 0.5, 0]; lm[6] = [0.38, 0.35, 0]; lm[7] = [0.36, 0.25, 0]; lm[8] = [0.35, 0.15, 0];
    lm[9] = [0.5, 0.5, 0]; lm[10] = [0.5, 0.33, 0]; lm[11] = [0.5, 0.22, 0]; lm[12] = [0.5, 0.12, 0];
    lm[13] = [0.6, 0.5, 0]; lm[14] = [0.62, 0.35, 0]; lm[15] = [0.64, 0.25, 0]; lm[16] = [0.65, 0.15, 0];
    lm[17] = [0.7, 0.55, 0]; lm[18] = [0.73, 0.42, 0]; lm[19] = [0.76, 0.32, 0]; lm[20] = [0.78, 0.22, 0];
  } else if (action === 'fist') {
    for (let i = 1; i <= 20; i++) lm[i] = [0.5, 0.6, 0.1];
  } else if (action === 'peace') {
    for (let i = 1; i <= 4; i++) lm[i] = [0.45, 0.6, 0.1];
    lm[5] = [0.4, 0.5, 0]; lm[6] = [0.37, 0.35, 0]; lm[7] = [0.34, 0.25, 0]; lm[8] = [0.32, 0.15, 0];
    lm[9] = [0.5, 0.5, 0]; lm[10] = [0.52, 0.33, 0]; lm[11] = [0.54, 0.22, 0]; lm[12] = [0.56, 0.12, 0];
    for (let i = 13; i <= 20; i++) lm[i] = [0.55, 0.6, 0.1];
  } else if (action === 'ok') {
    lm[1] = [0.42, 0.6, 0]; lm[2] = [0.43, 0.5, 0]; lm[3] = [0.44, 0.4, 0]; lm[4] = [0.42, 0.35, 0];
    lm[5] = [0.4, 0.5, 0]; lm[6] = [0.39, 0.43, 0]; lm[7] = [0.4, 0.38, 0]; lm[8] = [0.42, 0.35, 0];
    lm[9] = [0.5, 0.5, 0]; lm[10] = [0.52, 0.33, 0]; lm[11] = [0.54, 0.22, 0]; lm[12] = [0.56, 0.12, 0];
    lm[13] = [0.6, 0.5, 0]; lm[14] = [0.62, 0.35, 0]; lm[15] = [0.64, 0.25, 0]; lm[16] = [0.65, 0.15, 0];
    lm[17] = [0.7, 0.55, 0]; lm[18] = [0.73, 0.42, 0]; lm[19] = [0.76, 0.32, 0]; lm[20] = [0.78, 0.22, 0];
  } else if (action === 'point_up') {
    for (let i = 1; i <= 4; i++) lm[i] = [0.45, 0.6, 0.1];
    lm[5] = [0.45, 0.5, 0]; lm[6] = [0.45, 0.35, 0]; lm[7] = [0.45, 0.22, 0]; lm[8] = [0.45, 0.1, 0];
    for (let i = 9; i <= 20; i++) lm[i] = [0.52, 0.6, 0.1];
  } else if (action === 'point_down') {
    lm[0] = [0.5, 0.3, 0.0];
    for (let i = 1; i <= 4; i++) lm[i] = [0.45, 0.4, 0.1];
    lm[5] = [0.45, 0.5, 0]; lm[6] = [0.45, 0.65, 0]; lm[7] = [0.45, 0.78, 0]; lm[8] = [0.45, 0.9, 0];
    for (let i = 9; i <= 20; i++) lm[i] = [0.52, 0.4, 0.1];
  }

  return lm;
}

function generateDataset(samplesPerClass = 10) {
  const xs = [];
  const ys = [];

  ACTIONS.forEach((action, classIdx) => {
    const baseLm = generateBaseLandmarks(action);
    for (let s = 0; s < samplesPerClass; s++) {
      const sequence = [];
      const shiftX = (Math.random() - 0.5) * 0.04;
      const shiftY = (Math.random() - 0.5) * 0.04;

      for (let f = 0; f < SEQUENCE_LENGTH; f++) {
        const frameFlat = [];
        baseLm.forEach(([x, y, z]) => {
          const noiseX = (Math.random() - 0.5) * 0.01;
          const noiseY = (Math.random() - 0.5) * 0.01;
          frameFlat.push(x + shiftX + noiseX, y + shiftY + noiseY, z);
        });
        for (let i = 0; i < 63; i++) frameFlat.push(0);
        sequence.push(frameFlat);
      }

      xs.push(sequence);
      const oneHot = new Array(NUM_CLASSES).fill(0);
      oneHot[classIdx] = 1;
      ys.push(oneHot);
    }
  });

  return {
    xTensor: tf.tensor3d(xs),
    yTensor: tf.tensor2d(ys),
  };
}

async function retrainAllGesturesModel() {
  console.log('🤖 Ultra-Fast Retraining TensorFlow.js Model for ALL 8 GESTURE CLASSES...');
  console.log('Classes:', ACTIONS);

  await tf.ready();

  const model = tf.sequential();
  model.add(tf.layers.lstm({ units: 64, returnSequences: true, activation: 'relu', recurrentInitializer: 'glorotUniform', inputShape: [SEQUENCE_LENGTH, FEATURES_DIM], name: 'lstm_3' }));
  model.add(tf.layers.lstm({ units: 128, returnSequences: true, activation: 'relu', recurrentInitializer: 'glorotUniform', name: 'lstm_4' }));
  model.add(tf.layers.lstm({ units: 64, returnSequences: false, activation: 'relu', recurrentInitializer: 'glorotUniform', name: 'lstm_5' }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu', name: 'dense_3' }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu', name: 'dense_4' }));
  model.add(tf.layers.dense({ units: NUM_CLASSES, activation: 'softmax', name: 'dense_5' }));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  console.log('Generating keypoint dataset (80 samples)...');
  const { xTensor, yTensor } = generateDataset(10);

  console.log('Training model for 5 epochs...');
  await model.fit(xTensor, yTensor, {
    epochs: 5,
    batchSize: 16,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}/5 - loss: ${logs.loss.toFixed(4)} - acc: ${logs.acc.toFixed(4)}`);
      }
    }
  });

  xTensor.dispose();
  yTensor.dispose();

  const outDir = path.resolve('public/models/gesture_model');
  fs.mkdirSync(outDir, { recursive: true });

  const customSaver = {
    save: async (modelArtifacts) => {
      const weightSpecs = modelArtifacts.weightSpecs.map(w => {
        let name = w.name;
        if (name.endsWith(':0')) name = name.slice(0, -2);
        return { ...w, name };
      });

      const weightsManifest = [
        {
          paths: ['group1-shard1of1.bin'],
          weights: weightSpecs,
        }
      ];

      const modelJson = {
        format: 'layers-model',
        generatedBy: 'keras',
        convertedBy: 'GestureFlow 8-Gesture Fast Trainer',
        modelTopology: modelArtifacts.modelTopology,
        weightsManifest,
      };

      fs.writeFileSync(path.join(outDir, 'model.json'), JSON.stringify(modelJson, null, 2));
      const binBuffer = Buffer.from(modelArtifacts.weightData);
      fs.writeFileSync(path.join(outDir, 'group1-shard1of1.bin'), binBuffer);

      console.log('\n🎉 SUCCESS! Full 8-Class Model Retrained & Exported to:');
      console.log(` - ${path.join(outDir, 'model.json')}`);
      console.log(` - ${path.join(outDir, 'group1-shard1of1.bin')}`);
      return { modelArtifactsInfo: { dateSaved: new Date(), modelTopologyBytes: 10000 } };
    }
  };

  await model.save(customSaver);
}

retrainAllGesturesModel().catch(err => {
  console.error('Error retraining model:', err);
  process.exit(1);
});
