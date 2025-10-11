# 💓 BeatSync: AI-Powered Contactless Vital Sign Monitoring

An innovative web application that leverages state-of-the-art deep learning to measure **heart rate** and **respiration rate** in real time using just a standard webcam.

---

## 🌟 Overview

**BeatSync** is a "Tech for Good" project designed to democratize access to basic health monitoring.  
Cardiovascular diseases are the leading cause of death globally, yet millions lack access to simple screening tools.  
BeatSync addresses this by transforming any device with a camera into a powerful **vital sign monitor**.

Our system uses a sophisticated AI pipeline to analyze subtle, imperceptible color changes in the user’s face  
(remote Photoplethysmography or **rPPG**) to provide accurate, real-time physiological data.

---

## ✨ Key Features

- 🫀 **Real-Time Vitals:** Measures Heart Rate (BPM) and Respiration Rate (RR) from a live video stream.  
- 📸 **Contactless & Accessible:** Works with any standard webcam—no special hardware required.  
- 🧠 **State-of-the-Art AI:** Powered by the **MTS-CAN (Multi-Task Temporal Shift Attention Network)** for high accuracy and robustness.  
- ⚠️ **Anomaly Detection:** Integrated **LSTM Autoencoder** identifies irregular heart patterns that simple BPM counters miss.  
- 💻 **User-Friendly Interface:** Clean and intuitive Flask-based dashboard with **Chart.js** for real-time data visualization.

---

## ⚙️ How It Works: The Technical Pipeline

Our system employs a sophisticated end-to-end pipeline to convert raw video pixels into accurate vital signs:

1. **Video Input & Face Detection:**  
   Captures webcam feed and detects facial regions of interest (ROIs).

2. **rPPG Signal Extraction:**  
   Analyzes subtle color changes in the **green channel** to extract the raw pulse signal.

3. **Signal Processing:**  
   Filters and normalizes the signal to reduce noise from motion and lighting.

4. **AI Model Inference (MTS-CAN):**  
   Uses temporal attention to isolate true cardiac signals and jointly predicts **HR** and **RR**.

5. **Anomaly Detection (LSTM Autoencoder):**  
   Flags irregular heart rhythms based on reconstruction error from a trained LSTM autoencoder.

6. **Real-Time Visualization:**  
   Predicted vitals are streamed and visualized live on the web dashboard.
<img width="1290" height="462" alt="image" src="https://github.com/user-attachments/assets/3d7c383b-4d8f-4d52-9eda-e167eda92554" />

flowchart credits: Xin Liu, Josh Fromm, Shwetak Patel, Daniel McDuff, “Multi-Task Temporal Shift Attention Networks for On-Device Contactless Vitals Measurement”, NeurIPS 2020

---
## 🔧 Setup and Installation

Follow these steps to get **BeatSync** running on your local machine.

### 🧩 Prerequisites

- Python 3.9+
- pip (Python package installer)

---

### ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/Tanishk-11/BeatSync.git
cd BeatSync
```
Create and activate a virtual environment (recommended):

Windows
```bash
python -m venv venv
.\venv\Scripts\activate
```

macOS / Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```
