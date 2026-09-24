"""
Model Manager: Orchestrates Training, Persistence, Evaluation, and Real-time Inference
======================================================================================
Coordinates data ingestion, chronological splitting, scaling, training, evaluation, 
and disk caching using joblib for college project requirements.
"""

import os
import json
import time
import threading
from collections import defaultdict
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional

from data_loader import download_stock_data, normalize_symbol
from preprocessing import (
    prepare_dataset_for_modeling,
    chronological_train_test_split,
    prepare_features_and_targets,
    get_latest_feature_vector,
    FEATURE_COLUMNS
)
from regression import (
    train_linear_regression,
    train_random_forest_regressor,
    predict_stock_range
)
from classification import (
    train_custom_decision_tree,
    train_random_forest_classifier,
    predict_market_direction,
    predict_trading_signal
)
from evaluation import (
    evaluate_regression_model,
    evaluate_classification_model,
    time_series_cv_score
)

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
os.makedirs(os.path.join(MODELS_DIR, "regression"), exist_ok=True)
os.makedirs(os.path.join(MODELS_DIR, "classification"), exist_ok=True)

class ModelManager:
    """
    Manages end-to-end model lifecycle for stock market prediction.
    Features in-memory TTL caching and symbol mutex locks for high-concurrency protection.
    """
    def __init__(self, symbol: str = "TCS"):
        self.symbol = normalize_symbol(symbol)
        self.models_cache: Dict[str, Any] = {}
        self.latest_metrics: Dict[str, Any] = {}
        self.last_trained_info: Dict[str, Any] = {}
        self._prediction_cache: Dict[str, Any] = {}
        self._cache_ttl_seconds = 45
        self._symbol_locks = defaultdict(threading.Lock)


    def get_symbol_dir(self, symbol: str) -> str:
        """Returns the specific model storage directory for the given symbol."""
        sym = normalize_symbol(symbol).replace('.NS', '')
        sym_dir = os.path.join(MODELS_DIR, sym)
        os.makedirs(os.path.join(sym_dir, "regression"), exist_ok=True)
        os.makedirs(os.path.join(sym_dir, "classification"), exist_ok=True)
        return sym_dir

    def train_all_models(self, symbol: str, period: str = "5y") -> Dict[str, Any]:
        """
        Executes the complete ML pipeline:
        1. Downloads stock data
        2. Feature engineering & target creation (shift -1)
        3. Chronological 80/20 train/test split
        4. Scaler fitting on train set only
        5. Trains:
           - Linear Regression (High & Low)
           - Random Forest Regressor (High & Low)
           - Custom Decision Tree (Direction & Signal)
           - Random Forest Classifier (Direction & Signal)
        6. Evaluates all models (MAE, MSE, RMSE, R2, Accuracy, Precision, Recall, F1, Confusion Matrices)
        7. Saves models and preprocessing objects to disk
        """
        sym_clean = normalize_symbol(symbol)
        sym_dir = self.get_symbol_dir(sym_clean)
        
        # Step 1: Download data
        raw_df = download_stock_data(sym_clean, period=period)
        
        # Step 2: Feature engineering and target creation
        dataset = prepare_dataset_for_modeling(raw_df)
        
        # Step 3: Chronological split
        train_df, test_df = chronological_train_test_split(dataset, train_ratio=0.8)
        
        # Step 4: Scale features (Fitted only on train data)
        data_dict = prepare_features_and_targets(train_df, test_df)
        scaler = data_dict["scaler"]
        
        X_train_scaled = data_dict["X_train_scaled"]
        X_test_scaled = data_dict["X_test_scaled"]
        X_train_raw = data_dict["X_train_raw"]
        X_test_raw = data_dict["X_test_raw"]
        
        # Step 5A: Train Regression Models (Using stationary price ratio targets)
        # High Price Models (Predicting tomorrow's High / today's Close multiplier)
        lr_high = train_linear_regression(X_train_scaled, data_dict["y_train_high_ratio"])
        rf_high = train_random_forest_regressor(X_train_raw, data_dict["y_train_high_ratio"])
        
        # Low Price Models (Predicting tomorrow's Low / today's Close multiplier)
        lr_low = train_linear_regression(X_train_scaled, data_dict["y_train_low_ratio"])
        rf_low = train_random_forest_regressor(X_train_raw, data_dict["y_train_low_ratio"])
        
        # Step 5B: Train Classification Models
        # Market Direction (Bullish / Bearish)
        dt_direction = train_custom_decision_tree(X_train_raw, data_dict["y_train_direction"], max_depth=5)
        rf_direction = train_random_forest_classifier(X_train_raw, data_dict["y_train_direction"])
        
        # Trading Signal (BUY / HOLD / SELL)
        dt_signal = train_custom_decision_tree(X_train_raw, data_dict["y_train_signal"], max_depth=6)
        rf_signal = train_random_forest_classifier(X_train_raw, data_dict["y_train_signal"])
        
        # Step 6: Comprehensive Evaluation
        train_close = data_dict.get("train_close")
        test_close = data_dict.get("test_close")
        eval_results = {
            "symbol": sym_clean,
            "dataset_info": {
                "total_records": len(dataset),
                "train_records": len(train_df),
                "test_records": len(test_df),
                "start_date": str(dataset.index[0].date()) if hasattr(dataset.index[0], 'date') else str(dataset.index[0]),
                "end_date": str(dataset.index[-1].date()) if hasattr(dataset.index[-1], 'date') else str(dataset.index[-1]),
                "features_count": len(FEATURE_COLUMNS)
            },
            "regression": {
                "linear_regression_high": evaluate_regression_model(lr_high, X_train_scaled, data_dict["y_train_high"], X_test_scaled, data_dict["y_test_high"], train_close, test_close),
                "linear_regression_low": evaluate_regression_model(lr_low, X_train_scaled, data_dict["y_train_low"], X_test_scaled, data_dict["y_test_low"], train_close, test_close),
                "random_forest_high": evaluate_regression_model(rf_high, X_train_raw, data_dict["y_train_high"], X_test_raw, data_dict["y_test_high"], train_close, test_close),
                "random_forest_low": evaluate_regression_model(rf_low, X_train_raw, data_dict["y_train_low"], X_test_raw, data_dict["y_test_low"], train_close, test_close)
            },
            "classification": {
                "custom_decision_tree_direction": evaluate_classification_model(dt_direction, X_train_raw, data_dict["y_train_direction"], X_test_raw, data_dict["y_test_direction"], labels=[0, 1]),
                "random_forest_direction": evaluate_classification_model(rf_direction, X_train_raw, data_dict["y_train_direction"], X_test_raw, data_dict["y_test_direction"], labels=[0, 1]),
                "custom_decision_tree_signal": evaluate_classification_model(dt_signal, X_train_raw, data_dict["y_train_signal"], X_test_raw, data_dict["y_test_signal"], labels=[0, 1, 2]),
                "random_forest_signal": evaluate_classification_model(rf_signal, X_train_raw, data_dict["y_train_signal"], X_test_raw, data_dict["y_test_signal"], labels=[0, 1, 2])
            },
            "feature_importance": [
                {"feature": feat, "importance": round(float(imp), 4)}
                for feat, imp in sorted(zip(FEATURE_COLUMNS, rf_high.feature_importances_), key=lambda x: x[1], reverse=True)
            ],
            "tree_rules_sample": dt_direction.get_rules_summary(FEATURE_COLUMNS, max_lines=12)
        }
        
        # Step 7: Save to Disk
        joblib.dump(scaler, os.path.join(sym_dir, "scaler.pkl"))
        joblib.dump(lr_high, os.path.join(sym_dir, "regression", "lr_high.pkl"))
        joblib.dump(lr_low, os.path.join(sym_dir, "regression", "lr_low.pkl"))
        joblib.dump(rf_high, os.path.join(sym_dir, "regression", "rf_high.pkl"))
        joblib.dump(rf_low, os.path.join(sym_dir, "regression", "rf_low.pkl"))
        joblib.dump(dt_direction, os.path.join(sym_dir, "classification", "dt_direction.pkl"))
        joblib.dump(rf_direction, os.path.join(sym_dir, "classification", "rf_direction.pkl"))
        joblib.dump(dt_signal, os.path.join(sym_dir, "classification", "dt_signal.pkl"))
        joblib.dump(rf_signal, os.path.join(sym_dir, "classification", "rf_signal.pkl"))
        
        with open(os.path.join(sym_dir, "metrics.json"), "w") as f:
            json.dump(eval_results, f, indent=2)
            
        return eval_results

    def predict_tomorrow(self, symbol: str) -> Dict[str, Any]:
        """
        Performs live inference for tomorrow's High, Low, Range, Direction, and Signal.
        Protected with symbol mutex locks and 45-second in-memory TTL caching for auto-sync and multi-user loads.
        """
        sym_clean = normalize_symbol(symbol)
        now = time.time()
        
        # Check in-memory cache
        if sym_clean in self._prediction_cache:
            cache_entry = self._prediction_cache[sym_clean]
            if now - cache_entry['timestamp'] < self._cache_ttl_seconds:
                return cache_entry['data']

        # Acquire lock per symbol to prevent redundant concurrent processing
        with self._symbol_locks[sym_clean]:
            # Double-check cache inside lock
            if sym_clean in self._prediction_cache:
                cache_entry = self._prediction_cache[sym_clean]
                if now - cache_entry['timestamp'] < self._cache_ttl_seconds:
                    return cache_entry['data']

            sym_dir = self.get_symbol_dir(sym_clean)
            
            # Ensure models exist; train if not yet trained
            required_files = [
                os.path.join(sym_dir, "scaler.pkl"),
                os.path.join(sym_dir, "regression", "rf_high.pkl"),
                os.path.join(sym_dir, "regression", "rf_low.pkl"),
                os.path.join(sym_dir, "classification", "rf_direction.pkl"),
                os.path.join(sym_dir, "classification", "rf_signal.pkl")
            ]
            
            if not all(os.path.exists(p) for p in required_files):
                self.train_all_models(sym_clean)
                
            # Load artifacts
            scaler = joblib.load(os.path.join(sym_dir, "scaler.pkl"))
            rf_high = joblib.load(os.path.join(sym_dir, "regression", "rf_high.pkl"))
            rf_low = joblib.load(os.path.join(sym_dir, "regression", "rf_low.pkl"))
            rf_direction = joblib.load(os.path.join(sym_dir, "classification", "rf_direction.pkl"))
            rf_signal = joblib.load(os.path.join(sym_dir, "classification", "rf_signal.pkl"))
            
            # Load Baseline Linear Regression & Custom Tree for educational comparison
            lr_high = joblib.load(os.path.join(sym_dir, "regression", "lr_high.pkl"))
            lr_low = joblib.load(os.path.join(sym_dir, "regression", "lr_low.pkl"))
            dt_direction = joblib.load(os.path.join(sym_dir, "classification", "dt_direction.pkl"))
            dt_signal = joblib.load(os.path.join(sym_dir, "classification", "dt_signal.pkl"))
            
            # Fetch latest market data
            raw_df = download_stock_data(sym_clean, period="1y")
            latest_row, X_latest_raw, X_latest_scaled = get_latest_feature_vector(raw_df, scaler)
            
            current_close = float(latest_row['Close'].values[0])
            current_open = float(latest_row['Open'].values[0])
            current_high = float(latest_row['High'].values[0])
            current_low = float(latest_row['Low'].values[0])
            current_volume = int(latest_row['Volume'].values[0])
            latest_date = str(latest_row.index[0].date()) if hasattr(latest_row.index[0], 'date') else str(latest_row.index[0])
            
            # Daily change
            prev_close = float(raw_df['Close'].iloc[-2]) if len(raw_df) > 1 else current_close
            daily_change = current_close - prev_close
            daily_change_pct = (daily_change / prev_close) * 100.0 if prev_close else 0.0

            # Predictions using Primary (Random Forest)
            pred_high, pred_low, pred_range = predict_stock_range(rf_high, rf_low, X_latest_raw, current_close)
            direction, dir_conf = predict_market_direction(rf_direction, X_latest_raw)
            signal, sig_conf = predict_trading_signal(rf_signal, X_latest_raw)

            # Baseline Predictions (Linear Regression & Custom Tree)
            base_high, base_low, base_range = predict_stock_range(lr_high, lr_low, X_latest_scaled, current_close)
            base_dir, base_dir_conf = predict_market_direction(dt_direction, X_latest_raw)
            base_sig, base_sig_conf = predict_trading_signal(dt_signal, X_latest_raw)

            payload = {
                "symbol": sym_clean,
                "asOfDate": latest_date,
                "currentPrice": round(current_close, 2),
                "openPrice": round(current_open, 2),
                "dayHigh": round(current_high, 2),
                "dayLow": round(current_low, 2),
                "volume": current_volume,
                "change": round(daily_change, 2),
                "changePercent": round(daily_change_pct, 2),
                "predictedHigh": pred_high,
                "predictedLow": pred_low,
                "predictedRange": pred_range,
                "direction": direction,
                "directionConfidence": dir_conf,
                "signal": signal,
                "signalConfidence": sig_conf,
                "baseline": {
                    "predictedHigh": base_high,
                    "predictedLow": base_low,
                    "predictedRange": base_range,
                    "direction": base_dir,
                    "directionConfidence": base_dir_conf,
                    "signal": base_sig,
                    "signalConfidence": base_sig_conf
                },
                "disclaimer": "Predictions are for educational purposes only and are not financial advice."
            }

            self._prediction_cache[sym_clean] = {
                "timestamp": now,
                "data": payload
            }
            return payload

    def get_model_info(self, symbol: str) -> Dict[str, Any]:
        """Loads cached evaluation metrics and model info for a stock."""
        sym_clean = normalize_symbol(symbol)
        sym_dir = self.get_symbol_dir(sym_clean)
        metrics_file = os.path.join(sym_dir, "metrics.json")
        
        if os.path.exists(metrics_file):
            with open(metrics_file, "r") as f:
                return json.load(f)
        else:
            # If not yet trained, trigger training and return results
            return self.train_all_models(sym_clean)

# Singleton ModelManager instance
model_manager = ModelManager()
