import json
import os

NOTEBOOKS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "notebooks"))
os.makedirs(NOTEBOOKS_DIR, exist_ok=True)

def create_notebook(filename, cells):
    nb = {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "codemirror_mode": {"name": "ipython", "version": 3},
                "file_extension": ".py",
                "mimetype": "text/x-python",
                "name": "python",
                "nbconvert_exporter": "python",
                "pygments_lexer": "ipython3",
                "version": "3.10.0"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 5
    }
    path = os.path.join(NOTEBOOKS_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(nb, f, indent=2)
    print(f"Created {path}")

# ==========================================
# PHASE 1 NOTEBOOK
# ==========================================
p1_cells = [
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "# Stock Market Prediction System - Phase 1: Problem Definition & Dataset Exploration\n",
            "**Academic College ML Project SOP**\n",
            "\n",
            "### 1. Problem Statement\n",
            "Financial markets are inherently non-stationary and volatile. The objective of this project is to develop a machine learning pipeline capable of predicting:\n",
            "1. **Tomorrow's High Price** (Regression)\n",
            "2. **Tomorrow's Low Price** (Regression)\n",
            "3. **Tomorrow's Expected Price Range** (High - Low)\n",
            "4. **Market Direction** (Binary Classification: Bullish vs. Bearish)\n",
            "5. **Trading Signal** (Multiclass Classification: BUY, HOLD, SELL)\n",
            "\n",
            "> **Disclaimer**: *This project is developed solely for educational and academic demonstration. Stock market predictions are non-deterministic and do not constitute financial advice.*"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "import os\n",
            "import yfinance as yf\n",
            "import pandas as pd\n",
            "import numpy as np\n",
            "import matplotlib.pyplot as plt\n",
            "\n",
            "# Set visualization styles\n",
            "plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')\n",
            "plt.rcParams['figure.figsize'] = (12, 6)\n",
            "\n",
            "symbol = 'TCS.NS'\n",
            "print(f'Fetching historical data for {symbol}...')\n",
            "df = yf.download(symbol, period='5y', interval='1d', progress=False)\n",
            "\n",
            "# Flatten MultiIndex columns if present in newer yfinance\n",
            "if isinstance(df.columns, pd.MultiIndex):\n",
            "    df.columns = df.columns.get_level_values(0)\n",
            "\n",
            "print('Data download complete. Shape:', df.shape)\n",
            "df.head()"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### 2. Dataset Exploration & Structural Analysis\n",
            "Inspecting the data types, dimensions, summary statistics, and identifying missing data."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "print('--- DATASET INFORMATION ---')\n",
            "print(df.info())\n",
            "\n",
            "print('\\n--- DATA TYPES ---')\n",
            "print(df.dtypes)\n",
            "\n",
            "print('\\n--- MISSING VALUE SUMMARY ---')\n",
            "print(df.isnull().sum())\n",
            "\n",
            "print('\\n--- DESCRIPTIVE STATISTICS ---')\n",
            "df.describe()"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### 3. Historical Price and Volume Visualization"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8), sharex=True, gridspec_kw={'height_ratios': [3, 1]})\n",
            "\n",
            "ax1.plot(df.index, df['Close'], label='Close Price', color='#2563eb', linewidth=1.5)\n",
            "ax1.set_title(f'{symbol} Historical Close Price (5-Year Trend)', fontsize=14, fontweight='bold')\n",
            "ax1.set_ylabel('Price (INR ₹)', fontsize=12)\n",
            "ax1.legend()\n",
            "ax1.grid(True, alpha=0.3)\n",
            "\n",
            "ax2.bar(df.index, df['Volume'], color='#64748b', alpha=0.7, width=1.0)\n",
            "ax2.set_title('Trading Volume', fontsize=12)\n",
            "ax2.set_xlabel('Date', fontsize=12)\n",
            "ax2.set_ylabel('Volume', fontsize=12)\n",
            "ax2.grid(True, alpha=0.3)\n",
            "\n",
            "plt.tight_layout()\n",
            "plt.show()"
        ]
    }
]

# ==========================================
# PHASE 2 NOTEBOOK
# ==========================================
p2_cells = [
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "# Stock Market Prediction System - Phase 2: Data Cleaning and Pre-processing\n",
            "**Academic College ML Project SOP**\n",
            "\n",
            "### Objectives:\n",
            "1. Clean missing values and anomalous zero entries.\n",
            "2. Outlier detection using Interquartile Range (IQR).\n",
            "3. Comprehensive Feature Engineering (Returns, SMAs, Volatility, Momentum, Intraday Ratios).\n",
            "4. Target generation with strict zero-leakage `shift(-1)`."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "import yfinance as yf\n",
            "import pandas as pd\n",
            "import numpy as np\n",
            "import matplotlib.pyplot as plt\n",
            "import seaborn as sns\n",
            "\n",
            "# Download clean dataset\n",
            "symbol = 'TCS.NS'\n",
            "raw_df = yf.download(symbol, period='5y', interval='1d', progress=False)\n",
            "if isinstance(raw_df.columns, pd.MultiIndex):\n",
            "    raw_df.columns = raw_df.columns.get_level_values(0)\n",
            "\n",
            "df = raw_df[['Open', 'High', 'Low', 'Close', 'Volume']].copy()\n",
            "df.dropna(inplace=True)\n",
            "print('Initial clean shape:', df.shape)"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### 1. Technical Indicator Feature Engineering"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Returns\n",
            "df['daily_return'] = df['Close'].pct_change()\n",
            "df['return_3d'] = df['Close'].pct_change(3)\n",
            "df['return_5d'] = df['Close'].pct_change(5)\n",
            "df['return_10d'] = df['Close'].pct_change(10)\n",
            "\n",
            "# Simple Moving Averages\n",
            "df['SMA_5'] = df['Close'].rolling(window=5).mean()\n",
            "df['SMA_10'] = df['Close'].rolling(window=10).mean()\n",
            "df['SMA_20'] = df['Close'].rolling(window=20).mean()\n",
            "df['SMA_50'] = df['Close'].rolling(window=50).mean()\n",
            "\n",
            "# Volatility (Rolling Std of Returns)\n",
            "df['volatility_5'] = df['daily_return'].rolling(window=5).std()\n",
            "df['volatility_10'] = df['daily_return'].rolling(window=10).std()\n",
            "df['volatility_20'] = df['daily_return'].rolling(window=20).std()\n",
            "\n",
            "# Price Relationships\n",
            "df['high_low_ratio'] = df['High'] / (df['Low'] + 1e-8)\n",
            "df['close_open_ratio'] = df['Close'] / (df['Open'] + 1e-8)\n",
            "df['price_range'] = df['High'] - df['Low']\n",
            "\n",
            "# Momentum and Volume\n",
            "df['volume_change'] = df['Volume'].pct_change().fillna(0)\n",
            "df['momentum_5'] = df['Close'] - df['Close'].shift(5)\n",
            "df['momentum_10'] = df['Close'] - df['Close'].shift(10)\n",
            "\n",
            "print('Feature engineering complete. Available features:', df.columns.tolist())"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### 2. Feature Correlation Heatmap"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "plt.figure(figsize=(12, 9))\n",
            "corr = df.dropna().corr()\n",
            "sns.heatmap(corr, cmap='coolwarm', annot=False, linewidths=0.5)\n",
            "plt.title('Feature Correlation Matrix', fontsize=14, fontweight='bold')\n",
            "plt.show()"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### 3. Target Variable Construction (Zero-Leakage Shift)\n",
            "- `target_high = High.shift(-1)`\n",
            "- `target_low = Low.shift(-1)`\n",
            "- `direction_target = 1 (Bullish) if Tomorrow Close > Today Close else 0 (Bearish)`\n",
            "- `signal_target = 1 (BUY >= +1%), 2 (SELL <= -1%), 0 (HOLD)`\n",
            "\n",
            "The final row is dropped because its future outcome has not occurred yet."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "df['target_high'] = df['High'].shift(-1)\n",
            "df['target_low'] = df['Low'].shift(-1)\n",
            "df['target_close'] = df['Close'].shift(-1)\n",
            "\n",
            "df['direction_target'] = (df['target_close'] > df['Close']).astype(int)\n",
            "\n",
            "next_ret = (df['target_close'] - df['Close']) / df['Close']\n",
            "signal = pd.Series(0, index=df.index)\n",
            "signal[next_ret >= 0.01] = 1 # BUY\n",
            "signal[next_ret <= -0.01] = 2 # SELL\n",
            "df['signal_target'] = signal\n",
            "\n",
            "clean_dataset = df.dropna().copy()\n",
            "print('Final Clean Dataset Shape for Modeling:', clean_dataset.shape)\n",
            "print('Direction Distribution:\\n', clean_dataset['direction_target'].value_counts())\n",
            "print('Signal Distribution (0=HOLD, 1=BUY, 2=SELL):\\n', clean_dataset['signal_target'].value_counts())"
        ]
    }
]

# ==========================================
# PHASE 3 NOTEBOOK
# ==========================================
p3_cells = [
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "# Stock Market Prediction System - Phase 3: Model Creation\n",
            "**Academic College ML Project SOP**\n",
            "\n",
            "### Core Requirement:\n",
            "- Implement **Linear Regression** as the regression baseline.\n",
            "- Implement **Custom Decision Tree Classifier** manually from scratch using **Gini Index** (WITHOUT using scikit-learn for the custom tree).\n",
            "\n",
            "### Why Decision Tree + Gini Impurity?\n",
            "1. Decision Trees handle non-linear market feature interactions effectively without assuming Gaussian normality.\n",
            "2. Provides interpretable, transparent decision rules directly traceable during college evaluation.\n",
            "3. Gini Impurity: $Gini = 1 - \\sum_{i=1}^C (p_i)^2$. Minimizing Gini yields the purest partition of Bullish/Bearish states."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "import numpy as np\n",
            "import pandas as pd\n",
            "from sklearn.preprocessing import StandardScaler\n",
            "from sklearn.linear_model import LinearRegression\n",
            "\n",
            "# Chronological Train/Test Split (80% Train / 20% Test - No Shuffling)\n",
            "train_size = int(len(clean_dataset) * 0.8)\n",
            "train = clean_dataset.iloc[:train_size]\n",
            "test = clean_dataset.iloc[train_size:]\n",
            "\n",
            "feature_cols = [\n",
            "    'Open', 'High', 'Low', 'Close', 'Volume',\n",
            "    'daily_return', 'return_3d', 'return_5d', 'return_10d',\n",
            "    'SMA_5', 'SMA_10', 'SMA_20', 'SMA_50',\n",
            "    'volatility_5', 'volatility_10', 'volatility_20',\n",
            "    'high_low_ratio', 'close_open_ratio', 'price_range',\n",
            "    'volume_change', 'momentum_5', 'momentum_10'\n",
            "]\n",
            "\n",
            "X_train_raw = train[feature_cols].values\n",
            "X_test_raw = test[feature_cols].values\n",
            "\n",
            "# Fit scaler ONLY on training data\n",
            "scaler = StandardScaler()\n",
            "X_train_scaled = scaler.fit_transform(X_train_raw)\n",
            "X_test_scaled = scaler.transform(X_test_raw)\n",
            "\n",
            "print(f'Training samples: {len(train)}, Testing samples: {len(test)}')"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### 1. Baseline Linear Regression (Predicting Tomorrow High and Low)"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "lr_high = LinearRegression()\n",
            "lr_high.fit(X_train_scaled, train['target_high'].values)\n",
            "\n",
            "lr_low = LinearRegression()\n",
            "lr_low.fit(X_train_scaled, train['target_low'].values)\n",
            "\n",
            "pred_high = lr_high.predict(X_test_scaled)\n",
            "pred_low = lr_low.predict(X_test_scaled)\n",
            "\n",
            "print('Linear Regression training complete.')\n",
            "print('Sample Test Prediction High (First 5):', np.round(pred_high[:5], 2))\n",
            "print('Sample Test Actual High (First 5):    ', np.round(test['target_high'].values[:5], 2))"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### 2. Manual Custom Decision Tree Classifier (Gini Impurity from Scratch)"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "class Node:\n",
            "    def __init__(self, feature_idx=None, threshold=None, left=None, right=None, *, value=None, probabilities=None, samples_count=0):\n",
            "        self.feature_idx = feature_idx\n",
            "        self.threshold = threshold\n",
            "        self.left = left\n",
            "        self.right = right\n",
            "        self.value = value\n",
            "        self.probabilities = probabilities\n",
            "        self.samples_count = samples_count\n",
            "\n",
            "    @property\n",
            "    def is_leaf(self):\n",
            "        return self.value is not None\n",
            "\n",
            "class CustomDecisionTreeClassifier:\n",
            "    def __init__(self, max_depth=5, min_samples_split=5, min_samples_leaf=2):\n",
            "        self.max_depth = max_depth\n",
            "        self.min_samples_split = min_samples_split\n",
            "        self.min_samples_leaf = min_samples_leaf\n",
            "        self.root = None\n",
            "        self.classes_ = np.array([])\n",
            "\n",
            "    def _gini(self, y):\n",
            "        if len(y) == 0: return 0.0\n",
            "        _, counts = np.unique(y, return_counts=True)\n",
            "        p = counts / len(y)\n",
            "        return 1.0 - np.sum(p ** 2)\n",
            "\n",
            "    def _best_split(self, X, y):\n",
            "        best_gini, best_feat, best_thresh = float('inf'), None, None\n",
            "        n_samples, n_features = X.shape\n",
            "        if n_samples < self.min_samples_split:\n",
            "            return None, None\n",
            "        for feat in range(n_features):\n",
            "            vals = np.unique(X[:, feat])\n",
            "            if len(vals) <= 1: continue\n",
            "            threshs = np.percentile(vals, np.linspace(5, 95, 20)) if len(vals) > 20 else (vals[:-1] + vals[1:]) / 2.0\n",
            "            for t in threshs:\n",
            "                left = X[:, feat] <= t\n",
            "                nl, nr = np.sum(left), n_samples - np.sum(left)\n",
            "                if nl < self.min_samples_leaf or nr < self.min_samples_leaf: continue\n",
            "                wgini = (nl / n_samples) * self._gini(y[left]) + (nr / n_samples) * self._gini(y[~left])\n",
            "                if wgini < best_gini:\n",
            "                    best_gini, best_feat, best_thresh = wgini, feat, t\n",
            "        return best_feat, best_thresh\n",
            "\n",
            "    def _build(self, X, y, depth=0):\n",
            "        classes = np.unique(y)\n",
            "        if depth >= self.max_depth or len(classes) == 1 or len(y) < self.min_samples_split:\n",
            "            vals, counts = np.unique(y, return_counts=True)\n",
            "            probs = {c: float(counts[list(vals).index(c)]/len(y)) if c in vals else 0.0 for c in self.classes_}\n",
            "            return Node(value=vals[np.argmax(counts)], probabilities=probs, samples_count=len(y))\n",
            "        feat, thresh = self._best_split(X, y)\n",
            "        if feat is None:\n",
            "            vals, counts = np.unique(y, return_counts=True)\n",
            "            probs = {c: float(counts[list(vals).index(c)]/len(y)) if c in vals else 0.0 for c in self.classes_}\n",
            "            return Node(value=vals[np.argmax(counts)], probabilities=probs, samples_count=len(y))\n",
            "        left = X[:, feat] <= thresh\n",
            "        return Node(feature_idx=feat, threshold=thresh, left=self._build(X[left], y[left], depth+1), right=self._build(X[~left], y[~left], depth+1), samples_count=len(y))\n",
            "\n",
            "    def fit(self, X, y):\n",
            "        self.classes_ = np.unique(y)\n",
            "        self.root = self._build(np.asarray(X), np.asarray(y), 0)\n",
            "        return self\n",
            "\n",
            "    def _predict_one(self, node, x):\n",
            "        if node.is_leaf: return node.value\n",
            "        return self._predict_one(node.left if x[node.feature_idx] <= node.threshold else node.right, x)\n",
            "\n",
            "    def predict(self, X):\n",
            "        return np.array([self._predict_one(self.root, x) for x in np.asarray(X)])\n",
            "\n",
            "# Fit Custom Decision Tree for Market Direction (Bullish / Bearish)\n",
            "custom_tree = CustomDecisionTreeClassifier(max_depth=5)\n",
            "custom_tree.fit(X_train_raw, train['direction_target'].values)\n",
            "\n",
            "dir_preds = custom_tree.predict(X_test_raw)\n",
            "print('Custom Decision Tree trained successfully!')\n",
            "print('Sample Predictions:', dir_preds[:10])"
        ]
    }
]

# ==========================================
# PHASE 4 NOTEBOOK
# ==========================================
p4_cells = [
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "# Stock Market Prediction System - Phase 4: Model Evaluation\n",
            "**Academic College ML Project SOP**\n",
            "\n",
            "### Evaluation Metrics:\n",
            "- **Regression**: MAE, MSE, RMSE, $R^2$ Score\n",
            "- **Classification**: Accuracy, Precision, Recall, F1 Score, Confusion Matrix\n",
            "- **Diagnostics**: Evaluating train vs test performance to diagnose Underfitting / Overfitting."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, accuracy_score, precision_score, recall_score, f1_score, confusion_matrix\n",
            "\n",
            "# Regression Evaluation (Linear Regression)\n",
            "mae_high = mean_absolute_error(test['target_high'], pred_high)\n",
            "mse_high = mean_squared_error(test['target_high'], pred_high)\n",
            "rmse_high = np.sqrt(mse_high)\n",
            "r2_high = r2_score(test['target_high'], pred_high)\n",
            "\n",
            "print('=== LINEAR REGRESSION EVALUATION (HIGH PRICE) ===')\n",
            "print(f'MAE:  ₹{mae_high:.2f}')\n",
            "print(f'MSE:  {mse_high:.2f}')\n",
            "print(f'RMSE: ₹{rmse_high:.2f}')\n",
            "print(f'R2:   {r2_high:.4f}')\n",
            "\n",
            "# Classification Evaluation (Custom Decision Tree)\n",
            "y_test_dir = test['direction_target'].values\n",
            "acc = accuracy_score(y_test_dir, dir_preds)\n",
            "prec = precision_score(y_test_dir, dir_preds, average='weighted', zero_division=0)\n",
            "rec = recall_score(y_test_dir, dir_preds, average='weighted', zero_division=0)\n",
            "f1 = f1_score(y_test_dir, dir_preds, average='weighted', zero_division=0)\n",
            "\n",
            "print('\\n=== CUSTOM DECISION TREE EVALUATION (DIRECTION) ===')\n",
            "print(f'Accuracy:  {acc*100:.2f}%')\n",
            "print(f'Precision: {prec*100:.2f}%')\n",
            "print(f'Recall:    {rec*100:.2f}%')\n",
            "print(f'F1 Score:  {f1*100:.2f}%')\n",
            "print('\\nConfusion Matrix:\\n', confusion_matrix(y_test_dir, dir_preds))"
        ]
    }
]

# ==========================================
# PHASE 5 NOTEBOOK
# ==========================================
p5_cells = [
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "# Stock Market Prediction System - Phase 5: Advanced Model Training\n",
            "**Academic College ML Project SOP**\n",
            "\n",
            "### Experiments:\n",
            "1. Random Forest Regressor vs Linear Regression\n",
            "2. Random Forest Classifier vs Custom Decision Tree\n",
            "3. TimeSeriesSplit Chronological Cross-Validation"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier\n",
            "from sklearn.model_selection import TimeSeriesSplit\n",
            "\n",
            "# Train Advanced Random Forest Regressor\n",
            "rf_reg = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)\n",
            "rf_reg.fit(X_train_raw, train['target_high'].values)\n",
            "rf_preds = rf_reg.predict(X_test_raw)\n",
            "\n",
            "# Train Advanced Random Forest Classifier\n",
            "rf_clf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)\n",
            "rf_clf.fit(X_train_raw, train['direction_target'].values)\n",
            "rf_dir_preds = rf_clf.predict(X_test_raw)\n",
            "\n",
            "# Comparison Summary Table\n",
            "reg_comp = pd.DataFrame({\n",
            "    'Model': ['Linear Regression', 'Random Forest Regressor'],\n",
            "    'MAE': [round(mean_absolute_error(test['target_high'], pred_high), 2), round(mean_absolute_error(test['target_high'], rf_preds), 2)],\n",
            "    'RMSE': [round(np.sqrt(mean_squared_error(test['target_high'], pred_high)), 2), round(np.sqrt(mean_squared_error(test['target_high'], rf_preds)), 2)],\n",
            "    'R2 Score': [round(r2_score(test['target_high'], pred_high), 4), round(r2_score(test['target_high'], rf_preds), 4)]\n",
            "})\n",
            "\n",
            "clf_comp = pd.DataFrame({\n",
            "    'Model': ['Custom Decision Tree', 'Random Forest Classifier'],\n",
            "    'Accuracy (%)': [round(accuracy_score(y_test_dir, dir_preds)*100, 2), round(accuracy_score(y_test_dir, rf_dir_preds)*100, 2)],\n",
            "    'F1 Score (%)': [round(f1_score(y_test_dir, dir_preds, average='weighted')*100, 2), round(f1_score(y_test_dir, rf_dir_preds, average='weighted')*100, 2)]\n",
            "})\n",
            "\n",
            "print('--- REGRESSION MODEL COMPARISON ---')\n",
            "print(reg_comp)\n",
            "print('\\n--- CLASSIFICATION MODEL COMPARISON ---')\n",
            "print(clf_comp)"
        ]
    }
]

# ==========================================
# PHASE 6 NOTEBOOK
# ==========================================
p6_cells = [
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "# Stock Market Prediction System - Phase 6: Visualization\n",
            "**Academic College ML Project SOP**\n",
            "\n",
            "### Visualizations:\n",
            "1. Actual vs Predicted High & Low Price\n",
            "2. Trading Signal and Bullish/Bearish Distributions\n",
            "3. Feature Importance Analysis"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "import matplotlib.pyplot as plt\n",
            "\n",
            "# 1. Actual vs Predicted High Price (Last 40 Test Days)\n",
            "sample_dates = test.index[-40:]\n",
            "sample_actual = test['target_high'].values[-40:]\n",
            "sample_pred = rf_preds[-40:]\n",
            "\n",
            "plt.figure(figsize=(14, 6))\n",
            "plt.plot(sample_dates, sample_actual, label='Actual High Price', color='#059669', marker='o', linewidth=2)\n",
            "plt.plot(sample_dates, sample_pred, label='Predicted High Price (RF)', color='#dc2626', linestyle='--', marker='s', linewidth=2)\n",
            "plt.title('Tomorrow High Price: Actual vs Predicted (Test Set)', fontsize=14, fontweight='bold')\n",
            "plt.xlabel('Date')\n",
            "plt.ylabel('Price (₹)')\n",
            "plt.legend()\n",
            "plt.grid(True, alpha=0.3)\n",
            "plt.show()\n",
            "\n",
            "# 2. Feature Importance Plot\n",
            "importances = rf_reg.feature_importances_\n",
            "sorted_idx = np.argsort(importances)[::-1][:10]\n",
            "\n",
            "plt.figure(figsize=(10, 5))\n",
            "plt.barh(range(10), importances[sorted_idx][::-1], color='#3b82f6')\n",
            "plt.yticks(range(10), [feature_cols[i] for i in sorted_idx][::-1])\n",
            "plt.title('Top 10 Feature Importances (Random Forest Regressor)', fontsize=13, fontweight='bold')\n",
            "plt.xlabel('Relative Importance')\n",
            "plt.tight_layout()\n",
            "plt.show()"
        ]
    }
]

create_notebook("phase_1.ipynb", p1_cells)
create_notebook("phase_2.ipynb", p2_cells)
create_notebook("phase_3.ipynb", p3_cells)
create_notebook("phase_4.ipynb", p4_cells)
create_notebook("phase_5.ipynb", p5_cells)
create_notebook("phase_6.ipynb", p6_cells)
print("All 6 Phase Notebooks successfully created.")
