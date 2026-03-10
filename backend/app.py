from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import joblib
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import warnings
import requests
import os
from dotenv import load_dotenv

load_dotenv()
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
ROUTE_API_KEY   = os.getenv('ROUTE_API_KEY')

# ─── Load Models ───────────────────────────────────────────────────────────
print("Loading models...")
traffic_model   = tf.keras.models.load_model('models/traffic_lstm_model.keras')
departure_model = joblib.load('models/departure_rf_model.pkl')
parking_model   = joblib.load('models/parking_xgboost_model.pkl')
user_model      = joblib.load('models/user_behavior_rf_model.pkl')
print("All models loaded!")

# ─── Load Data for Scaler ──────────────────────────────────────────────────
df_traffic = pd.read_csv('data/india_traffic_volume.csv')
df_traffic['date_time']    = pd.to_datetime(df_traffic['date_time'])
df_traffic['hour']         = df_traffic['date_time'].dt.hour
df_traffic['day']          = df_traffic['date_time'].dt.dayofweek
df_traffic['month']        = df_traffic['date_time'].dt.month
df_traffic['is_weekend']   = df_traffic['day'].apply(lambda x: 1 if x >= 5 else 0)
df_traffic['is_rush_hour'] = df_traffic['hour'].apply(lambda x: 1 if x in [8,9,10,17,18,19,20] else 0)

# Drop only columns that actually exist
drop_cols = [c for c in ['date_time','holiday','weather_main','weather_description','road_name'] if c in df_traffic.columns]
df_traffic = df_traffic.drop(columns=drop_cols)

# Save exact column order — critical for scaler
TRAFFIC_COLS = list(df_traffic.columns)
print(f"Traffic columns ({len(TRAFFIC_COLS)}): {TRAFFIC_COLS}")

scaler = MinMaxScaler()
scaler.fit(df_traffic)

# ─── Route 1: Home ─────────────────────────────────────────────────────────
@app.route('/')
def home():
    return jsonify({"message": "Winner API Running!", "status": "ok", "columns": TRAFFIC_COLS})

# ─── Route 2: Traffic Prediction ───────────────────────────────────────────
@app.route('/predict/traffic', methods=['POST'])
def predict_traffic():
    try:
        data       = request.json
        hour       = int(data.get('hour', 9))
        day        = int(data.get('day', 0))
        month      = int(data.get('month', 6))
        temp       = float(data.get('temp', 303))
        rain       = float(data.get('rain', 0))
        clouds     = int(data.get('clouds', 50))
        is_weekend = 1 if day >= 5 else 0
        is_rush    = 1 if hour in [8,9,10,17,18,19,20] else 0

        # Build input row matching exact column order from CSV
        col_vals = {
            'traffic_volume': 0,
            'temp':           temp,
            'rain_1h':        rain,
            'snow_1h':        0.0,
            'clouds_all':     clouds,
            'hour':           hour,
            'day':            day,
            'month':          month,
            'is_weekend':     is_weekend,
            'is_rush_hour':   is_rush,
        }

        # Build row in exact TRAFFIC_COLS order
        row = [col_vals.get(c, 0) for c in TRAFFIC_COLS]
        input_row    = np.array([row])
        input_scaled = scaler.transform(input_row)
        input_seq    = np.tile(input_scaled, (24, 1)).reshape(1, 24, input_scaled.shape[1])
        pred_scaled  = traffic_model.predict(input_seq)[0][0]

        # Reverse scale only traffic_volume column
        dummy = np.zeros((1, len(TRAFFIC_COLS)))
        col_idx = TRAFFIC_COLS.index('traffic_volume')
        dummy[0, col_idx] = pred_scaled
        pred_actual = scaler.inverse_transform(dummy)[0][col_idx]

        if pred_actual > 5000:   level = "Very High"
        elif pred_actual > 3500: level = "High"
        elif pred_actual > 2000: level = "Medium"
        else:                    level = "Low"

        return jsonify({
            "predicted_volume": round(float(pred_actual), 0),
            "congestion_level": level,
            "hour": hour,
            "status": "success"
        })
    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "trace": traceback.format_exc(), "status": "failed"}), 500

# ─── Route 3: Departure Planning ───────────────────────────────────────────
@app.route('/predict/departure', methods=['POST'])
def predict_departure():
    try:
        data        = request.json
        hour        = int(data.get('hour', 9))
        weekday     = int(data.get('weekday', 0))
        month       = int(data.get('month', 6))
        origin      = int(data.get('origin', 0))
        destination = int(data.get('destination', 1))
        travel_time = int(data.get('travel_time', 45))
        delay       = int(data.get('delay', 15))
        is_raining  = int(data.get('is_raining', 0))
        rec_hour    = int(data.get('recommended_hour', hour))

        input_data = np.array([[weekday, month, origin, destination,
                                travel_time, delay, is_raining, hour, rec_hour]])
        pred           = departure_model.predict(input_data)[0]
        congestion_map = {0:"Low", 1:"Medium", 2:"High", 3:"Very High"}
        congestion     = congestion_map.get(int(pred), "Medium")

        if int(pred) >= 2:
            rec_time = f"{(hour-1)%24:02d}:00"
            advice   = "Pehle niklo! Traffic zyada hoga!"
        else:
            rec_time = f"{hour:02d}:00"
            advice   = "Ye time theek hai nikalne ke liye!"

        return jsonify({
            "congestion_level": congestion,
            "recommended_time": rec_time,
            "advice": advice,
            "status": "success"
        })
    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "trace": traceback.format_exc(), "status": "failed"}), 500

# ─── Route 4: Parking Prediction ───────────────────────────────────────────
@app.route('/predict/parking', methods=['POST'])
def predict_parking():
    try:
        data           = request.json
        parking_lot    = int(data.get('parking_lot', 0))
        area           = int(data.get('area', 0))
        total_capacity = int(data.get('total_capacity', 500))
        occupied       = int(data.get('occupied', 300))
        available      = total_capacity - occupied
        occupancy_pct  = round((occupied / total_capacity) * 100, 1)
        price_per_hour = int(data.get('price_per_hour', 40))
        lat            = float(data.get('lat', 19.07))
        lng            = float(data.get('lng', 72.87))
        hour           = int(data.get('hour', 10))
        minute         = int(data.get('minute', 0))
        day            = int(data.get('day', 0))
        month          = int(data.get('month', 6))

        input_data = np.array([[parking_lot, area, total_capacity, occupied,
                                available, occupancy_pct, price_per_hour,
                                lat, lng, hour, minute, day, month]])
        pred       = parking_model.predict(input_data)[0]
        status_map = {0:"Available", 1:"Full"}
        status     = status_map.get(int(pred), "Available")

        return jsonify({
            "parking_status":      status,
            "available_spots":     available,
            "occupancy_percentage": occupancy_pct,
            "price_per_hour":      price_per_hour,
            "status": "success"
        })
    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "trace": traceback.format_exc(), "status": "failed"}), 500

# ─── Route 5: User Behavior ─────────────────────────────────────────────────
@app.route('/predict/user', methods=['POST'])
def predict_user():
    try:
        data          = request.json
        origin        = int(data.get('origin', 0))
        destination   = int(data.get('destination', 1))
        actual_travel = int(data.get('actual_travel', 45))
        used_parking  = int(data.get('used_parking', 1))
        parking_pref  = int(data.get('parking_pref', 0))
        satisfaction  = int(data.get('satisfaction', 4))
        avg_rating    = float(data.get('avg_rating', 4.0))
        hour          = int(data.get('hour', 9))
        day           = int(data.get('day', 0))
        month         = int(data.get('month', 6))

        input_data = np.array([[origin, destination, actual_travel,
                                used_parking, parking_pref, satisfaction,
                                avg_rating, hour, day, month]])
        pred     = user_model.predict(input_data)[0]
        mode_map = {0:"Auto", 1:"Bike", 2:"Car", 3:"Train+Auto"}
        recommended_mode = mode_map.get(int(pred), "Car")

        return jsonify({
            "recommended_transport": recommended_mode,
            "status": "success"
        })
    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "trace": traceback.format_exc(), "status": "failed"}), 500

# ─── Route 6: Weather API ──────────────────────────────────────────────────
@app.route('/api/weather', methods=['GET'])
def get_weather():
    try:
        city = request.args.get('city', 'Mumbai')
        url  = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
        res  = requests.get(url, timeout=10)
        data = res.json()

        if res.status_code != 200:
            return jsonify({"error": data.get("message", "City not found"), "status": "failed"}), 400

        return jsonify({
            "city":        data["name"],
            "country":     data["sys"]["country"],
            "temp":        data["main"]["temp"],
            "feels_like":  data["main"]["feels_like"],
            "humidity":    data["main"]["humidity"],
            "description": data["weather"][0]["description"].capitalize(),
            "icon":        data["weather"][0]["icon"],
            "wind_speed":  data["wind"]["speed"],
            "visibility":  data.get("visibility", 0) // 1000,
            "status":      "success"
        })
    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "trace": traceback.format_exc(), "status": "failed"}), 500

# ─── Route 7: Best Route API ───────────────────────────────────────────────
@app.route('/api/route', methods=['GET'])
def get_route():
    try:
        origin      = request.args.get('origin', 'Mumbai')
        destination = request.args.get('destination', 'Pune')

        def geocode(place):
            url = f"https://api.openrouteservice.org/geocode/search?api_key={ROUTE_API_KEY}&text={place}&size=1"
            r   = requests.get(url, timeout=10)
            d   = r.json()
            return d['features'][0]['geometry']['coordinates']  # [lng, lat]

        origin_coords = geocode(origin)
        dest_coords   = geocode(destination)

        route_url  = "https://api.openrouteservice.org/v2/directions/driving-car"
        route_body = {"coordinates": [origin_coords, dest_coords]}
        headers    = {"Authorization": ROUTE_API_KEY, "Content-Type": "application/json"}

        route_res  = requests.post(route_url, json=route_body, headers=headers, timeout=15)
        route_data = route_res.json()

        summary  = route_data['routes'][0]['summary']
        segments = route_data['routes'][0]['segments'][0]['steps']
        steps    = [{"instruction": s['instruction'], "distance": round(s['distance']/1000, 2)} for s in segments[:10]]

        return jsonify({
            "origin":       origin,
            "destination":  destination,
            "distance_km":  round(summary['distance'] / 1000, 2),
            "duration_min": round(summary['duration'] / 60, 1),
            "steps":        steps,
            "status":       "success"
        })
    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "trace": traceback.format_exc(), "status": "failed"}), 500

# ─── Run ───────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, port=5000)