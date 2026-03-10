#  AI-Driven Predictive Urban Navigation & Mobility Optimization System

> **Horizon 1.0 Hackathon** | Vidyavardhini College of Engineering & Technology, Palghar  
> **Domain:** AI / ML

---

## 📌 Problem Statement

Urban commuters in metropolitan cities such as **Mumbai** face significant challenges due to:
- Unpredictable traffic congestion
- Inefficient departure planning
- Difficulty in locating available parking spaces

Existing navigation platforms primarily rely on **real-time traffic monitoring** and short-term route recommendations. They often lack the ability to **proactively forecast future congestion patterns** or assist users in planning optimal departure times for upcoming trips.

---

## 💡 Our Solution

An **AI-powered predictive urban navigation system** that leverages historical traffic patterns and machine learning models to forecast traffic conditions in advance.

The user simply enters:
1. 📍 **Origin** (kahan se?)
2. 🎯 **Destination** (kahan jaana hai?)
3. ⏰ **Arrival Time** (kitne baje pohchna hai?)

And the system automatically provides:
- 🚦 **Traffic forecast** at destination time
- 🕐 **Smart departure time** recommendation
- 🅿️ **Parking availability** at destination
- 🚗 **Best transport mode** based on travel behavior

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│              (frontend/index.html)                       │
│                                                          │
│   Origin ──► Destination ──► Arrival Time               │
│                     │                                    │
│            "AI Se Plan Karo" Button                      │
└─────────────────────┬───────────────────────────────────┘
                      │  HTTP POST (fetch API)
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  FLASK BACKEND                           │
│               (backend/app.py)                           │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │ /predict/    │  │ /predict/    │                     │
│  │  traffic     │  │  departure   │                     │
│  └──────┬───────┘  └──────┬───────┘                     │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │ /predict/    │  │ /predict/    │                     │
│  │  parking     │  │  user        │                     │
│  └──────┬───────┘  └──────┬───────┘                     │
└─────────┼─────────────────┼───────────────────────────-─┘
          │                 │
          ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│                   ML MODELS LAYER                        │
│                                                          │
│  traffic_lstm_model.keras   →  LSTM Neural Network       │
│  departure_rf_model.pkl     →  Random Forest             │
│  parking_xgboost_model.pkl  →  XGBoost Classifier        │
│  user_behavior_rf_model.pkl →  Random Forest             │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                            │
│                                                          │
│  india_traffic_volume.csv      (48,000 rows)             │
│  india_departure_planning.csv  (20,000 rows)             │
│  india_parking_data.csv        (35,000 rows)             │
│  india_user_behavior.csv       (40,000 rows)             │
└─────────────────────────────────────────────────────────┘
```

---

## 🤖 ML Models Used

| # | Model | Algorithm | Purpose | File |
|---|-------|-----------|---------|------|
| 1 | **Traffic Forecaster** | LSTM Neural Network | Predicts future traffic volume at destination based on time & weather | `traffic_lstm_model.keras` |
| 2 | **Departure Planner** | Random Forest Classifier | Suggests optimal departure time based on congestion patterns | `departure_rf_model.pkl` |
| 3 | **Parking Intelligence** | XGBoost Classifier | Predicts parking availability at destination | `parking_xgboost_model.pkl` |
| 4 | **User Behavior** | Random Forest Classifier | Recommends best transport mode based on travel habits | `user_behavior_rf_model.pkl` |

---

## 📊 Model Evaluation Metrics

### Model 1 — Traffic Forecasting (LSTM)
| Metric | Score |
|--------|-------|
| **MAE (Mean Absolute Error)** | **0.0780** |
| Architecture | 2-layer LSTM + Dropout |
| Input Sequence | 24 time steps |
| Optimizer | Adam |
| Loss Function | MSE |

> ⚠️ **Note:** LSTM is a **Regression model** (predicts a number = traffic volume).
> Regression models do NOT have accuracy % — they use MAE/MSE/RMSE instead.
> **MAE: 0.078** on normalized scale means predictions are very close to actual values.
> Lower MAE = Better prediction. 0.078 is excellent for traffic forecasting.

---

### Model 2 — Departure Planning (Random Forest)
| Metric | Score |
|--------|-------|
| **Accuracy** | **70.75%** |
| Precision (weighted avg) | 0.77 |
| Recall (weighted avg) | 0.71 |
| F1-Score (weighted avg) | 0.70 |
| n_estimators | 100 |
| max_depth | 10 |

**Classification Report:**
```
              precision  recall  f1-score
Low     (0)     0.63      0.61     0.62
Medium  (1)     0.98      0.56     0.71
High    (2)     0.65      1.00     0.79
V.High  (3)     0.51      0.54     0.52

accuracy                          0.71
```

**Top Features:** delay_mins, travel_time_mins, recommended_hour, departure_hour, weekday

---

### Model 3 — Parking Intelligence (XGBoost)
| Metric | Score |
|--------|-------|
| **Accuracy** | **100%** |
| Precision | 1.00 |
| Recall | 1.00 |
| F1-Score | 1.00 |
| n_estimators | 100 |
| max_depth | 6 |
| learning_rate | 0.1 |

**Classification Report:**
```
                  precision  recall  f1-score  support
Available  (0)      1.00      1.00     1.00     6579
Full       (1)      1.00      1.00     1.00      421

accuracy                               1.00     7000
macro avg           1.00      1.00     1.00     7000
weighted avg        1.00      1.00     1.00     7000
```

**Top Feature:** `available_spots` (importance score: 1.0)

> Both classes (Available/Full) predicted with perfect precision and recall.

---

### Model 4 — User Behavior (Random Forest)
| Metric | Score |
|--------|-------|
| **Accuracy** | **86.82%** |
| Precision (weighted avg) | 0.90 |
| Recall (weighted avg) | 0.87 |
| F1-Score (weighted avg) | 0.86 |
| n_estimators | 100 |
| max_depth | 10 |

**Classification Report:**
```
              precision  recall  f1-score
Auto    (0)     0.95      0.58     0.72
Bike    (1)     0.69      0.98     0.81
Car     (2)     1.00      1.00     1.00
Train   (3)     0.92      0.57     0.71

accuracy                          0.87
```

**Top Features:** used_parking, avg_rating, parking_preference, origin, destination

---

## 🔄 Data Pipeline

```
RAW DATA GENERATION
        │
        ▼
┌───────────────────┐
│  Synthetic Data   │  ← Mumbai-specific patterns
│  Generator        │     Indian holidays, monsoon
│  (Python script)  │     Real road names, malls
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  4 CSV Datasets   │
│  143,000+ rows    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Preprocessing    │  ← Label Encoding
│                   │     DateTime feature extraction
│                   │     MinMax Scaling (LSTM)
│                   │     Train/Test Split (80/20)
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Model Training   │  ← Google Colab (GPU)
│                   │     LSTM: 10 epochs
│                   │     RF/XGB: 100 estimators
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Saved Models     │  ← .keras format (LSTM)
│                   │     .pkl format (RF, XGB)
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Flask API        │  ← 4 prediction endpoints
│  (localhost:5000) │     CORS enabled
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Frontend UI      │  ← Single page HTML
│  (index.html)     │     3 inputs → 4 results
└───────────────────┘
```

---

## 📦 Datasets

| Dataset | Rows | Key Columns | Source |
|---------|------|-------------|--------|
| `india_traffic_volume.csv` | 48,000 | date_time, traffic_volume, weather, road_name | Synthetic (Mumbai-based) |
| `india_departure_planning.csv` | 20,000 | origin, destination, congestion_level, travel_time | Synthetic (Mumbai routes) |
| `india_parking_data.csv` | 35,000 | parking_lot_name, available_spots, occupancy_pct | Synthetic (Mumbai malls) |
| `india_user_behavior.csv` | 40,000 | user_id, transport_mode, avg_rating, route | Synthetic (1000 users) |

### Why Synthetic Data?
Real Mumbai traffic data is not publicly available (paid APIs like Google Maps, TomTom). Our synthetic data is generated using **real domain knowledge**:
- Mumbai rush hours: 8–10 AM, 5–8 PM
- Monsoon pattern: June–September (rain impact)
- Indian holidays: Diwali, Holi, Ganesh Chaturthi, Eid, Independence Day
- Real Mumbai roads: Western Express Highway, LBS Marg, JVLR, NH-48
- Real Mumbai parking: BKC Complex, Phoenix Palladium, Inorbit Mall, Oberoi Mall

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
|-----------|-------|
| HTML5 | Structure |
| CSS3 | Styling (dark theme, responsive) |
| Vanilla JavaScript | API calls, DOM manipulation |

### Backend
| Technology | Usage |
|-----------|-------|
| Python 3.13 | Core language |
| Flask | REST API framework |
| Flask-CORS | Cross-origin requests |

### Machine Learning
| Library | Usage |
|---------|-------|
| TensorFlow / Keras | LSTM model training & inference |
| Scikit-learn | Random Forest, preprocessing, metrics |
| XGBoost | Gradient boosting for parking prediction |
| Pandas | Data manipulation |
| NumPy | Numerical computations |
| Joblib | Model serialization (.pkl) |

### Development Tools
| Tool | Usage |
|------|-------|
| Google Colab | Model training (free GPU) |
| VS Code | Backend & frontend development |
| Git | Version control |

---

## 📁 Project Structure

```
Winner/
│
├── backend/
│   ├── models/
│   │   ├── traffic_lstm_model.keras      ← LSTM Model
│   │   ├── departure_rf_model.pkl        ← Random Forest
│   │   ├── parking_xgboost_model.pkl     ← XGBoost
│   │   └── user_behavior_rf_model.pkl    ← Random Forest
│   │
│   ├── data/
│   │   ├── india_traffic_volume.csv
│   │   ├── india_departure_planning.csv
│   │   ├── india_parking_data.csv
│   │   └── india_user_behavior.csv
│   │
│   ├── app.py                            ← Flask API Server
│   └── requirements.txt
│
└── frontend/
    └── index.html                        ← Single Page UI
```

---

## 🚀 How to Run

### Step 1 — Clone the repository
```bash
git clone https://github.com/yourusername/Winner.git
cd Winner/backend
```

### Step 2 — Install dependencies
```bash
pip install -r requirements.txt
```

### Step 3 — Start the backend
```bash
python app.py
```
Expected output:
```
Loading models...
✅ All models loaded!
* Running on http://127.0.0.1:5000
```

### Step 4 — Open the frontend
```
Open Winner/frontend/index.html in your browser
```

### Step 5 — Use the app
```
1. Select Origin       → e.g. Andheri
2. Select Destination  → e.g. BKC
3. Enter Arrival Time  → e.g. 09:00
4. Click "AI Se Plan Karo"
5. Get instant predictions!
```

---

## 🎯 API Endpoints

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| `/` | GET | - | API status |
| `/predict/traffic` | POST | hour, day, month, temp, rain, clouds | traffic_volume, congestion_level |
| `/predict/departure` | POST | hour, weekday, origin, destination, travel_time | congestion_level, recommended_time, advice |
| `/predict/parking` | POST | parking_lot, capacity, occupied, hour | parking_status, available_spots |
| `/predict/user` | POST | origin, destination, travel_time, hour | recommended_transport |

---

## 🔮 Future Scope

- Integrate **real-time Mumbai Traffic Police API**
- Add **Google Maps API** for live traffic data
- Deploy on **cloud (AWS/GCP)** for public access
- Expand to **other Indian cities** (Delhi, Bangalore, Pune)
- Add **IoT sensor integration** for real-time parking
- Build **mobile app** (React Native / Flutter)
- Add **voice assistant** support

---

## 👥 Team

> Vidyavardhini College of Engineering & Technology  
> K.T. Marg, Vasai Road (West), Dist. Palghar – 401202, Maharashtra  
> **Horizon 1.0 Hackathon** | Domain: AI/ML

---

## 📄 License

This project was built for **Horizon 1.0 Hackathon** at Vidyavardhini College of Engineering & Technology.

---

## 🙏 Mentoring & Key Learnings

### The Problem Before Mentoring
Initially, the project was built using **heavy pre-trained models** such as large transformer-based architectures. While these models are powerful, they caused significant issues:
- 🐌 **Extremely slow inference** — predictions took too long to load
- 💾 **High memory usage** — models were too large for local deployment
- ⚙️ **Over-engineering** — unnecessarily complex for our use case
- 🔥 **System lag** — the entire application became unresponsive

### The Turning Point — Mentoring Session
During the **Horizon 1.0 mentoring session**, our mentors pointed out that:
> *"For time-series traffic data, a well-trained LSTM model is far more efficient and accurate than a heavy pre-trained transformer. Train your own model on your specific data."*

This was a game-changer. Following their advice, we:
1. Replaced heavy pre-trained models with a **custom-trained LSTM** for traffic forecasting
2. Used **Random Forest** and **XGBoost** — lightweight yet powerful for tabular data
3. Trained all models on our **Mumbai-specific dataset**
4. Achieved excellent results with **minimal compute and fast inference**

### Results After Mentoring
| Before Mentoring | After Mentoring |
|-----------------|-----------------|
| Heavy pre-trained models | Lightweight custom models |
| Slow & laggy application | Fast real-time predictions |
| Generic predictions | Mumbai-specific accurate results |
| High memory usage | Optimized for local deployment |

### Key Takeaway
> **"Never miss a mentoring session."**
> The right guidance at the right time can completely transform your approach.
> Our mentors helped us go from a bloated, slow system to a clean, efficient, and accurate AI pipeline.

---