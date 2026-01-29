Electrical Load Forecasting using ANN
MATLAB Model to Python Deployment to Cloud Ready

Project Overview

This project presents a complete end-to-end implementation of short term electrical load forecasting using an Artificial Neural Network (ANN).

The ANN was trained and validated in MATLAB using Delhi SLDC hourly load data for the year 2024. The trained model was then converted into a Python-based inference model by extracting the MATLAB network weights. This model was deployed as a real-time prediction API using Flask and is designed to be cloud ready for deployment on platforms such as Google Cloud Run.

The system predicts electrical load in megawatts based on temperature, humidity, day type, season, and date information.

Objective

The objective of this project is to demonstrate how a research-level ANN model developed in MATLAB can be transformed into a practical, deployable web application for real-time load forecasting.

Stage 1 – ANN Development in MATLAB

The ANN model was developed using MATLAB’s Neural Network Toolbox. The dataset was first cleaned using the moving mean technique to remove noise and missing values. All input features were normalized using custom scaling factors to bring them into a comparable range.

The network was trained using the Levenberg–Marquardt algorithm. Model performance was evaluated using Mean Squared Error, regression plots, error histograms, and actual versus predicted load graphs. After testing different configurations, the optimal architecture was found to be two hidden layers with 90 neurons each.

The trained network was saved and its weights were extracted for deployment.

Stage 2 – Python Deployment

The MATLAB ANN was recreated in Python using NumPy by loading the extracted weights. This allows the model to run without requiring MATLAB during execution.

System Flow

User input from the web page is sent to the Flask API. The Flask backend normalizes the inputs and passes them to the Python ANN. The ANN processes the inputs and returns the predicted load in megawatts.

MATLAB is not required during runtime.

Technology Stack

Model Training: MATLAB ANN Toolbox
Backend API: Python Flask
ANN Inference: NumPy using MATLAB weights
Frontend: HTML, CSS, JavaScript
Deployment: Docker and Google Cloud Run

Project Structure

The project folder contains the Flask backend file app.py, the Python ANN file model.py, the extracted MATLAB weights file weights.mat, the requirements file, and the README.

Running the Project Locally

Install the required Python libraries using the requirements file. Run the Flask server using the app.py file. Send a POST request to the predict endpoint with temperature, humidity, day type, season, and date as inputs. The API returns the predicted load in megawatts.

Data Source

Delhi SLDC hourly load data for the year 2024.

Future Scope

The system can be extended by integrating a live weather API, building a dashboard to visualize predictions, storing predictions in a database, and upgrading to more advanced machine learning models such as LSTM or XGBoost.

This project demonstrates how MATLAB research modeling can be successfully converted into a real-world deployable machine learning application.
