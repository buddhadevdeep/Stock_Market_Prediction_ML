# Stock Market Prediction System
**College Machine Learning Project — Standard Operating Procedure (SOP) Implementation**

> **Academic Disclaimer:** *This project is developed exclusively for educational and academic purposes. Stock market predictions are non-deterministic, and this system does not provide financial advice or guarantee future stock prices. Predictions are for educational purposes only and are not financial advice.*

---

## 1. Project Overview & Problem Statement

Financial markets represent complex, highly dynamic, non-stationary time-series systems. The objective of this college ML project is to build an end-to-end, multi-tier web application that ingests real-time and historical National Stock Exchange of India (NSE) equity data to predict:

1. **Tomorrow's High Price** (Supervised Regression)
2. **Tomorrow's Low Price** (Supervised Regression)
3. **Tomorrow's Expected Range** ($\text{Range} = \text{Predicted High} - \text{Predicted Low}$)
4. **Market Direction** (Binary Classification: `BULLISH` vs. `BEARISH`)
5. **Trading Signal** (Multiclass Classification: `BUY`, `HOLD`, `SELL`)

---

## 2. Six-Phase SOP Architecture

```
                 Yahoo Finance (yfinance API)
                             │
                             ▼
                    Historical OHLCV Data
                             │
                             ▼
               Phase 1: Dataset Exploration & EDA
                             │
                             ▼
          Phase 2: Cleaning & Feature Engineering
               (SMA, Volatility, Momentum, Ratios)
                             │
                             ▼
          Target Creation: shift(-1) [Zero-Leakage]
                             │
                             ▼
            Chronological 80/20 Train/Test Split
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
      Phase 3: Baseline              Phase 3: Custom Tree
   Linear Regression (High/Low)    Decision Tree (Gini from Scratch)
            │                                 │
            ▼                                 ▼
   Phase 5: Random Forest         Phase 5: Random Forest
          Regressor                         Classifier
            │                                 │
            └────────────────┬────────────────┘
                             ▼
          Phase 4: Comprehensive Model Evaluation
           (MAE, RMSE, R², Accuracy, Precision, F1)
                             │
                             ▼
               Python ML Microservice (Flask)
                             │
                             ▼
                 Express.js Backend API
                             │
                             ▼
                  MongoDB Atlas Database
                             │
                             ▼
           Phase 6: React + Vite + Recharts Dashboard
```

---

## 3. Technology Stack

- **Frontend:** React 19, Vite, JavaScript, Recharts, Lucide Icons, Vanilla CSS
- **Backend:** Node.js, Express.js, Mongoose (MongoDB Atlas ODM), Axios, Dotenv, CORS
- **Machine Learning Microservice:** Python 3.13, Flask, Flask-CORS, Pandas, NumPy, Scikit-Learn, Joblib, yfinance, XGBoost
- **Database:** MongoDB Atlas (with graceful local memory fallback when credentials are not configured)
- **Data Source:** Yahoo Finance (`yfinance`) with dynamic `.NS` NSE ticker normalization

---

## 4. Phase Breakdown & ML Methodology

### Phase 1: Problem Definition and Dataset Exploration
- **100% Dynamic Stock Resolution:** Users can input **ANY stock symbol** on the fly (e.g. `TATAPOWER`, `SBIN`, `WIPRO`, `TITAN`, `TATASTEEL`, `ADANIENT`, `MARUTI`, `AAPL`, `MSFT`, `TSLA`, `NVDA`, `RELIANCE`, `TCS`, `INFY`).
- The system automatically resolves exchange suffixes (`.NS` for NSE, `.BO` for BSE, or raw global tickers for US/international equities), downloads live historical data via `yfinance`, fits the feature engineering pipeline, trains models, and yields predictions in real-time.
- Structural analysis: Shape, Column Types, Missing Value matrix, Descriptive Statistics ($N$, Mean, Std, Quartiles).
- Trend exploration: Historical price graph, 120-day candlestick/line chart, and volume bar graphs.

### Phase 2: Data Cleaning & Feature Engineering
- Imputation of empty and zero values; removal of non-trading calendar anomalies.
- **Strict Data Leakage Rule:** Target variables are created strictly using backwards shift (`shift(-1)`), and the final uncompleted row is dropped.
- **Engineered Technical Features (Zero Lookahead Bias):**
  - **Returns:** `daily_return`, `return_3d`, `return_5d`, `return_10d`
  - **Moving Averages:** `SMA_5`, `SMA_10`, `SMA_20`, `SMA_50`
  - **Volatility:** `volatility_5`, `volatility_10`, `volatility_20` (rolling standard deviation of returns)
  - **Intraday Relationships:** `high_low_ratio`, `close_open_ratio`, `price_range`
  - **Volume & Momentum:** `volume_change`, `momentum_5`, `momentum_10`

### Phase 3: Model Creation & Manual Implementation
- **Baseline Regression:** Ordinary Least Squares (OLS) Linear Regression for Tomorrow's High and Low.
- **Manual Decision Tree Classifier (Built from scratch in `custom_decision_tree.py`):**
  - Implemented **without** using `sklearn.tree.DecisionTreeClassifier`.
  - Employs **Gini Impurity** for optimal recursive split selection.

#### Mathematical Foundation of Gini Impurity
For a subset $D$ containing $C$ classes:
$$\text{Gini}(D) = 1 - \sum_{i=1}^C (p_i)^2$$
Where $p_i$ is the empirical probability of class $i$.

For a candidate split dividing dataset $D$ into $D_{\text{left}}$ and $D_{\text{right}}$ on feature $j$ and threshold $t$:
$$\text{Gini}_{\text{split}} = \frac{|D_{\text{left}}|}{|D|} \text{Gini}(D_{\text{left}}) + \frac{|D_{\text{right}}|}{|D|} \text{Gini}(D_{\text{right}})$$
The algorithm greedily selects $(j, t)$ that minimizes $\text{Gini}_{\text{split}}$.

#### Why Decision Tree with Gini was Selected for Phase 3:
1. **Handles Non-Linearity:** Stock price changes exhibit non-linear interactions between volume, momentum, and moving average spreads.
2. **Transparent Interpretability:** Generates human-readable decision rules (ideal for college viva and demonstration).
3. **No Mandatory Scaling:** Decision trees are monotonic and invariant to feature scaling.
4. **Academic Compliance:** Perfectly demonstrates from-scratch implementation of tree construction, recursion, and leaf probability estimation.

### Phase 4: Model Evaluation & Diagnostics
- **Regression Metrics:**
  - $\text{MAE} = \frac{1}{N} \sum |y_i - \hat{y}_i|$
  - $\text{MSE} = \frac{1}{N} \sum (y_i - \hat{y}_i)^2$
  - $\text{RMSE} = \sqrt{\text{MSE}}$
  - $R^2 = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$
- **Classification Metrics:**
  - Accuracy, Weighted Precision, Weighted Recall, F1 Score
  - Confusion Matrix ($2 \times 2$ for Direction, $3 \times 3$ for Signals)
- **Overfitting / Underfitting Diagnostics:** Compares train vs test score gaps to ensure models generalize to unseen regimes.

### Phase 5: Advanced Model Training
- **Random Forest Regressor & Classifier:** Ensemble of $B=100$ bootstrap-aggregated trees with random feature sub-sampling to reduce variance and mitigate single-tree overfitting.
- **Chronological TimeSeriesSplit Cross-Validation:** Forward expanding window validation ensuring models are never trained on future data.

### Phase 6: Visualization
- Recharts interactive dashboards rendering historical prices, moving average ribbons, volume bars, model comparison metric tables, feature importances, and decision tree rule previews.

---

## 5. Supervised Classification Target Definitions

### A. Market Direction
$$\text{Direction} = \begin{cases} \text{BULLISH} (1), & \text{if } \text{Close}_{t+1} > \text{Close}_t \\ \text{BEARISH} (0), & \text{otherwise} \end{cases}$$

### B. Trading Signal (Supervised Academic Rules)
$$\text{Return}_{t+1} = \frac{\text{Close}_{t+1} - \text{Close}_t}{\text{Close}_t}$$

$$\text{Signal} = \begin{cases} \text{BUY} (1), & \text{if } \text{Return}_{t+1} \ge +1.0\% \\ \text{SELL} (2), & \text{if } \text{Return}_{t+1} \le -1.0\% \\ \text{HOLD} (0), & \text{otherwise} \end{cases}$$

---

## 6. Project Folder Structure

```
ML-PROJECT/
├── backend/                        # Node.js + Express.js API
│   ├── config/
│   │   └── db.js                   # MongoDB Atlas Mongoose connection
│   ├── controllers/
│   │   ├── stockController.js      # Ingestion & exploration endpoints
│   │   ├── predictionController.js # Live inference & persistence
│   │   ├── modelController.js      # Model training & results
│   │   └── historyController.js    # Prediction history queries
│   ├── middleware/
│   │   └── errorHandler.js         # User-friendly error handler
│   ├── models/
│   │   ├── Prediction.js           # Prediction schema
│   │   ├── StockSearch.js          # Search log schema
│   │   └── ModelResult.js          # Model metrics schema
│   ├── routes/
│   │   ├── stockRoutes.js
│   │   ├── predictionRoutes.js
│   │   ├── modelRoutes.js
│   │   └── historyRoutes.js
│   ├── services/
│   │   └── mlService.js            # Axios client to Python ML service
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Express server entry point
│
├── frontend/                       # React 19 + Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── DisclaimerBanner.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── PriceCard.jsx
│   │   │   ├── PredictionCard.jsx
│   │   │   ├── DirectionCard.jsx
│   │   │   ├── SignalCard.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   └── StatusCards.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Real-time search & predictions
│   │   │   ├── Analysis.jsx        # Phase 1 & 2 Exploration & EDA
│   │   │   ├── ModelEvaluation.jsx # Phase 4 & 5 Metrics & Confusion Matrices
│   │   │   ├── Training.jsx        # Phase 3 & 5 Retraining engine
│   │   │   └── History.jsx         # Saved prediction queries
│   │   ├── services/
│   │   │   └── api.js              # Axios frontend HTTP service
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── ml_service/                     # Python Machine Learning Microservice
│   ├── app.py                      # Flask REST API
│   ├── data_loader.py              # yfinance downloader & local cache
│   ├── preprocessing.py            # Feature engineering & zero-leakage split
│   ├── custom_decision_tree.py     # Manual Gini Decision Tree from scratch
│   ├── regression.py               # Linear Regression & Random Forest
│   ├── classification.py           # Custom Tree & RF Classifier
│   ├── evaluation.py               # Regression & classification metrics
│   ├── model_manager.py            # Orchestrator & Joblib persistence
│   └── requirements.txt
│
├── notebooks/                      # College SOP Jupyter Notebooks
│   ├── phase_1.ipynb               # Problem Definition & Dataset Exploration
│   ├── phase_2.ipynb               # Data Cleaning & Feature Engineering
│   ├── phase_3.ipynb               # Model Creation & Manual Decision Tree
│   ├── phase_4.ipynb               # Model Evaluation & Diagnostics
│   ├── phase_5.ipynb               # Advanced Random Forest & TimeSeriesSplit
│   └── phase_6.ipynb               # Visualization & Metric Comparison
│
├── data/                           # Historical CSV backups
├── models/                         # Serialized .pkl artifacts (Joblib)
├── README.md
└── .gitignore
```

---

## 7. Installation & Execution Guide

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm
- MongoDB Atlas account (or runs in graceful memory cache mode)

### Step 1: Start the Python ML Microservice
```powershell
# In PowerShell:
cd d:\ML-PROJECT\ml_service

# (Optional) Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask ML engine on port 8000
python app.py
```

### Step 2: Start the Express.js Backend
```powershell
# In a new terminal:
cd d:\ML-PROJECT\backend

# Install npm packages
npm install

# (Optional) Configure MongoDB Atlas URI in backend/.env
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/stock_db

# Start Express server on port 5000
npm run dev
```

### Step 3: Start the React Frontend
```powershell
# In a new terminal:
cd d:\ML-PROJECT\frontend

# Install dependencies & launch Vite dev server
npm install
npm run dev
```
Open **`http://localhost:5173`** in your web browser.

---

## 8. Example API Requests and Responses

### 1. `POST /api/predictions`
**Request Body:**
```json
{
  "symbol": "TCS"
}
```
**Response (200 OK):**
```json
{
  "symbol": "TCS.NS",
  "asOfDate": "2026-09-24",
  "currentPrice": 2087.00,
  "openPrice": 2076.00,
  "dayHigh": 2096.90,
  "dayLow": 2067.10,
  "volume": 1760192,
  "change": -2.60,
  "changePercent": -0.12,
  "predictedHigh": 2328.18,
  "predictedLow": 2273.90,
  "predictedRange": 54.28,
  "direction": "BULLISH",
  "directionConfidence": 71.9,
  "signal": "HOLD",
  "signalConfidence": 45.6,
  "baseline": {
    "predictedHigh": 2123.45,
    "predictedLow": 2096.54,
    "predictedRange": 26.91,
    "direction": "BULLISH",
    "directionConfidence": 100.0,
    "signal": "HOLD",
    "signalConfidence": 74.6
  },
  "disclaimer": "Predictions are for educational purposes only and are not financial advice."
}
```

---

## 9. Academic Testing Checklist

| Test Item | Verification | Status |
| :--- | :--- | :--- |
| **No Future Data Leakage** | Features use only day $t$ information; targets built with `shift(-1)` and final NaN row dropped | Passed |
| **No Random Data Shuffling** | Train/Test split uses strict chronological split (first 80% train, last 20% test) | Passed |
| **Scaler Integrity** | `StandardScaler` is fitted ONLY on training split; never on full dataset | Passed |
| **Manual Algorithm Requirement** | `CustomDecisionTreeClassifier` implemented from scratch with recursive Gini Impurity | Passed |
| **Range Guarantee** | `predicted_high >= predicted_low` safety validation and non-negative spread | Passed |
| **Multi-Stock Dynamics** | Tested on `TCS`, `INFY`, `RELIANCE`, `HDFCBANK`, `ICICIBANK`, `ITC`, `TATAMOTORS` | Passed |
| **Security** | Zero hardcoded passwords; MongoDB Atlas configured securely via `.env` | Passed |
| **Educational Disclaimer** | Prominently displayed across all application views and API payloads | Passed |
