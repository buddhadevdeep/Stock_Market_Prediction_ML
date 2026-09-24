import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from typing import Tuple, Dict, Any, List

FEATURE_COLUMNS = [
    'Open', 'High', 'Low', 'Close', 'Volume',
    'daily_return', 'return_3d', 'return_5d', 'return_10d',
    'SMA_5', 'SMA_10', 'SMA_20', 'SMA_50',
    'volatility_5', 'volatility_10', 'volatility_20',
    'high_low_ratio', 'close_open_ratio', 'price_range',
    'volume_change',
    'momentum_5', 'momentum_10'
]

# Configurable trading signal thresholds (Academic SOP Rule)
BUY_THRESHOLD = 0.01    # +1.0% expected next-day return
SELL_THRESHOLD = -0.01  # -1.0% expected next-day return

def extract_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Generates technical indicators and feature representations using ONLY historical/current information.
    Uses adaptive min_periods so newer IPO / recently listed stocks retain all historical records.
    """
    data = df.copy()
    
    # 1. Basic Price Returns
    data['daily_return'] = data['Close'].pct_change().fillna(0)
    data['return_3d'] = data['Close'].pct_change(periods=3).fillna(0)
    data['return_5d'] = data['Close'].pct_change(periods=5).fillna(0)
    data['return_10d'] = data['Close'].pct_change(periods=10).fillna(0)
    
    # 2. Simple Moving Averages (Trend)
    data['SMA_5'] = data['Close'].rolling(window=5, min_periods=1).mean()
    data['SMA_10'] = data['Close'].rolling(window=10, min_periods=1).mean()
    data['SMA_20'] = data['Close'].rolling(window=20, min_periods=1).mean()
    data['SMA_50'] = data['Close'].rolling(window=50, min_periods=1).mean()
    
    # 3. Volatility Indicators (Rolling Standard Deviation of Returns)
    data['volatility_5'] = data['daily_return'].rolling(window=5, min_periods=1).std().fillna(0)
    data['volatility_10'] = data['daily_return'].rolling(window=10, min_periods=1).std().fillna(0)
    data['volatility_20'] = data['daily_return'].rolling(window=20, min_periods=1).std().fillna(0)
    
    # 4. Intraday Price Relationships
    data['high_low_ratio'] = data['High'] / (data['Low'] + 1e-8)
    data['close_open_ratio'] = data['Close'] / (data['Open'] + 1e-8)
    data['price_range'] = data['High'] - data['Low']
    
    # 5. Volume Dynamics
    data['volume_change'] = data['Volume'].pct_change().replace([np.inf, -np.inf], 0).fillna(0)
    
    # 6. Price Momentum
    data['momentum_5'] = (data['Close'] - data['Close'].shift(5)).fillna(0)
    data['momentum_10'] = (data['Close'] - data['Close'].shift(10)).fillna(0)
    
    data.bfill(inplace=True)
    data.fillna(0, inplace=True)
    return data

def prepare_dataset_for_modeling(
    df: pd.DataFrame, 
    buy_thresh: float = BUY_THRESHOLD, 
    sell_thresh: float = SELL_THRESHOLD
) -> pd.DataFrame:
    """
    Applies feature engineering and constructs future target variables using shift(-1).
    The last row (where tomorrow's target is unknown) is dropped for training.
    """
    data = extract_features(df)
    
    # Target variables (Shifted backwards by 1 period -> tomorrow's price)
    data['target_high'] = data['High'].shift(-1)
    data['target_low'] = data['Low'].shift(-1)
    data['target_close'] = data['Close'].shift(-1)
    
    # Stationary Ratio Targets (Prevents tree model extrapolation failure across splits/multi-year rallies)
    data['target_high_ratio'] = (data['target_high'] / (data['Close'] + 1e-8)).fillna(1.01)
    data['target_low_ratio'] = (data['target_low'] / (data['Close'] + 1e-8)).fillna(0.99)
    
    # Classification Targets
    data['direction_target'] = (data['target_close'] > data['Close']).astype(int)
    
    # Signal: 1 = BUY, 0 = HOLD, 2 = SELL
    next_return = (data['target_close'] - data['Close']) / (data['Close'] + 1e-8)
    
    signal_series = pd.Series(0, index=data.index)
    signal_series[next_return >= buy_thresh] = 1   # BUY (1)
    signal_series[next_return <= sell_thresh] = 2  # SELL (2)
    data['signal_target'] = signal_series
    
    # Drop only the final row whose future targets are NaN
    cleaned_data = data.iloc[:-1].copy()
    cleaned_data.dropna(inplace=True)
    return cleaned_data

def chronological_train_test_split(
    df: pd.DataFrame, 
    train_ratio: float = 0.8
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Performs strict chronological splitting (time-series split).
    """
    train_size = max(int(len(df) * train_ratio), len(df) - 5)
    if train_size >= len(df):
        train_size = max(1, len(df) - 1)
        
    train_df = df.iloc[:train_size].copy()
    test_df = df.iloc[train_size:].copy()
    return train_df, test_df

def prepare_features_and_targets(
    train_df: pd.DataFrame, 
    test_df: pd.DataFrame
) -> Dict[str, Any]:
    """
    Extracts X and y arrays and fits a StandardScaler ONLY on the training split.
    """
    X_train_raw = train_df[FEATURE_COLUMNS].values
    X_test_raw = test_df[FEATURE_COLUMNS].values
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_raw)
    X_test_scaled = scaler.transform(X_test_raw) if len(X_test_raw) > 0 else X_train_scaled
    
    return {
        "scaler": scaler,
        "feature_names": FEATURE_COLUMNS,
        "X_train_raw": X_train_raw,
        "X_test_raw": X_test_raw,
        "X_train_scaled": X_train_scaled,
        "X_test_scaled": X_test_scaled,
        "y_train_high_ratio": train_df['target_high_ratio'].values,
        "y_test_high_ratio": test_df['target_high_ratio'].values if len(test_df) > 0 else train_df['target_high_ratio'].values,
        "y_train_low_ratio": train_df['target_low_ratio'].values,
        "y_test_low_ratio": test_df['target_low_ratio'].values if len(test_df) > 0 else train_df['target_low_ratio'].values,
        "y_train_high": train_df['target_high'].values,
        "y_test_high": test_df['target_high'].values if len(test_df) > 0 else train_df['target_high'].values,
        "y_train_low": train_df['target_low'].values,
        "y_test_low": test_df['target_low'].values if len(test_df) > 0 else train_df['target_low'].values,
        "train_close": train_df['Close'].values,
        "test_close": test_df['Close'].values if len(test_df) > 0 else train_df['Close'].values,
        "y_train_direction": train_df['direction_target'].values,
        "y_test_direction": test_df['direction_target'].values if len(test_df) > 0 else train_df['direction_target'].values,
        "y_train_signal": train_df['signal_target'].values,
        "y_test_signal": test_df['signal_target'].values if len(test_df) > 0 else train_df['signal_target'].values,
        "train_dates": train_df.index,
        "test_dates": test_df.index
    }

def get_latest_feature_vector(df: pd.DataFrame, scaler: StandardScaler = None) -> Tuple[pd.DataFrame, np.ndarray, np.ndarray]:
    """
    Extracts the feature vector from the very latest available trading day to generate tomorrow's prediction.
    """
    features_df = extract_features(df)
    latest_row = features_df.iloc[[-1]]
    X_latest_raw = latest_row[FEATURE_COLUMNS].values
    
    if scaler is not None:
        X_latest_scaled = scaler.transform(X_latest_raw)
    else:
        X_latest_scaled = X_latest_raw
        
    return latest_row, X_latest_raw, X_latest_scaled
