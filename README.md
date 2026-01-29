**Electrical Load Forecasting using ANN**
**From MATLAB Model to Python Deployment**

---

### Project Overview

This project presents an end-to-end implementation of short-term electrical load forecasting using an Artificial Neural Network (ANN).

The ANN was trained and validated in MATLAB using hourly load data of Delhi obtained from the SLDC website for the year 2024. The trained network was then converted into a Python-based inference model by extracting the MATLAB network weights. This model is deployed as a real-time prediction API using Flask and is designed to be easily deployable on cloud platforms such as Google Cloud Run.

The system predicts electrical load in megawatts based on temperature, humidity, day type, season, and date information.

---

### Objective

The primary objective of this project is to demonstrate how an ANN model developed for research purposes in MATLAB can be transformed into a practical and deployable web-based application for real-time load forecasting.

---

### Stage 1 – ANN Development in MATLAB

The ANN model was developed using MATLAB’s Neural Network Toolbox. The dataset was first processed using the moving mean technique to remove noise and handle missing values. All input features were normalized using specific scaling factors to ensure uniformity during training.

The network was trained using the Levenberg–Marquardt algorithm. Model performance was evaluated using Mean Squared Error, regression analysis, error histograms, and actual versus predicted load plots. After testing multiple configurations, the optimal architecture was identified as two hidden layers with 90 neurons each.

The trained network was saved, and its weights were extracted for deployment.

---

### Stage 2 – Python Deployment

The MATLAB ANN was recreated in Python using NumPy by loading the extracted weights. This allows the model to run independently without requiring MATLAB during execution.

**System Flow**

User inputs from the web interface are sent to the Flask API. The backend normalizes these inputs and passes them to the Python-based ANN. The ANN processes the inputs and returns the predicted load in megawatts.

MATLAB is not required during runtime.

---

### Technology Stack

* Model Training: MATLAB ANN Toolbox
* Backend API: Python Flask
* ANN Inference: NumPy using MATLAB weights
* Frontend: HTML, CSS, JavaScript
* Deployment: Docker and Google Cloud Run

---

### Project Structure

The project directory contains the Flask backend file (`app.py`), the Python ANN file (`model.py`), the extracted MATLAB weights file (`weights.mat`), the requirements file, and the README.

---

### Running the Project Locally

Install the required Python libraries using the requirements file. Run the Flask server using `app.py`. Send a POST request to the `/predict` endpoint with temperature, humidity, day type, season, and date as inputs. The API returns the predicted load in megawatts.

---

### Data Source

Delhi SLDC hourly load data for the year 2024.

---

### Future Scope

The system can be further enhanced by integrating live weather data, developing a dashboard for visualization, storing prediction history in a database, and upgrading to advanced machine learning models such as LSTM or XGBoost.

---

This project demonstrates how MATLAB-based research modeling can be effectively translated into a practical, real-world machine learning application.
