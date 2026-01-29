```markdown
# ⚡ Electrical Load Forecasting using ANN  
### MATLAB Model → Python Deployment → Cloud Ready

![Python](https://img.shields.io/badge/Python-3.10-blue)
![Flask](https://img.shields.io/badge/Flask-API-green)
![MATLAB](https://img.shields.io/badge/MATLAB-ANN-orange)
![Status](https://img.shields.io/badge/Deployment-Ready-success)

---

## 📌 Project Overview

This project presents a complete end-to-end implementation of **Short Term Electrical Load Forecasting** using an Artificial Neural Network (ANN).

The ANN was:

- Trained and validated in **MATLAB** using Delhi SLDC hourly load data (2024)
- Converted into a **Python inference model** by extracting MATLAB network weights
- Deployed as a **real-time prediction API** using Flask
- Designed to be **Google Cloud ready**

The system predicts electrical load (in MW) based on:

- Temperature  
- Humidity  
- Day type (weekday / weekend)  
- Season (summer / monsoon / winter)  
- Date information  

---

## 🎯 Objective

To demonstrate how a research-level ANN model developed in MATLAB can be transformed into a **practical, deployable web application** for real-time load forecasting.

---

## 🧠 Stage 1 — ANN Development in MATLAB

Key steps:

- Data cleaning using **Moving Mean**
- Feature scaling using **custom normalization**
- Training with **Levenberg–Marquardt (LM)**
- Performance evaluation using:
  - MSE
  - Regression plots (R value)
  - Error histogram
  - Actual vs Predicted load graphs
- Optimal architecture: **2 hidden layers, 90 neurons each**

The trained network was exported and its weights were used for deployment.

---

## 🚀 Stage 2 — Python Deployment

The MATLAB ANN was recreated in Python using NumPy by loading the extracted weights.

### System Flow

```

User Input (Web Page)
↓
Flask API (Python)
↓
ANN Inference (MATLAB weights)
↓
Predicted Load (MW)

```

MATLAB is **not required** at runtime.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Model Training | MATLAB ANN Toolbox |
| Backend API | Python Flask |
| ANN Inference | NumPy (MATLAB weights) |
| Frontend | HTML, CSS, JavaScript |
| Deployment | Docker, Google Cloud Run |

---

## 📂 Project Structure

```

load-forecast-python/
│
├── app.py              # Flask backend
├── model.py            # ANN recreated from MATLAB weights
├── weights.mat         # Extracted ANN weights
├── requirements.txt
└── README.md

```

---

## ▶️ Running the Project Locally

### 1️⃣ Install dependencies

```

pip install -r requirements.txt

```

### 2️⃣ Run the server

```

python app.py

````

### 3️⃣ Test the API

POST → `http://127.0.0.1:5000/predict`

```json
{
 "temperature": 30,
 "humidity": 70,
 "daytype": "weekday",
 "season": "summer",
 "date": "2024-05-15"
}
````

Response:

```json
{
 "predicted_load": 6425.37
}
```

---

## ☁️ Cloud Deployment Ready

This project is containerized and can be deployed directly to:

* Docker
* Google Cloud Run

---

## 📊 Model Performance Indicators

* Low MSE
* High regression coefficient (R ≈ 0.97)
* Tight error distribution around zero
* Predicted load closely follows actual load

---

## 📎 Data Source

Delhi SLDC (State Load Dispatch Centre) hourly load data — 2024.

---

## 🔮 Future Scope

* Live weather API integration
* Historical dashboard
* Database logging
* Advanced ML models (LSTM, XGBoost)

---

## 👩‍💻 Authors

Electrical Engineering Students
Load Forecasting using ANN

---

### ⭐ This project bridges the gap between MATLAB research modeling and real-world ML deployment.

```
::contentReference[oaicite:0]{index=0}
```
