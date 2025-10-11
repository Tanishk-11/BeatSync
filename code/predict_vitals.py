# import tensorflow as tf
# import numpy as np
# import scipy.io
# import os
# import sys
# import argparse
# sys.path.append('../')
# from model import Attention_mask, MTTS_CAN
# import h5py
# import matplotlib.pyplot as plt
# from scipy.signal import butter
# from inference_preprocess import preprocess_raw_video, detrend

# def predict_vitals(args):
#     img_rows = 36
#     img_cols = 36
#     frame_depth = 10
#     model_checkpoint = './mtts_can.hdf5'
#     batch_size = args.batch_size
#     fs = args.sampling_rate
#     sample_data_path = args.video_path

#     dXsub = preprocess_raw_video(sample_data_path, dim=36)
#     print('dXsub shape', dXsub.shape)

#     dXsub_len = (dXsub.shape[0] // frame_depth)  * frame_depth
#     dXsub = dXsub[:dXsub_len, :, :, :]

#     model = MTTS_CAN(frame_depth, 32, 64, (img_rows, img_cols, 3))
#     model.load_weights(model_checkpoint)

#     yptest = model.predict((dXsub[:, :, :, :3], dXsub[:, :, :, -3:]), batch_size=batch_size, verbose=1)

#     pulse_pred = yptest[0]
#     pulse_pred = detrend(np.cumsum(pulse_pred), 100)
#     [b_pulse, a_pulse] = butter(1, [0.75 / fs * 2, 2.5 / fs * 2], btype='bandpass')
#     pulse_pred = scipy.signal.filtfilt(b_pulse, a_pulse, np.double(pulse_pred))

#     resp_pred = yptest[1]
#     resp_pred = detrend(np.cumsum(resp_pred), 100)
#     [b_resp, a_resp] = butter(1, [0.08 / fs * 2, 0.5 / fs * 2], btype='bandpass')
#     resp_pred = scipy.signal.filtfilt(b_resp, a_resp, np.double(resp_pred))

#     ########## Plot ##################
#     plt.subplot(211)
#     plt.plot(pulse_pred)
#     plt.title('Pulse Prediction')
#     plt.subplot(212)
#     plt.plot(resp_pred)
#     plt.title('Resp Prediction')
#     plt.show()


# if __name__ == "__main__":

#     parser = argparse.ArgumentParser()
#     parser.add_argument('--video_path', type=str, help='processed video path')
#     parser.add_argument('--sampling_rate', type=int, default = 30, help='sampling rate of your video')
#     parser.add_argument('--batch_size', type=int, default = 100, help='batch size (multiplier of 10)')
#     args = parser.parse_args()

#     predict_vitals(args)






# =======================================================
# VERSION -2 
# =======================================================

# import tensorflow as tf
# import numpy as np
# import scipy.io
# import os
# import sys
# import argparse
# sys.path.append('../')
# from model import Attention_mask, MTTS_CAN
# import h5py
# import matplotlib.pyplot as plt
# from scipy.signal import butter, welch # <<< MODIFIED: Import welch
# from inference_preprocess import preprocess_raw_video, detrend

# # <<< NEW FUNCTION: To calculate BPM from the signal
# def calculate_bpm(signal, fs=30):
#     """Calculates the heart rate in BPM from a signal using Welch's method."""
#     # Use Welch's method for a more stable power spectral density estimate
#     f, Pxx = welch(signal, fs, nperseg=len(signal))
    
#     # Find the frequency with the maximum power in the plausible HR range
#     # (45 BPM to 150 BPM -> 0.75 Hz to 2.5 Hz)
#     valid_indices = np.where((f >= 0.75) & (f <= 2.5))
#     if len(Pxx[valid_indices]) == 0:
#         return 0 # Return 0 if no valid frequency found
        
#     peak_index = np.argmax(Pxx[valid_indices])
#     bpm = f[valid_indices][peak_index] * 60.0
    
#     return bpm

# def predict_vitals(args):
#     img_rows = 36
#     img_cols = 36
#     frame_depth = 10
#     model_checkpoint = './mtts_can.hdf5'
#     batch_size = args.batch_size
#     fs = args.sampling_rate
#     sample_data_path = args.video_path

#     dXsub = preprocess_raw_video(sample_data_path, dim=36)
#     print('dXsub shape', dXsub.shape)

#     dXsub_len = (dXsub.shape[0] // frame_depth) * frame_depth
#     dXsub = dXsub[:dXsub_len, :, :, :]

#     model = MTTS_CAN(frame_depth, 32, 64, (img_rows, img_cols, 3))
#     model.load_weights(model_checkpoint)

#     yptest = model.predict((dXsub[:, :, :, :3], dXsub[:, :, :, -3:]), batch_size=batch_size, verbose=1)

#     pulse_pred = yptest[0]
#     pulse_pred = detrend(np.cumsum(pulse_pred), 100)
#     [b_pulse, a_pulse] = butter(1, [0.75 / fs * 2, 2.5 / fs * 2], btype='bandpass')
#     pulse_pred = scipy.signal.filtfilt(b_pulse, a_pulse, np.double(pulse_pred))

#     resp_pred = yptest[1]
#     resp_pred = detrend(np.cumsum(resp_pred), 100)
#     [b_resp, a_resp] = butter(1, [0.08 / fs * 2, 0.5 / fs * 2], btype='bandpass')
#     resp_pred = scipy.signal.filtfilt(b_resp, a_resp, np.double(resp_pred))

#     # <<< ADDED CALCULATION AND PRINTING
#     bpm = calculate_bpm(pulse_pred, fs)
#     print(f"\n========================================")
#     print(f"✅ Estimated Heart Rate: {bpm:.2f} BPM")
#     print(f"========================================")

#     ########## Plot ##################
#     plt.subplot(211)
#     plt.plot(pulse_pred)
#     plt.title('Pulse Prediction')
#     plt.subplot(212)
#     plt.plot(resp_pred)
#     plt.title('Resp Prediction')
#     plt.show()


# if __name__ == "__main__":

#     parser = argparse.ArgumentParser()
#     parser.add_argument('--video_path', type=str, help='processed video path')
#     parser.add_argument('--sampling_rate', type=int, default = 30, help='sampling rate of your video')
#     parser.add_argument('--batch_size', type=int, default = 100, help='batch size (multiplier of 10)')
#     args = parser.parse_args()

#     predict_vitals(args)





# ===================================================================
# VERSION-3 with breathing rate
# ===================================================================
# import tensorflow as tf
# import numpy as np
# import scipy.io
# import os
# import sys
# import argparse
# sys.path.append('../')
# from model import Attention_mask, MTTS_CAN
# import h5py
# import matplotlib.pyplot as plt
# from scipy.signal import butter, welch
# from inference_preprocess import preprocess_raw_video, detrend

# def calculate_bpm(signal, fs=30):
#     """Calculates the heart rate in BPM from a signal using Welch's method."""
#     f, Pxx = welch(signal, fs, nperseg=len(signal))
#     # Heart Rate physiological range: 45-150 BPM -> 0.75-2.5 Hz
#     valid_indices = np.where((f >= 0.75) & (f <= 2.5))
#     if len(Pxx[valid_indices]) == 0:
#         return 0
#     peak_index = np.argmax(Pxx[valid_indices])
#     bpm = f[valid_indices][peak_index] * 60.0
#     return bpm

# # <<< NEW FUNCTION: To calculate breaths per minute
# def calculate_breaths_per_minute(signal, fs=30):
#     """Calculates the respiratory rate in Breaths/Min from a signal."""
#     f, Pxx = welch(signal, fs, nperseg=len(signal))
#     # Respiratory Rate physiological range: 5-30 Breaths/Min -> 0.08-0.5 Hz
#     valid_indices = np.where((f >= 0.08) & (f <= 0.5))
#     if len(Pxx[valid_indices]) == 0:
#         return 0
#     peak_index = np.argmax(Pxx[valid_indices])
#     breaths_per_min = f[valid_indices][peak_index] * 60.0
#     return breaths_per_min

# def predict_vitals(args):
#     img_rows = 36
#     img_cols = 36
#     frame_depth = 10
#     model_checkpoint = './mtts_can.hdf5'
#     batch_size = args.batch_size
#     fs = args.sampling_rate
#     sample_data_path = args.video_path

#     dXsub = preprocess_raw_video(sample_data_path, dim=36)
#     print('dXsub shape', dXsub.shape)

#     dXsub_len = (dXsub.shape[0] // frame_depth) * frame_depth
#     dXsub = dXsub[:dXsub_len, :, :, :]

#     model = MTTS_CAN(frame_depth, 32, 64, (img_rows, img_cols, 3))
#     model.load_weights(model_checkpoint)

#     yptest = model.predict((dXsub[:, :, :, :3], dXsub[:, :, :, -3:]), batch_size=batch_size, verbose=1)

#     # --- Pulse Signal Processing ---
#     pulse_pred = yptest[0]
#     pulse_pred = detrend(np.cumsum(pulse_pred), 100)
#     [b_pulse, a_pulse] = butter(1, [0.75 / fs * 2, 2.5 / fs * 2], btype='bandpass')
#     pulse_pred = scipy.signal.filtfilt(b_pulse, a_pulse, np.double(pulse_pred))

#     # --- Respiratory Signal Processing ---
#     resp_pred = yptest[1]
#     resp_pred = detrend(np.cumsum(resp_pred), 100)
#     [b_resp, a_resp] = butter(1, [0.08 / fs * 2, 0.5 / fs * 2], btype='bandpass')
#     resp_pred = scipy.signal.filtfilt(b_resp, a_resp, np.double(resp_pred))

#     # <<< ADDED CALCULATION FOR BOTH VITALS
#     bpm = calculate_bpm(pulse_pred, fs)
#     breaths = calculate_breaths_per_minute(resp_pred, fs)
    
#     print(f"\n=======================================")
#     print(f"✅ Estimated Heart Rate: {bpm:.2f} BPM")
#     print(f"✅ Estimated Breathing Rate: {breaths:.2f} Breaths/Minute")
#     print(f"========================================")

#     # --- Plotting ---
#     plt.subplot(211)
#     plt.plot(pulse_pred)
#     plt.title('Pulse Prediction')
#     plt.subplot(212)
#     plt.plot(resp_pred)
#     plt.title('Resp Prediction')
#     plt.show()


# if __name__ == "__main__":
#     parser = argparse.ArgumentParser()
#     parser.add_argument('--video_path', type=str, help='processed video path')
#     parser.add_argument('--sampling_rate', type=int, default = 30, help='sampling rate of your video')
#     parser.add_argument('--batch_size', type=int, default = 100, help='batch size (multiplier of 10)')
#     args = parser.parse_args()
#     predict_vitals(args)








# =================================================
# VERSION 4
# =================================================
import tensorflow as tf
import numpy as np
import scipy.io
import os
import sys
import argparse
sys.path.append('../')
from model import Attention_mask, MTTS_CAN
import h5py
import matplotlib.pyplot as plt
from scipy.signal import butter, welch
from inference_preprocess import preprocess_raw_video, detrend

def calculate_bpm(signal, fs=30):
    """Calculates the heart rate in BPM from a signal using Welch's method."""
    f, Pxx = welch(signal, fs, nperseg=len(signal))
    valid_indices = np.where((f >= 0.75) & (f <= 2.5))
    if len(Pxx[valid_indices]) == 0:
        return 0
    peak_index = np.argmax(Pxx[valid_indices])
    bpm = f[valid_indices][peak_index] * 60.0
    return bpm

def calculate_breaths_per_minute(signal, fs=30):
    """Calculates the respiratory rate in Breaths/Min from a signal."""
    f, Pxx = welch(signal, fs, nperseg=len(signal))
    valid_indices = np.where((f >= 0.08) & (f <= 0.5))
    if len(Pxx[valid_indices]) == 0:
        return 0
    peak_index = np.argmax(Pxx[valid_indices])
    breaths_per_min = f[valid_indices][peak_index] * 60.0
    return breaths_per_min

def save_predictions(save_path, pulse_signal, bpm, fs):
    """Saves the predictions in the same format as the ground truth files."""
    # Line 1: The predicted PPG signal (waveform)
    line1 = ' '.join([f'{x:.7e}' for x in pulse_signal])
    
    # Line 2: The calculated heart rate, repeated to match the length of the signal
    line2 = ' '.join([f'{bpm:.7e}' for _ in pulse_signal])
    
    # Line 3: A generated timestamp array
    timestamps = np.arange(len(pulse_signal)) / fs
    line3 = ' '.join([f'{x:.7e}' for x in timestamps])
    
    with open(save_path, 'w') as f:
        f.write(line1 + '\n')
        f.write(line2 + '\n')
        f.write(line3 + '\n')
    print(f"\n✅ Predictions saved to: {save_path}")

def predict_vitals(args):
    img_rows, img_cols, frame_depth = 36, 36, 10
    model_checkpoint = args.model_weights # Use argument for model path
    batch_size = args.batch_size
    fs = args.sampling_rate
    sample_data_path = args.video_path

    dXsub = preprocess_raw_video(sample_data_path, dim=36)
    print('dXsub shape', dXsub.shape)

    dXsub_len = (dXsub.shape[0] // frame_depth) * frame_depth
    dXsub = dXsub[:dXsub_len, :, :, :]

    model = MTTS_CAN(frame_depth, 32, 64, (img_rows, img_cols, 3))
    model.load_weights(model_checkpoint)

    yptest = model.predict((dXsub[:, :, :, :3], dXsub[:, :, :, -3:]), batch_size=batch_size, verbose=1)

    # --- Pulse Signal Processing ---
    pulse_pred = yptest[0]
    pulse_pred = detrend(np.cumsum(pulse_pred), 100)
    [b_pulse, a_pulse] = butter(1, [0.75 / fs * 2, 2.5 / fs * 2], btype='bandpass')
    pulse_pred = scipy.signal.filtfilt(b_pulse, a_pulse, np.double(pulse_pred))

    # --- Respiratory Signal Processing ---
    resp_pred = yptest[1]
    resp_pred = detrend(np.cumsum(resp_pred), 100)
    [b_resp, a_resp] = butter(1, [0.08 / fs * 2, 0.5 / fs * 2], btype='bandpass')
    resp_pred = scipy.signal.filtfilt(b_resp, a_resp, np.double(resp_pred))

    # --- Calculate Vitals ---
    bpm = calculate_bpm(pulse_pred, fs)
    breaths = calculate_breaths_per_minute(resp_pred, fs)
    
    print(f"\n========================================")
    print(f"✅ Estimated Heart Rate: {bpm:.2f} BPM")
    print(f"✅ Estimated Breathing Rate: {breaths:.2f} Breaths/Minute")
    print(f"========================================")

    # --- Save Prediction File ---
    video_filename = os.path.basename(sample_data_path)
    save_filename = os.path.splitext(video_filename)[0] + '_pred.txt'
    save_predictions(save_filename, pulse_pred, bpm, fs)

    # --- Plotting ---
    if not args.no_plot:
        plt.subplot(211)
        plt.plot(pulse_pred)
        plt.title('Pulse Prediction')
        plt.subplot(212)
        plt.plot(resp_pred)
        plt.title('Resp Prediction')
        plt.show()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--video_path', type=str, required=True, help='Path to the video file')
    parser.add_argument('--model_weights', type=str, default='./mtts_can.hdf5', help='Path to the .hdf5 model weights file')
    parser.add_argument('--sampling_rate', type=int, default=30, help='Sampling rate of the video')
    parser.add_argument('--batch_size', type=int, default=100, help='Batch size for prediction')
    parser.add_argument('--no_plot', action='store_true', help='Use this flag to disable showing the plot')
    args = parser.parse_args()
    predict_vitals(args)