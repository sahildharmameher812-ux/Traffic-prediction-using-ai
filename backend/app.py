from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import joblib
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# ─── Load Models ───────────────────────────────────────────────────────────
print("Loading models...")
traffic_model    = tf.keras.models.load_model('models/traffic_lstm_model.keras')
departure_model  = joblib.load('models/departure_rf_model.pkl')
parking_model    = joblib.load('models/parking_xgboost_model.pkl')
user_model       = joblib.load('models/user_behavior_rf_model.pkl')
print("✅ All models loaded!")

# ─── Load Data for Scaler ──────────────────────────────────────────────────
df_traffic = pd.read_csv('data/india_traffic_volume.csv')
df_traffic['date_time'] = pd.to_datetime(df_traffic['date_time'])
df_traffic['hour']       = df_traffic['date_time'].dt.hour
df_traffic['day']        = df_traffic['date_time'].dt.dayofweek
df_traffic['month']      = df_traffic['date_time'].dt.month
df_traffic['is_weekend']  = df_traffic['day'].apply(lambda x: 1 if x >= 5 else 0)
df_traffic['is_rush_hour']= df_traffic['hour'].apply(lambda x: 1 if x in [8,9,10,17,18,19,20] else 0)
df_traffic = df_traffic.drop(['date_time','holiday','weather_main','weather_description','road_name'], axis=1)

scaler = MinMaxScaler()
scaler.fit(df_traffic)

# ─── Route 1: Home ─────────────────────────────────────────────────────────
@app.route('/')
def home():
    return jsonify({"message": "✅ Winner API Running!", "status": "ok"})

# ─── Route 2: Traffic Prediction ───────────────────────────────────────────
@app.route('/predict/traffic', methods=['POST'])
def predict_traffic():
    try:
        data = request.json
        hour       = int(data.get('hour', 9))
        day        = int(data.get('day', 0))
        month      = int(data.get('month', 6))
        temp       = float(data.get('temp', 303))
        rain       = float(data.get('rain', 0))
        clouds     = int(data.get('clouds', 50))
        is_weekend  = 1 if day >= 5 else 0
        is_rush     = 1 if hour in [8,9,10,17,18,19,20] else 0

        input_row = np.array([[temp, rain, 0.0, clouds, hour, day, month, is_weekend, is_rush]])
        input_scaled = scaler.transform(input_row)
        input_seq = np.tile(input_scaled, (24, 1)).reshape(1, 24, input_scaled.shape[1])

        pred_scaled = traffic_model.predict(input_seq)[0][0]

        # Reverse scale traffic_volume
        dummy = np.zeros((1, input_scaled.shape[1]))
        col_idx = df_traffic.columns.get_loc('traffic_volume')
        dummy[0, col_idx] = pred_scaled
        pred_actual = scaler.inverse_transform(dummy)[0][col_idx]

        if pred_actual > 5000:
            level = "Very High 🔴"
        elif pred_actual > 3500:
            level = "High 🟠"
        elif pred_actual > 2000:
            level = "Medium 🟡"
        else:
            level = "Low 🟢"

        return jsonify({
            "predicted_volume": round(float(pred_actual), 0),
            "congestion_level": level,
            "hour": hour,
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "failed"}), 500

# ─── Route 3: Departure Planning ───────────────────────────────────────────
@app.route('/predict/departure', methods=['POST'])
def predict_departure():
    try:
        data = request.json
        hour         = int(data.get('hour', 9))
        weekday      = int(data.get('weekday', 0))
        month        = int(data.get('month', 6))
        origin       = int(data.get('origin', 0))
        destination  = int(data.get('destination', 1))
        travel_time  = int(data.get('travel_time', 45))
        delay        = int(data.get('delay', 15))
        is_raining   = int(data.get('is_raining', 0))
        rec_hour     = int(data.get('recommended_hour', hour))

        input_data = np.array([[weekday, month, origin, destination,
                                 travel_time, delay, is_raining, hour, rec_hour]])

        pred = departure_model.predict(input_data)[0]
        congestion_map = {0: "Low 🟢", 1: "Medium 🟡", 2: "High 🟠", 3: "Very High 🔴"}
        congestion = congestion_map.get(int(pred), "Medium 🟡")

        if int(pred) >= 2:
            rec_time = f"{(hour-1)%24:02d}:00"
            advice = "Pehle niklo! Traffic zyada hoga!"
        else:
            rec_time = f"{hour:02d}:00"
            advice = "Ye time theek hai nikalne ke liye!"

        return jsonify({
            "congestion_level": congestion,
            "recommended_time": rec_time,
            "advice": advice,
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "failed"}), 500

# ─── Route 4: Parking Prediction ───────────────────────────────────────────
@app.route('/predict/parking', methods=['POST'])
def predict_parking():
    try:
        data = request.json
        parking_lot     = int(data.get('parking_lot', 0))
        area            = int(data.get('area', 0))
        total_capacity  = int(data.get('total_capacity', 500))
        occupied        = int(data.get('occupied', 300))
        available       = total_capacity - occupied
        occupancy_pct   = round((occupied / total_capacity) * 100, 1)
        price_per_hour  = int(data.get('price_per_hour', 40))
        lat             = float(data.get('lat', 19.07))
        lng             = float(data.get('lng', 72.87))
        hour            = int(data.get('hour', 10))
        minute          = int(data.get('minute', 0))
        day             = int(data.get('day', 0))
        month           = int(data.get('month', 6))

        input_data = np.array([[parking_lot, area, total_capacity, occupied,
                                 available, occupancy_pct, price_per_hour,
                                 lat, lng, hour, minute, day, month]])

        pred = parking_model.predict(input_data)[0]
        status_map = {0: "Available 🟢", 1: "Full 🔴"}
        status = status_map.get(int(pred), "Available 🟢")

        return jsonify({
            "parking_status": status,
            "available_spots": available,
            "occupancy_percentage": occupancy_pct,
            "price_per_hour": price_per_hour,
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "failed"}), 500

# ─── Route 5: User Behavior ─────────────────────────────────────────────────
@app.route('/predict/user', methods=['POST'])
def predict_user():
    try:
        data = request.json
        origin          = int(data.get('origin', 0))
        destination     = int(data.get('destination', 1))
        actual_travel   = int(data.get('actual_travel', 45))
        used_parking    = int(data.get('used_parking', 1))
        parking_pref    = int(data.get('parking_pref', 0))
        satisfaction    = int(data.get('satisfaction', 4))
        avg_rating      = float(data.get('avg_rating', 4.0))
        hour            = int(data.get('hour', 9))
        day             = int(data.get('day', 0))
        month           = int(data.get('month', 6))

        input_data = np.array([[origin, destination, actual_travel,
                                 used_parking, parking_pref, satisfaction,
                                 avg_rating, hour, day, month]])

        pred = user_model.predict(input_data)[0]
        mode_map = {0: "Auto 🛺", 1: "Bike 🏍️", 2: "Car 🚗", 3: "Train+Auto 🚂"}
        recommended_mode = mode_map.get(int(pred), "Car 🚗")

        return jsonify({
            "recommended_transport": recommended_mode,
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "failed"}), 500

# ─── Run ───────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, port=5000)