# BeatSync
BeatSync: AI-Powered Contactless Vital Sign Monitoring
An innovative web application that leverages state-of-the-art deep learning to measure heart rate and respiration rate in real-time using just a standard webcam.

🌟 Overview
BeatSync is a "Tech for Good" project designed to democratize access to basic health monitoring. Cardiovascular diseases are the leading cause of death globally, yet millions lack access to simple screening tools. BeatSync addresses this by transforming any device with a camera into a powerful vital sign monitor. Our system uses a sophisticated AI pipeline to analyze subtle, imperceptible color changes in the user's face (remote Photoplethysmography or rPPG) to provide accurate, real-time physiological data.

✨ Key Features
Real-Time Vitals: Measures Heart Rate (BPM) and Respiration Rate (RR) from a live video stream.

Contactless & Accessible: No special hardware required—works with any standard webcam.

State-of-the-Art AI: Powered by the MTS-CAN (Multi-Task Temporal Shift Attention Network) model for high accuracy and robustness.

Anomaly Detection: An integrated LSTM Autoencoder identifies irregular heart patterns that simple BPM counters would miss.

User-Friendly Interface: A clean and intuitive web dashboard built with Flask and Chart.js for visualizing data.

⚙️ How It Works: The Technical Pipeline
Our system employs a sophisticated end-to-end pipeline to convert raw video pixels into accurate vital signs.

Video Input & Face Detection: The application captures the webcam feed in the browser. A lightweight face detection model identifies key facial regions of interest (ROIs).

rPPG Signal Extraction: The raw pulse signal is extracted by analyzing the average color changes (specifically in the green channel) within the ROIs for each frame.

Signal Processing: The raw signal is normalized and processed to reduce noise from motion and lighting changes.

AI Model Inference (MTS-CAN): The clean signal is fed into our core MTS-CAN model, which uses an Attention Mechanism to focus on the true cardiac signal and a Multi-Task head to simultaneously predict both Heart Rate and Respiration Rate.

Anomaly Detection (LSTM Autoencoder): In parallel, the signal is analyzed by an LSTM Autoencoder trained on normal heart rhythms to detect and flag any abnormal patterns.

Real-Time Visualization: The predicted vitals are streamed back to the user's dashboard and visualized in real-time.

🚀 Technology Stack
Backend: Python, Flask

Frontend: HTML, CSS, JavaScript, Chart.js

AI / Deep Learning: PyTorch, OpenCV, NumPy, SciPy

Core AI Model: MTS-CAN (Multi-Task Temporal Shift Attention Network)

Anomaly Detection Model: LSTM Autoencoder

🔧 Setup and Installation
Follow these steps to get BeatSync running on your local machine.

Prerequisites
Python 3.9+

pip (Python package installer)

Installation
Clone the repository:

git clone [https://github.com/Tanishk-11/BeatSync.git](https://github.com/Tanishk-11/BeatSync.git)
cd BeatSync

Create and activate a virtual environment (recommended):

# For Windows
python -m venv venv
.\venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate

Install the required dependencies:

pip install -r requirements.txt
