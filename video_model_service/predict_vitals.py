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
import numpy as np
# Correctly import 'filtfilt' from scipy.signal
from scipy.signal import butter, welch, filtfilt
import tensorflow as tf
import logging

# Local imports from other files in this service
from model import MTTS_CAN
from inference_preprocess import preprocess_raw_video, detrend

# Set up a logger
logger = logging.getLogger(__name__)

def calculate_hr(pxx, f, fs=30):
    """
    Calculates the heart rate from the Power Spectral Density (PSD) of a signal.
    """
    f_hr_min = 0.75  # 45 bpm
    f_hr_max = 2.5   # 150 bpm
    
    valid_indices = np.where((f >= f_hr_min) & (f <= f_hr_max))[0]
    if len(valid_indices) == 0:
        logger.warning("No valid frequency peak found for heart rate.")
        return 0.0

    peak_index = np.argmax(pxx[valid_indices])
    bpm = f[valid_indices][peak_index] * 60.0
    return bpm

def calculate_br(pxx, f, fs=30):
    """
    Calculates the breathing rate from the Power Spectral Density (PSD) of a signal.
    """
    f_br_min = 0.17  # ~10 breaths/min
    f_br_max = 0.5   # 30 breaths/min
    
    valid_indices = np.where((f >= f_br_min) & (f <= f_br_max))[0]
    if len(valid_indices) == 0:
        logger.warning("No valid frequency peak found for breathing rate.")
        return 0.0

    peak_index = np.argmax(pxx[valid_indices])
    breaths_per_min = f[valid_indices][peak_index] * 60.0
    return breaths_per_min

def predict_vitals(video_path, model_weights="finetuned_full_dataset_v3.hdf5", fs=30, batch_size=100):
    """
    Main function to predict vital signs from a video path.
    """
    img_rows, img_cols, frame_depth = 36, 36, 10

    logger.info(f"Preprocessing video: {video_path}")
    try:
        dXsub = preprocess_raw_video(video_path, dim=36)
    except Exception as e:
        logger.error(f"Error during preprocessing: {e}")
        raise ValueError(f"Preprocessing failed: {e}")

    if dXsub.shape[0] < frame_depth:
        raise ValueError("Video is too short or no faces were found.")
        
    dXsub_len = (dXsub.shape[0] // frame_depth) * frame_depth
    dXsub = dXsub[:dXsub_len, :, :, :]

    logger.info(f"Loading model weights from {model_weights}")
    model = MTTS_CAN(frame_depth, 32, 64, (img_rows, img_cols, 3))
    try:
        model.load_weights(model_weights)
    except Exception as e:
        logger.error(f"Failed to load model weights: {e}")
        raise IOError(f"Could not load model weights file: {model_weights}")

    logger.info("Running model prediction...")
    yptest = model.predict((dXsub[:, :, :, :3], dXsub[:, :, :, -3:]), batch_size=batch_size, verbose=0)
    
    pulse_pred_raw = yptest[0]
    
    logger.info("Post-processing the predicted signal...")
    pulse_pred = detrend(np.cumsum(pulse_pred_raw), 100)
    
    [b, a] = butter(1, [0.75 / fs * 2, 2.5 / fs * 2], btype='bandpass')
    
    # --- THIS IS THE CORRECTED LINE ---
    # Use filtfilt from scipy.signal, not tf.signal
    pulse_pred = filtfilt(b, a, pulse_pred.flatten())

    f, pxx = welch(pulse_pred, fs=fs, nperseg=256, nfft=2048)
    
    bpm = calculate_hr(pxx, f, fs)
    breaths_per_min = calculate_br(pxx, f, fs)
    
    logger.info(f"Calculated Vitals - BPM: {bpm:.2f}, Breaths/min: {breaths_per_min:.2f}")

    return {
        "heart_rate": round(bpm, 2),
        "breathing_rate": round(breaths_per_min, 2)
    }

