"""
Model Evaluation and Diagnostics
================================
Academic SOP Phase 4 & 5 Requirements:
- Regression Metrics: MAE, MSE, RMSE, R2
- Classification Metrics: Accuracy, Precision, Recall, F1, Confusion Matrix
- Time-Series Cross-Validation (TimeSeriesSplit)
- Diagnostics: Train vs Test Overfitting / Underfitting Checks
"""

import numpy as np
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)
from sklearn.model_selection import TimeSeriesSplit
from typing import Dict, Any, List

def evaluate_regression_model(
    model: Any, 
    X_train: np.ndarray, 
    y_train: np.ndarray, 
    X_test: np.ndarray, 
    y_test: np.ndarray,
    train_close: np.ndarray = None,
    test_close: np.ndarray = None
) -> Dict[str, Any]:
    """
    Computes regression evaluation metrics on both training and test sets.
    If models predict ratio multipliers, multiplies with close prices for true price metrics.
    Checks for potential overfitting / underfitting.
    """
    y_pred_train_raw = model.predict(X_train)
    y_pred_test_raw = model.predict(X_test) if len(X_test) > 0 else y_pred_train_raw
    
    # Check if predictions are ratios and target is actual rupee price
    mean_pred_train = np.mean(y_pred_train_raw) if len(y_pred_train_raw) > 0 else 1.0
    mean_target_train = np.mean(y_train) if len(y_train) > 0 else 1.0
    
    if mean_pred_train < 3.0 and mean_target_train > 5.0 and train_close is not None:
        y_pred_train = y_pred_train_raw * train_close
        y_pred_test = y_pred_test_raw * test_close if test_close is not None else y_pred_test_raw
    else:
        y_pred_train = y_pred_train_raw
        y_pred_test = y_pred_test_raw
    
    # Train Metrics
    train_mae = float(mean_absolute_error(y_train, y_pred_train))
    train_mse = float(mean_squared_error(y_train, y_pred_train))
    train_rmse = float(np.sqrt(train_mse))
    train_r2 = float(r2_score(y_train, y_pred_train))
    
    # Test Metrics
    if len(y_test) > 0:
        test_mae = float(mean_absolute_error(y_test, y_pred_test))
        test_mse = float(mean_squared_error(y_test, y_pred_test))
        test_rmse = float(np.sqrt(test_mse))
        test_r2 = float(r2_score(y_test, y_pred_test))
    else:
        test_mae, test_mse, test_rmse, test_r2 = train_mae, train_mse, train_rmse, train_r2
    
    # Overfitting diagnostics: large gap between train R2 and test R2
    r2_gap = train_r2 - test_r2
    if test_r2 < 0.5 and train_r2 < 0.5:
        fit_status = "Underfitting (Model capacity too low for volatility pattern)"
    elif r2_gap > 0.25:
        fit_status = "Moderate Overfitting (Train score significantly higher than test)"
    else:
        fit_status = "Well-Fitted (Balanced generalization on unseen test period)"
        
    return {
        "train": {
            "MAE": round(train_mae, 4),
            "MSE": round(train_mse, 4),
            "RMSE": round(train_rmse, 4),
            "R2": round(train_r2, 4)
        },
        "test": {
            "MAE": round(test_mae, 4),
            "MSE": round(test_mse, 4),
            "RMSE": round(test_rmse, 4),
            "R2": round(test_r2, 4)
        },
        "fit_status": fit_status,
        "sample_actual": [round(float(v), 2) for v in (y_test[-30:] if len(y_test) > 0 else y_train[-30:])],
        "sample_predicted": [round(float(v), 2) for v in (y_pred_test[-30:] if len(y_pred_test) > 0 else y_pred_train[-30:])]
    }

def evaluate_classification_model(
    model: Any, 
    X_train: np.ndarray, 
    y_train: np.ndarray, 
    X_test: np.ndarray, 
    y_test: np.ndarray,
    labels: List[int] = None
) -> Dict[str, Any]:
    """
    Computes classification metrics and confusion matrix on both train and test splits.
    """
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    
    # Train Metrics
    train_acc = float(accuracy_score(y_train, y_pred_train))
    train_prec = float(precision_score(y_train, y_pred_train, average='weighted', zero_division=0))
    train_rec = float(recall_score(y_train, y_pred_train, average='weighted', zero_division=0))
    train_f1 = float(f1_score(y_train, y_pred_train, average='weighted', zero_division=0))
    
    # Test Metrics
    test_acc = float(accuracy_score(y_test, y_pred_test))
    test_prec = float(precision_score(y_test, y_pred_test, average='weighted', zero_division=0))
    test_rec = float(recall_score(y_test, y_pred_test, average='weighted', zero_division=0))
    test_f1 = float(f1_score(y_test, y_pred_test, average='weighted', zero_division=0))
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred_test, labels=labels)
    cm_list = cm.tolist()
    
    acc_gap = train_acc - test_acc
    if test_acc < 0.4:
        fit_status = "Underfitting (Market noise dominates classification)"
    elif acc_gap > 0.20:
        fit_status = "Overfitting (High training memorization)"
    else:
        fit_status = "Well-Fitted (Generalizing across unseen temporal regimes)"

    return {
        "train": {
            "accuracy": round(train_acc * 100, 2),
            "precision": round(train_prec * 100, 2),
            "recall": round(train_rec * 100, 2),
            "f1": round(train_f1 * 100, 2)
        },
        "test": {
            "accuracy": round(test_acc * 100, 2),
            "precision": round(test_prec * 100, 2),
            "recall": round(test_rec * 100, 2),
            "f1": round(test_f1 * 100, 2)
        },
        "confusion_matrix": cm_list,
        "fit_status": fit_status
    }

def time_series_cv_score(model_factory, X: np.ndarray, y: np.ndarray, n_splits: int = 5) -> Dict[str, float]:
    """
    Evaluates models across expanding forward time windows using TimeSeriesSplit.
    Never uses future data to train older models.
    """
    tscv = TimeSeriesSplit(n_splits=n_splits)
    scores = []
    
    for train_index, test_index in tscv.split(X):
        X_tr, X_te = X[train_index], X[test_index]
        y_tr, y_te = y[train_index], y[test_index]
        
        m = model_factory()
        m.fit(X_tr, y_tr)
        preds = m.predict(X_te)
        
        # Calculate R2 or Accuracy based on problem type
        if np.issubdtype(y.dtype, np.floating) or len(np.unique(y)) > 10:
            score = r2_score(y_te, preds)
        else:
            score = accuracy_score(y_te, preds)
        scores.append(score)
        
    return {
        "mean_score": round(float(np.mean(scores)), 4),
        "std_score": round(float(np.std(scores)), 4),
        "fold_scores": [round(float(s), 4) for s in scores]
    }
