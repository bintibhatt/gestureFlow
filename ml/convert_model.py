import h5py
import json
import os
import numpy as np

h5_path = 'model/action.h5'
out_dir = 'public/models/gesture_model'
os.makedirs(out_dir, exist_ok=True)

with h5py.File(h5_path, 'r') as f:
    # 1. Parse model architecture config
    config_attr = f.attrs.get('model_config')
    if isinstance(config_attr, bytes):
        config_attr = config_attr.decode('utf-8')
    model_config = json.loads(config_attr)
    
    # 2. Extract weights recursively
    weights_bytes = bytearray()
    weights_manifest_entries = []
    
    weight_group = f['model_weights'] if 'model_weights' in f else f
    
    def collect_weights(name, obj):
        if isinstance(obj, h5py.Dataset):
            data = np.array(obj, dtype=np.float32)
            weights_bytes.extend(data.tobytes())
            parts = name.split('/')
            clean_name = f"{parts[0]}/{parts[-1]}"
            if clean_name.endswith(':0'):
                clean_name = clean_name[:-2]
            weights_manifest_entries.append({
                "name": clean_name,
                "shape": list(data.shape),
                "dtype": "float32"
            })
            
    weight_group.visititems(collect_weights)

# 3. Write binary weights shard file
bin_filename = 'group1-shard1of1.bin'
with open(os.path.join(out_dir, bin_filename), 'wb') as bin_f:
    bin_f.write(weights_bytes)

# 4. Write TensorFlow.js model.json
tfjs_model = {
    "format": "layers-model",
    "generatedBy": "keras",
    "convertedBy": "GestureFlow H5 Converter",
    "modelTopology": model_config,
    "weightsManifest": [
        {
            "paths": [bin_filename],
            "weights": weights_manifest_entries
        }
    ]
}

with open(os.path.join(out_dir, 'model.json'), 'w') as json_f:
    json.dump(tfjs_model, json_f, indent=2)

print("✅ Successfully converted action.h5 to TensorFlow.js format in public/models/gesture_model/")