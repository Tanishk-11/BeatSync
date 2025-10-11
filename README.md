# 💓 BeatSync: AI-Powered Contactless Vital Sign Monitoring & Health Assistant

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
## 🧠 Intelligent RAG Chatbot Integration

BeatSync now includes an integrated **Retrieval-Augmented Generation (RAG) chatbot**, designed to serve as a virtual health assistant specializing in **cardiology** and **psychiatry**.

The chatbot leverages advanced **LangChain**, **Groq**, and a **domain-specific knowledge base** to provide reliable, context-aware medical insights alongside real-time vital sign monitoring.

---

### ⚙️ Technical Overview

The RAG system operates in two main phases:

1. **Data Ingestion (Indexing)**

   * **Data Source:** Expert-curated cardiology and psychiatry books & papers.
   * **Loader:** PyPDFLoader for extracting high-quality text from PDFs.
   * **Chunking:** RecursiveCharacterTextSplitter for intelligent segmentation.
   * **Embeddings:** all-MiniLM-L6-v2 (Hugging Face) for semantic understanding.
   * **Vector Store:** FAISS for ultra-fast similarity search with local persistence.

2. **Retrieval & Generation (Inference)**

   * **LLM Engine:** Groq LPU™ accelerated inference with a large open-source model (e.g., Mixtral / Llama 3).
   * **LangChain Framework:** Implements create_retrieval_chain with history_aware_retriever for multi-turn context.
   * **Persona:** Expert cardiologist and psychiatrist, delivering empathetic and evidence-based answers.
   * **Knowledge Strategy:** Combines retrieved domain context with pretrained medical knowledge for synthesis and reasoning.

---

### 💡 Key Strengths

* ⚡ **Ultra-Low Latency:** Groq’s LPU engine delivers near-instant response times.
* 📚 **Domain Expertise:** Context drawn from specialized medical literature ensures reliability.
* 🗣️ **Conversational Memory:** history_aware_retriever maintains context across multiple user queries.
* 🧩 **Modular Architecture:** Can be embedded directly into the BeatSync web interface or used as an API endpoint.

---

### 🧩 Future Enhancements

* Implement **Maximal Marginal Relevance (MMR)** for diverse document retrieval.
* Add **RAG Evaluation** with metrics like Faithfulness, Answer Relevance, Context Recall, and Precision.
* Extend the dataset to include other domains (e.g., stress and sleep monitoring).
* Integrate chatbot responses into the **BeatSync dashboard**, enabling real-time physiological + conversational feedback.

---

### 🖥️ Example Interaction

👤 **User:** My heart rate seems to stay above 100 BPM even when resting. Should I be worried?

🤖 **BeatSync Assistant:**
A resting heart rate above 100 BPM may indicate tachycardia.
It can be caused by stress, dehydration, caffeine, or underlying cardiac issues.
If this persists or is accompanied by dizziness or chest pain,
you should consult a cardiologist for an ECG evaluation.

---

### 🔗 Integration in Repository

The RAG chatbot is included in the BeatSync GitHub repository under:


## ❤️ Acknowledgments

* **UBFC-rPPG Dataset** for providing benchmark ground-truth physiological data.
* **MTS-CAN architecture** (Yu et al., CVPR 2019) for multi-task vital sign estimation.
* **LangChain**, **Groq**, and the open-source AI community for enabling the RAG framework.


---

**Made with ❤️ by the BeatSync Team**
*Empowering accessible, contactless health monitoring for everyone.*

