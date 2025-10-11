# import tensorflow as tf
# import numpy as np
# import os
# import argparse
# from model import MTTS_CAN
# from inference_preprocess import preprocess_raw_video
# from tqdm import tqdm

# def load_ground_truth_waveform(filepath):
#     """Loads the waveform from the first line of the ground truth file."""
#     with open(filepath, 'r') as f:
#         line = f.readline()
#     waveform_str = line.strip().split()
#     waveform = np.array([float(val) for val in waveform_str if val])
#     return waveform

# def finetune_model(args):
#     img_rows, img_cols, frame_depth = 36, 36, 10
    
#     # --- 1. PREPARE FILE PATHS ---
#     video_dir = os.path.join(args.dataset_path, 'Videos')
#     gt_dir = os.path.join(args.dataset_path, 'Ground_truth')
    
#     video_files = [os.path.join(video_dir, f) for f in sorted(os.listdir(video_dir))]
#     gt_files = [os.path.join(gt_dir, os.path.splitext(f)[0] + '.txt') for f in sorted(os.listdir(video_dir))]
    
#     # Split data
#     val_split = 1 if len(video_files) < 10 else 5
#     print(f"Found {len(video_files)} videos. Using {val_split} for validation.")
    
#     train_video_files = video_files[:-val_split]
#     train_gt_files = gt_files[:-val_split]
#     val_video_files = video_files[-val_split:]
#     val_gt_files = gt_files[-val_split:]

#     # --- 2. LOAD DATA INTO MEMORY ---
#     def load_data_from_files(video_paths, gt_paths):
#         all_dXsub, all_y_pulse = [], []
#         for video_path, gt_path in tqdm(zip(video_paths, gt_paths), total=len(video_paths)):
#             try:
#                 dXsub = preprocess_raw_video(video_path, dim=img_rows)
#                 y_pulse = load_ground_truth_waveform(gt_path)
#                 y_pulse_diff = np.diff(y_pulse, prepend=0)
                
#                 min_len = min(len(dXsub), len(y_pulse_diff))
#                 all_dXsub.append(dXsub[:min_len])
#                 all_y_pulse.append(y_pulse_diff[:min_len])
#             except Exception as e:
#                 print(f"\nSkipping file {video_path} due to error: {e}")
        
#         if not all_dXsub:
#              return None, None

#         dXsub_frames = np.concatenate(all_dXsub, axis=0)
#         y_pulse_frames = np.concatenate(all_y_pulse, axis=0).reshape(-1, 1)
#         return dXsub_frames, y_pulse_frames

#     print("Loading training data...")
#     train_dXsub, train_y_pulse = load_data_from_files(train_video_files, train_gt_files)
    
#     print("\nLoading validation data...")
#     val_dXsub, val_y_pulse = load_data_from_files(val_video_files, val_gt_files)

#     # --- 3. PREPARE MODEL INPUTS AND TARGETS ---
#     effective_batch_size = args.batch_size_multiplier * frame_depth

#     # --- FINAL FIX: Trim the data to be a perfect multiple of the batch size ---
#     train_data_len = (len(train_dXsub) // effective_batch_size) * effective_batch_size
#     train_dXsub = train_dXsub[:train_data_len]
#     train_y_pulse = train_y_pulse[:train_data_len]

#     val_data_len = (len(val_dXsub) // effective_batch_size) * effective_batch_size
#     val_dXsub = val_dXsub[:val_data_len]
#     val_y_pulse = val_y_pulse[:val_data_len]
    
#     print(f"\nUsing {train_dXsub.shape[0]} training frames (perfectly divisible by batch size).")
#     print(f"Using {val_dXsub.shape[0]} validation frames (perfectly divisible by batch size).")
    
#     X_train_motion = train_dXsub[:, :, :, :3]
#     X_train_raw = train_dXsub[:, :, :, -3:]
#     y_train_dummy_resp = np.zeros_like(train_y_pulse)

#     X_val_motion = val_dXsub[:, :, :, :3]
#     X_val_raw = val_dXsub[:, :, :, -3:]
#     y_val_dummy_resp = np.zeros_like(val_y_pulse)
    
#     # --- 4. LOAD, COMPILE, AND TRAIN MODEL ---
#     print("\nLoading pretrained model...")
#     model = MTTS_CAN(frame_depth, 32, 64, (img_rows, img_cols, 3))
#     model.load_weights(args.pretrained_weights)
    
#     print("Starting fine-tuning...")
#     model.compile(optimizer='adam', 
#                   loss='mse', 
#                   loss_weights={'output_1': 1.0, 'output_2': 0.0})
#     model.optimizer.lr.assign(1e-2)
    
#     model.fit(
#         x=[X_train_motion, X_train_raw],
#         y=[train_y_pulse, y_train_dummy_resp],
#         batch_size=effective_batch_size,
#         epochs=args.epochs,
#         validation_data=([X_val_motion, X_val_raw], [val_y_pulse, y_val_dummy_resp]),
#         verbose=1
#     )
    
#     print("\nSaving fine-tuned model...")
#     model.save_weights('finetuned_full_dataset2.hdf5')
#     print("Fine-tuning complete. New weights saved to 'finetuned_full_dataset2.hdf5'")

# # ===================================================================
# # 5. ARGUMENT PARSING
# # ===================================================================
# if __name__ == "__main__":
#     parser = argparse.ArgumentParser()
#     parser.add_argument('--dataset_path', type=str, required=True, help='Path to the main dataset folder')
#     parser.add_argument('--pretrained_weights', type=str, default='./mtts_can.hdf5', help='Path to pretrained weights')
#     parser.add_argument('--batch_size_multiplier', type=int, default=32, help='Determines batch size (batch_size = multiplier * 10)')
#     parser.add_argument('--epochs', type=int, default=15, help='Number of epochs for fine-tuning')
    
#     args = parser.parse_args()
#     finetune_model(args)






# =================================================================
# VERSION 2 : With early stopping technique
# =================================================================
import tensorflow as tf
import numpy as np
import os
import argparse
from model import MTTS_CAN
from inference_preprocess import preprocess_raw_video
from tqdm import tqdm
from tensorflow.keras.callbacks import EarlyStopping # <<< 1. IMPORT THE CALLBACK

def load_ground_truth_waveform(filepath):
    """Loads the waveform from the first line of the ground truth file."""
    with open(filepath, 'r') as f:
        line = f.readline()
    waveform_str = line.strip().split()
    waveform = np.array([float(val) for val in waveform_str if val])
    return waveform

def finetune_model(args):
    img_rows, img_cols, frame_depth = 36, 36, 10
    
    # --- 1. PREPARE FILE PATHS ---
    video_dir = os.path.join(args.dataset_path, 'Videos')
    gt_dir = os.path.join(args.dataset_path, 'Ground_truth')
    
    video_files = [os.path.join(video_dir, f) for f in sorted(os.listdir(video_dir))]
    gt_files = [os.path.join(gt_dir, os.path.splitext(f)[0] + '.txt') for f in sorted(os.listdir(video_dir))]
    
    # Robustly split data
    if len(video_files) < 2:
        raise ValueError("Not enough videos for a train/val split. Need at least 2.")
    val_split = 1 if len(video_files) < 10 else 5
    print(f"Found {len(video_files)} videos. Using {val_split} for validation.")
    
    train_video_files, val_video_files = video_files[:-val_split], video_files[-val_split:]
    train_gt_files, val_gt_files = gt_files[:-val_split], gt_files[-val_split:]

    # --- 2. LOAD ALL DATA INTO MEMORY ---
    def load_data_from_files(video_paths, gt_paths):
        all_dXsub, all_y_pulse = [], []
        for video_path, gt_path in tqdm(zip(video_paths, gt_paths), total=len(video_paths), desc="Loading files"):
            try:
                dXsub = preprocess_raw_video(video_path, dim=img_rows)
                y_pulse = load_ground_truth_waveform(gt_path)
                y_pulse_diff = np.diff(y_pulse, prepend=0)
                min_len = min(len(dXsub), len(y_pulse_diff))
                all_dXsub.append(dXsub[:min_len])
                all_y_pulse.append(y_pulse_diff[:min_len])
            except Exception as e:
                print(f"\nSkipping file {video_path} due to error: {e}")
        
        if not all_dXsub: return None, None
        return np.concatenate(all_dXsub, axis=0), np.concatenate(all_y_pulse, axis=0).reshape(-1, 1)

    train_dXsub, train_y_pulse = load_data_from_files(train_video_files, train_gt_files)
    val_dXsub, val_y_pulse = load_data_from_files(val_video_files, val_gt_files)

    if train_dXsub is None:
        raise ValueError("Failed to load any training data. Please check file paths.")

    effective_batch_size = args.batch_size_multiplier * frame_depth
    
    # Trim data to be a perfect multiple of the batch size
    train_len = (len(train_dXsub) // effective_batch_size) * effective_batch_size
    train_dXsub, train_y_pulse = train_dXsub[:train_len], train_y_pulse[:train_len]
    val_len = (len(val_dXsub) // effective_batch_size) * effective_batch_size
    val_dXsub, val_y_pulse = val_dXsub[:val_len], val_y_pulse[:val_len]
    
    print(f"\nUsing {train_dXsub.shape[0]} training frames.")
    print(f"Using {val_dXsub.shape[0]} validation frames.")
    
    X_train_motion, X_train_raw = train_dXsub[:, :, :, :3], train_dXsub[:, :, :, -3:]
    y_train_dummy = np.zeros_like(train_y_pulse)
    X_val_motion, X_val_raw = val_dXsub[:, :, :, :3], val_dXsub[:, :, :, -3:]
    y_val_dummy = np.zeros_like(val_y_pulse)
    
    # --- 4. LOAD, COMPILE, AND TRAIN MODEL ---
    print("\nLoading pretrained model...")
    model = MTTS_CAN(frame_depth, 32, 64, (img_rows, img_cols, 3))
    model.load_weights(args.pretrained_weights)
    
    print("Starting fine-tuning...")
    model.compile(optimizer='adam', loss='mse', loss_weights={'output_1': 1.0, 'output_2': 0.0})
    model.optimizer.lr.assign(1e-3)
    
    # <<< 2. DEFINE THE EARLY STOPPING CALLBACK
    early_stopping_callback = EarlyStopping(
        monitor='val_loss',       # Watch the validation loss
        patience=5,              # Stop if it doesn't improve for 5 straight epochs
        verbose=1,                # Print a message when training stops
        restore_best_weights=True # Crucially, restore the model weights from the best epoch
    )

    model.fit(
        x=[X_train_motion, X_train_raw],
        y=[train_y_pulse, y_train_dummy],
        batch_size=effective_batch_size,
        epochs=args.epochs,
        validation_data=([X_val_motion, X_val_raw], [val_y_pulse, y_val_dummy]),
        verbose=1,
        callbacks=[early_stopping_callback] # <<< 3. ADD THE CALLBACK TO THE FIT FUNCTION
    )
    
    print("\nSaving fine-tuned model...")
    model.save_weights('finetuned_full_dataset_v2.hdf5')
    print("Fine-tuning complete. Best weights were restored and saved to 'finetuned_full_dataset_v2.hdf5'")

# ===================================================================
# 5. ARGUMENT PARSING
# ===================================================================
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--dataset_path', type=str, required=True, help='Path to the main dataset folder')
    parser.add_argument('--pretrained_weights', type=str, default='./mtts_can.hdf5', help='Path to pretrained weights')
    parser.add_argument('--batch_size_multiplier', type=int, default=32, help='Determines batch size')
    parser.add_argument('--epochs', type=int, default=200, help='Maximum number of epochs for fine-tuning')
    
    args = parser.parse_args()
    finetune_model(args)