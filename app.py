from datetime import datetime
import random
import time
import matlab.engine
import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

# -----------------------------
# Flask App Init
# -----------------------------
app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static"
)
CORS(app)

# -----------------------------
# Start MATLAB Engine (ONCE)
# -----------------------------
try:
    eng = matlab.engine.start_matlab()
    eng.addpath(r'D:\load_forecasting\matlab', nargout=0)
    print("MATLAB Engine started successfully")
except Exception as e:
    print("MATLAB Engine failed:", e)
    eng = None


# -----------------------------
# HOME ROUTE → FRONTEND
# -----------------------------
@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")


# -----------------------------
# HEALTH CHECK (FOR NGROK / JUDGES)
# -----------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "OK",
        "backend": "Flask",
        "model": "ANN (MATLAB)",
        "time": datetime.now().isoformat()
    })


# -----------------------------
# PREDICTION API
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    if eng is None:
        return jsonify({"error": "MATLAB engine not running"}), 500

    try:
        data = request.get_json(force=True)

        # ---------- Inputs ----------
        temperature = float(data["temperature"])
        humidity = float(data["humidity"])
        daytype = data["daytype"]
        season = data["season"]
        date_str = data["date"]

        # ---------- Date parsing (future dates allowed) ----------
        # Future-date inputs are treated as scenario-based short-term forecasting:
        # same ANN + normalization as training; we only interpret them as "what-if" forecasts.
        forecast_date = datetime.strptime(date_str, "%Y-%m-%d").date()

        # ---------- Normalization ----------
        date_norm = forecast_date.day / 10.0
        month_norm = forecast_date.month / 20.0
        temp_norm = temperature / 50.0
        hum_norm = humidity / 100.0

        weekend = 1 if daytype == "weekend" else 0
        weekday = 1 if daytype == "weekday" else 0

        summer = 1 if season == "summer" else 0
        monsoon = 1 if season == "monsoon" else 0
        winter = 1 if season == "winter" else 0

        extra_flag = 1  # same as training

        # ---------- Input Vector ----------
        x = matlab.double([
            [date_norm],
            [month_norm],
            [temp_norm],
            [hum_norm],
            [weekend],
            [weekday],
            [summer],
            [monsoon],
            [winter],
            [extra_flag]
        ])

        # ---------- ANN Prediction ----------
        y = float(eng.predict_load(x))

        # ---------- Convert to MW ----------
        BASE_LOAD = 3500
        mw = BASE_LOAD + y * 20000

        # Clamp (Delhi realistic range)
        mw = max(3000, min(mw, 9000))

        return jsonify({
            "predicted_load": round(mw, 2),
            "unit": "MW"
        })

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": "Prediction failed"}), 500


# -----------------------------
# LIVE LOAD (FOR CHART)
# -----------------------------
@app.route("/live-load", methods=["GET"])
def live_load():
    base_load = 6500
    variation = random.randint(-300, 300)

    return jsonify({
        "load_mw": base_load + variation,
        "time": datetime.now().strftime("%H:%M:%S")
    })


# -----------------------------
# LIVE WEATHER (DELHI) – Open-Meteo API (free, no API key)
# -----------------------------
_live_weather_cache = {"data": None, "ts": 0}
_LIVE_WEATHER_CACHE_SEC = 60
_OPEN_METEO_URL = (
    "https://api.open-meteo.com/v1/forecast"
    "?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m"
)


@app.route("/live-weather", methods=["GET"])
def live_weather():
    """Fetch current temperature (°C) and humidity (%) for Delhi from Open-Meteo.
    No API key required. Returns error JSON on failure."""
    now = time.time()
    if _live_weather_cache["data"] is not None and (now - _live_weather_cache["ts"]) < _LIVE_WEATHER_CACHE_SEC:
        return jsonify(_live_weather_cache["data"])

    try:
        r = requests.get(_OPEN_METEO_URL, timeout=10)
        r.raise_for_status()
        j = r.json()
        cur = j.get("current") or {}
        temp = float(cur["temperature_2m"])
        humidity = float(cur["relative_humidity_2m"])
        out = {
            "temperature": round(temp, 2),
            "humidity": round(humidity, 2),
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        }
        _live_weather_cache["data"] = out
        _live_weather_cache["ts"] = now
        return jsonify(out)
    except requests.exceptions.RequestException:
        return jsonify({"error": "Weather API request failed"}), 502
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "Weather API response invalid"}), 502


# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
