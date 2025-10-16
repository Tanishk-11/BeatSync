# import numpy as np
# import cv2
# from skimage.util import img_as_float
# import tensorflow as tf
# import matplotlib.pyplot as plt
# import time
# import scipy.io
# from scipy.sparse import spdiags

# def preprocess_raw_video(videoFilePath, dim=36):

#     #########################################################################
#     # set up
#     t = []
#     i = 0
#     vidObj = cv2.VideoCapture(videoFilePath);
#     totalFrames = int(vidObj.get(cv2.CAP_PROP_FRAME_COUNT)) # get total frame size
#     Xsub = np.zeros((totalFrames, dim, dim, 3), dtype = np.float32)
#     height = vidObj.get(cv2.CAP_PROP_FRAME_HEIGHT)
#     width = vidObj.get(cv2.CAP_PROP_FRAME_WIDTH)
#     success, img = vidObj.read()
#     dims = img.shape
#     print("Orignal Height", height)
#     print("Original width", width)
#     #########################################################################
#     # Crop each frame size into dim x dim
#     while success:
#         t.append(vidObj.get(cv2.CAP_PROP_POS_MSEC))# current timestamp in milisecond
#         vidLxL = cv2.resize(img_as_float(img[:, int(width/2)-int(height/2 + 1):int(height/2)+int(width/2), :]), (dim, dim), interpolation = cv2.INTER_AREA)
#         vidLxL = cv2.rotate(vidLxL, cv2.ROTATE_90_CLOCKWISE) # rotate 90 degree
#         vidLxL = cv2.cvtColor(vidLxL.astype('float32'), cv2.COLOR_BGR2RGB)
#         vidLxL[vidLxL > 1] = 1
#         vidLxL[vidLxL < (1/255)] = 1/255
#         Xsub[i, :, :, :] = vidLxL
#         success, img = vidObj.read() # read the next one
#         i = i + 1
#     plt.imshow(Xsub[0])
#     plt.title('Sample Preprocessed Frame')
#     plt.show()
#     #########################################################################
#     # Normalized Frames in the motion branch
#     normalized_len = len(t) - 1
#     dXsub = np.zeros((normalized_len, dim, dim, 3), dtype = np.float32)
#     for j in range(normalized_len - 1):
#         dXsub[j, :, :, :] = (Xsub[j+1, :, :, :] - Xsub[j, :, :, :]) / (Xsub[j+1, :, :, :] + Xsub[j, :, :, :])
#     dXsub = dXsub / np.std(dXsub)
#     #########################################################################
#     # Normalize raw frames in the apperance branch
#     Xsub = Xsub - np.mean(Xsub)
#     Xsub = Xsub  / np.std(Xsub)
#     Xsub = Xsub[:totalFrames-1, :, :, :]
#     #########################################################################
#     # Plot an example of data after preprocess
#     dXsub = np.concatenate((dXsub, Xsub), axis = 3);
#     return dXsub

# def detrend(signal, Lambda):
#     """detrend(signal, Lambda) -> filtered_signal
#     This function applies a detrending filter.
#     This code is based on the following article "An advanced detrending method with application
#     to HRV analysis". Tarvainen et al., IEEE Trans on Biomedical Engineering, 2002.
#     *Parameters*
#       ``signal`` (1d numpy array):
#         The signal where you want to remove the trend.
#       ``Lambda`` (int):
#         The smoothing parameter.
#     *Returns*
#       ``filtered_signal`` (1d numpy array):
#         The detrended signal.
#     """
#     signal_length = signal.shape[0]

#     # observation matrix
#     H = np.identity(signal_length)

#     # second-order difference matrix

#     ones = np.ones(signal_length)
#     minus_twos = -2 * np.ones(signal_length)
#     diags_data = np.array([ones, minus_twos, ones])
#     diags_index = np.array([0, 1, 2])
#     D = spdiags(diags_data, diags_index, (signal_length - 2), signal_length).toarray()
#     filtered_signal = np.dot((H - np.linalg.inv(H + (Lambda ** 2) * np.dot(D.T, D))), signal)
#     return filtered_signal










# import numpy as np
# import cv2
# import mediapipe as mp
# from scipy.sparse import spdiags
# import logging

# # Set up a logger
# logger = logging.getLogger(__name__)

# def detrend(signal, Lambda):
#     """Applies a detrending filter to a signal."""
#     signal_length = signal.shape[0]
#     H = np.identity(signal_length)
#     ones = np.ones(signal_length)
#     minus_twos = -2 * np.ones(signal_length)
#     diags_data = np.array([ones, minus_twos, ones])
#     diags_index = np.array([0, 1, 2])
#     D = spdiags(diags_data, diags_index, (signal_length - 2), signal_length).toarray()
#     filtered_signal = np.dot((H - np.linalg.inv(H + (Lambda ** 2) * np.dot(D.T, D))), signal)
#     return filtered_signal

# def preprocess_raw_video(video_path, dim=36):
#     """
#     Preprocesses a video to extract the forehead region using MediaPipe.
#     This version completely replaces the need for dlib.
#     """
#     # --- 1. SETUP MEDIAPIPE ---
#     mp_face_mesh = mp.solutions.face_mesh
#     face_mesh = mp_face_mesh.FaceMesh(
#         static_image_mode=False,
#         max_num_faces=1,
#         min_detection_confidence=0.5
#     )

#     # --- 2. VIDEO CAPTURE SETUP ---
#     vidObj = cv2.VideoCapture(video_path)
#     if not vidObj.isOpened():
#         raise IOError(f"Cannot open video file: {video_path}")
    
#     total_frames = int(vidObj.get(cv2.CAP_PROP_FRAME_COUNT))
#     logger.info(f"Total frames in video: {total_frames}")

#     # --- 3. FRAME-BY-FRAME PROCESSING ---
#     all_forehead_rois = []
#     frames_processed = 0

#     while True:
#         success, frame = vidObj.read()
#         if not success:
#             break
        
#         frames_processed += 1
        
#         # Convert the BGR image to RGB.
#         rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
#         # Process the frame and find face landmarks.
#         results = face_mesh.process(rgb_frame)

#         if results.multi_face_landmarks:
#             # Assume only one face.
#             face_landmarks = results.multi_face_landmarks[0]
            
#             # --- 4. EXTRACT FOREHEAD REGION ---
#             # Using specific MediaPipe landmark indices for the forehead
#             # Index 10 is roughly the top of the nose bridge.
#             # We will create a bounding box above this point.
            
#             # Get landmark coordinates (normalized 0-1, so we multiply by frame dimensions)
#             h, w, _ = frame.shape
            
#             # We'll define the forehead ROI based on a few key points.
#             # A common approach is to use points on the eyebrows and above.
#             # E.g., Landmark 105 (right), 334 (left), 10 (center-ish top)
#             p1 = face_landmarks.landmark[105]
#             p2 = face_landmarks.landmark[334]
#             p_top = face_landmarks.landmark[10]
            
#             x1 = int(p1.x * w)
#             y1 = int(p1.y * h)
#             x2 = int(p2.x * w)
#             y2 = int(p_top.y * h)
            
#             # Add some padding to get a good region
#             padding_y = 15
#             padding_x = 10
            
#             y_start = max(0, y2 - padding_y)
#             y_end = min(h, y1 + padding_y)
#             x_start = min(x1, x2) - padding_x
#             x_end = max(x1, x2) + padding_x

#             # Crop the forehead
#             forehead_roi = frame[y_start:y_end, x_start:x_end]

#             if forehead_roi.size > 0:
#                 # Resize to the dimension required by the model (36x36)
#                 resized_roi = cv2.resize(forehead_roi, (dim, dim), interpolation=cv2.INTER_AREA)
#                 all_forehead_rois.append(resized_roi)

#     vidObj.release()
#     face_mesh.close()
    
#     if not all_forehead_rois:
#         raise ValueError("Could not detect a face or forehead in any frame of the video.")
    
#     logger.info(f"Successfully extracted forehead ROI from {len(all_forehead_rois)} frames.")

#     # --- 5. POST-PROCESSING FOR THE MODEL ---
#     Xsub = np.array(all_forehead_rois, dtype=np.float32) / 255.0
    
#     # Calculate motion stream (temporal difference)
#     dXsub = np.diff(Xsub, axis=0)
#     dXsub = np.concatenate((dXsub, np.zeros((1, dim, dim, 3), dtype=np.float32)), axis=0)
#     dXsub = (dXsub - np.mean(dXsub)) / np.std(dXsub)

#     # Normalize appearance stream
#     Xsub = (Xsub - np.mean(Xsub)) / np.std(Xsub)

#     # Combine motion and appearance streams as expected by the model
#     # Note: The original code seems to expect 6 channels, but the model input shapes
#     # suggest two separate inputs of 3 channels each. We will create the 6-channel
#     # array as per the original preprocessing logic.
#     dXsub = np.concatenate((dXsub, Xsub), axis=3)
    
#     return dXsub





# import cv2
# import numpy as np
# import mediapipe as mp
# from skimage.transform import resize
# import logging

# # Set up a logger
# logger = logging.getLogger(__name__)

# def preprocess_video_for_inference(video_path, target_size=(36, 36)):
#     """
#     Preprocesses a video by detecting and cropping faces using MediaPipe,
#     then calculates the normalized motion differences for model inference.
#     This is a direct replacement for the previous dlib-based approach.
#     """
    
#     # --- 1. SETUP MEDIAPIPE ---
#     # Use the lightweight and efficient Face Detection model
#     mp_face_detection = mp.solutions.face_detection
#     face_detection = mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.5)

#     # --- 2. VIDEO CAPTURE AND SETUP ---
#     cap = cv2.VideoCapture(video_path)
#     if not cap.isOpened():
#         raise ValueError(f"Error: Could not open video file: {video_path}")

#     cropped_frames = []
#     total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
#     logger.info(f"Total frames to process: {total_frames}")

#     # --- 3. FRAME-BY-FRAME PROCESSING ---
#     while cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             break

#         # Convert the BGR image to RGB for MediaPipe
#         rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
#         # Process the frame to detect faces
#         results = face_detection.process(rgb_frame)

#         if results.detections:
#             # Get the bounding box of the first detected face
#             detection = results.detections[0]
#             bboxC = detection.location_data.relative_bounding_box
#             ih, iw, _ = frame.shape
            
#             # Calculate absolute coordinates
#             x, y, w, h = int(bboxC.xmin * iw), int(bboxC.ymin * ih), \
#                          int(bboxC.width * iw), int(bboxC.height * ih)
            
#             # Ensure coordinates are valid
#             x, y, w, h = max(0, x), max(0, y), max(0, w), max(0, h)
            
#             face = frame[y:y+h, x:x+w]
            
#             if face.size > 0:
#                 # Resize face to the target dimension (e.g., 36x36)
#                 resized_face = resize(face, target_size, anti_aliasing=True)
#                 # Append all three color channels
#                 cropped_frames.append(resized_face)
        
#     cap.release()
#     face_detection.close()

#     if not cropped_frames:
#         raise ValueError("Could not detect a face in any frame of the video.")

#     logger.info(f"Successfully extracted face crops from {len(cropped_frames)} frames.")

#     # --- 4. CORE POST-PROCESSING LOGIC (UNCHANGED) ---
#     Xsub = np.array(cropped_frames, dtype=np.float32)
    
#     # Normalize Appearance Stream
#     Xsub = (Xsub - np.mean(Xsub)) / np.std(Xsub)

#     # Calculate Motion Stream (Temporal Difference)
#     dXsub = np.diff(Xsub, axis=0)
#     # Pad the last frame to maintain original length
#     dXsub = np.concatenate((dXsub, np.zeros((1, target_size[0], target_size[1], 3), dtype=np.float32)), axis=0)
#     # Normalize Motion Stream
#     dXsub = (dXsub - np.mean(dXsub)) / np.std(dXsub)

#     # Combine streams into a 6-channel array as required by the model
#     final_input = np.concatenate((dXsub, Xsub), axis=3)
    
#     return final_input

import cv2
import numpy as np
import mediapipe as mp
from skimage.transform import resize
import logging

logger = logging.getLogger(__name__)

def preprocess_video_for_inference(video_path, target_size=(36, 36)):
    mp_face_detection = mp.solutions.face_detection
    face_detection = mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.5)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Error: Could not open video file: {video_path}")

    cropped_frames = []
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_detection.process(rgb_frame)

        if results.detections:
            detection = results.detections[0]
            bboxC = detection.location_data.relative_bounding_box
            ih, iw, _ = frame.shape
            
            x, y, w, h = int(bboxC.xmin * iw), int(bboxC.ymin * ih), \
                         int(bboxC.width * iw), int(bboxC.height * ih)
            
            x, y, w, h = max(0, x), max(0, y), max(0, w), max(0, h)
            
            face = frame[y:y+h, x:x+w]
            
            if face.size > 0:
                resized_face = resize(face, target_size, anti_aliasing=True)
                cropped_frames.append(resized_face)
        
    cap.release()
    face_detection.close()

    if not cropped_frames:
        raise ValueError("Could not detect a face in any frame of the video.")

    Xsub = np.array(cropped_frames, dtype=np.float32)
    
    Xsub = (Xsub - np.mean(Xsub)) / np.std(Xsub)

    dXsub = np.diff(Xsub, axis=0)
    dXsub = np.concatenate((dXsub, np.zeros((1, target_size[0], target_size[1], 3), dtype=np.float32)), axis=0)
    dXsub = (dXsub - np.mean(dXsub)) / np.std(dXsub)

    final_input = np.concatenate((dXsub, Xsub), axis=3)
    
    return final_input
