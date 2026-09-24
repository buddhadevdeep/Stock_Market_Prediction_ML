"""
Custom Decision Tree Classifier Implemented From Scratch (Without scikit-learn)
================================================================================
Academic SOP Phase 3 Requirement:
This module contains an educational, transparent, and robust implementation of a 
Classification Decision Tree using the Gini Impurity metric for split selection.

Mathematical Background:
------------------------
1. Gini Impurity:
   For a dataset with C classes, the Gini Impurity measures the probability of 
   incorrectly classifying a randomly chosen element if it were randomly labeled 
   according to the distribution of labels in the subset.
   
   Formula:
       Gini(D) = 1 - sum_{i=1}^{C} (p_i)^2
       where p_i is the proportion of samples belonging to class i in dataset D.
       
       - Gini = 0.0 indicates absolute purity (all samples belong to the exact same class).
       - Maximum Gini for 2 classes = 0.5 (balanced 50-50 uncertainty).

2. Split Evaluation & Information Gain:
   For a candidate split on feature 'j' with threshold 't' dividing dataset D into 
   subsets D_left and D_right:
   
       Gini_split = (|D_left| / |D|) * Gini(D_left) + (|D_right| / |D|) * Gini(D_right)
       
   The optimal split minimizes Gini_split (or maximizes Gini Reduction / Information Gain).
"""

import numpy as np
from typing import Optional, Dict, Any, Union, Tuple

class Node:
    """
    Represents a single node within the Decision Tree.
    Can either be an internal decision node (with a split condition) or a leaf node.
    """
    def __init__(
        self,
        feature_idx: Optional[int] = None,
        threshold: Optional[float] = None,
        left: Optional['Node'] = None,
        right: Optional['Node'] = None,
        *,
        value: Optional[int] = None,
        probabilities: Optional[Dict[int, float]] = None,
        samples_count: int = 0
    ):
        # Internal decision node attributes
        self.feature_idx = feature_idx      # Index of feature used for splitting
        self.threshold = threshold          # Cutoff threshold value for split (X[:, j] <= threshold)
        self.left = left                    # Left child subtree (condition is TRUE)
        self.right = right                  # Right child subtree (condition is FALSE)
        
        # Leaf node attributes
        self.value = value                  # Majority class prediction
        self.probabilities = probabilities  # Empirical class probabilities at this leaf {class: prob}
        self.samples_count = samples_count  # Number of training samples reaching this node

    @property
    def is_leaf(self) -> bool:
        """Returns True if this node is a terminal leaf node."""
        return self.value is not None


class CustomDecisionTreeClassifier:
    """
    Manual Decision Tree Classifier based on Gini Index.
    
    Parameters:
        max_depth (int): Maximum allowable depth of the decision tree to prevent overfitting.
        min_samples_split (int): Minimum number of samples required to attempt a split at a node.
        min_samples_leaf (int): Minimum number of samples allowed in a leaf node.
    """
    def __init__(
        self,
        max_depth: int = 5,
        min_samples_split: int = 5,
        min_samples_leaf: int = 2
    ):
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.min_samples_leaf = min_samples_leaf
        self.root: Optional[Node] = None
        self.classes_: np.ndarray = np.array([])
        self.n_features_: int = 0

    def _gini_impurity(self, y: np.ndarray) -> float:
        """
        Calculates the Gini Impurity of a label array y.
        Formula: Gini = 1 - sum(p_i^2)
        """
        n_samples = len(y)
        if n_samples == 0:
            return 0.0
            
        _, counts = np.unique(y, return_counts=True)
        probabilities = counts / n_samples
        gini = 1.0 - np.sum(probabilities ** 2)
        return float(gini)

    def _split_dataset(
        self, 
        X: np.ndarray, 
        y: np.ndarray, 
        feature_idx: int, 
        threshold: float
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """
        Partitions the dataset into two subsets based on: X[:, feature_idx] <= threshold
        """
        left_mask = X[:, feature_idx] <= threshold
        right_mask = ~left_mask
        
        return X[left_mask], y[left_mask], X[right_mask], y[right_mask]

    def _best_split(self, X: np.ndarray, y: np.ndarray):
        """
        Iterates over all features and unique feature values to find the 
        (feature_idx, threshold) combination that minimizes the weighted Gini Impurity.
        """
        best_gini = float("inf")
        best_feature = None
        best_thresh = None
        n_samples, n_features = X.shape
        
        # If not enough samples to split, return None
        if n_samples < self.min_samples_split:
            return None, None

        # Base Gini impurity before split
        parent_gini = self._gini_impurity(y)
        if parent_gini == 0.0:
            return None, None  # Node is already 100% pure

        # Evaluate candidate thresholds across each feature
        for feat_idx in range(n_features):
            col_values = X[:, feat_idx]
            # Use percentiles / unique values to evaluate split points efficiently
            unique_vals = np.unique(col_values)
            if len(unique_vals) <= 1:
                continue

            # Check midpoints between consecutive sorted unique values
            # To maintain fast training on large tabular datasets, take up to 25 candidate thresholds
            if len(unique_vals) > 25:
                thresholds = np.percentile(unique_vals, np.linspace(5, 95, 25))
            else:
                thresholds = (unique_vals[:-1] + unique_vals[1:]) / 2.0

            for thresh in thresholds:
                left_mask = col_values <= thresh
                n_left = np.sum(left_mask)
                n_right = n_samples - n_left

                # Check min_samples_leaf constraint
                if n_left < self.min_samples_leaf or n_right < self.min_samples_leaf:
                    continue

                y_left = y[left_mask]
                y_right = y[~left_mask]

                # Calculate weighted Gini impurity
                gini_left = self._gini_impurity(y_left)
                gini_right = self._gini_impurity(y_right)
                weighted_gini = (n_left / n_samples) * gini_left + (n_right / n_samples) * gini_right

                if weighted_gini < best_gini:
                    best_gini = weighted_gini
                    best_feature = feat_idx
                    best_thresh = thresh

        return best_feature, best_thresh

    def _create_leaf(self, y: np.ndarray) -> Node:
        """
        Creates a terminal leaf node holding the majority class label and class probability distribution.
        """
        vals, counts = np.unique(y, return_counts=True)
        majority_class = vals[np.argmax(counts)]
        
        # Compute empirical probabilities for all known global classes
        prob_dict = {c: 0.0 for c in self.classes_}
        total = len(y)
        for val, count in zip(vals, counts):
            prob_dict[val] = float(count / total) if total > 0 else 0.0

        return Node(
            value=majority_class,
            probabilities=prob_dict,
            samples_count=len(y)
        )

    def _build_tree(self, X: np.ndarray, y: np.ndarray, depth: int = 0) -> Node:
        """
        Recursively builds the decision tree using greedy best-split selection.
        
        Stopping Conditions:
        1. Max depth reached (depth >= max_depth)
        2. Pure node (Gini = 0.0, only 1 unique class remains)
        3. Insufficient samples to split (len(y) < min_samples_split)
        4. No valid split found that respects min_samples_leaf
        """
        n_samples = len(y)
        unique_classes = np.unique(y)

        # Check stopping criteria
        if (depth >= self.max_depth or 
            len(unique_classes) == 1 or 
            n_samples < self.min_samples_split):
            return self._create_leaf(y)

        # Search for optimal split
        feat_idx, thresh = self._best_split(X, y)
        if feat_idx is None:
            return self._create_leaf(y)

        # Split data and recursively build left & right child nodes
        left_mask = X[:, feat_idx] <= thresh
        X_left, y_left = X[left_mask], y[left_mask]
        X_right, y_right = X[~left_mask], y[~left_mask]

        left_child = self._build_tree(X_left, y_left, depth + 1)
        right_child = self._build_tree(X_right, y_right, depth + 1)

        return Node(
            feature_idx=feat_idx,
            threshold=thresh,
            left=left_child,
            right=right_child,
            samples_count=n_samples
        )

    def fit(self, X: Union[np.ndarray, list], y: Union[np.ndarray, list]):
        """
        Fits the Custom Decision Tree Classifier to the training data.
        
        Parameters:
            X (np.ndarray): 2D array of shape (n_samples, n_features)
            y (np.ndarray): 1D array of shape (n_samples,) containing class labels
        """
        X = np.asarray(X, dtype=float)
        y = np.asarray(y)
        
        self.classes_ = np.unique(y)
        self.n_features_ = X.shape[1]
        
        self.root = self._build_tree(X, y, depth=0)
        return self

    def _predict_sample(self, node: Node, sample: np.ndarray) -> int:
        """Traverses tree recursively for a single sample to return class prediction."""
        if node.is_leaf:
            return node.value
            
        if sample[node.feature_idx] <= node.threshold:
            return self._predict_sample(node.left, sample)
        else:
            return self._predict_sample(node.right, sample)

    def _predict_proba_sample(self, node: Node, sample: np.ndarray) -> np.ndarray:
        """Traverses tree recursively for a single sample to return class probability vector."""
        if node.is_leaf:
            return np.array([node.probabilities.get(c, 0.0) for c in self.classes_])
            
        if sample[node.feature_idx] <= node.threshold:
            return self._predict_proba_sample(node.left, sample)
        else:
            return self._predict_proba_sample(node.right, sample)

    def predict(self, X: Union[np.ndarray, list]) -> np.ndarray:
        """
        Predicts classes for an array of input samples.
        """
        X = np.asarray(X, dtype=float)
        if self.root is None:
            raise RuntimeError("Model has not been fitted yet. Call fit() first.")
        return np.array([self._predict_sample(self.root, sample) for sample in X])

    def predict_proba(self, X: Union[np.ndarray, list]) -> np.ndarray:
        """
        Predicts class probabilities for an array of input samples.
        Returns array of shape (n_samples, n_classes).
        """
        X = np.asarray(X, dtype=float)
        if self.root is None:
            raise RuntimeError("Model has not been fitted yet. Call fit() first.")
        return np.array([self._predict_proba_sample(self.root, sample) for sample in X])

    def get_rules_summary(self, feature_names: Optional[list] = None, max_lines: int = 15) -> list:
        """
        Returns a human-readable list of decision rules extracted from the tree for college viva / UI display.
        """
        lines = []
        if self.root is None:
            return ["Tree is empty."]
            
        def recurse(node: Node, depth: int = 0):
            if len(lines) >= max_lines:
                return
            indent = "  " * depth
            if node.is_leaf:
                lines.append(f"{indent}--> Leaf [Predict Class: {node.value} | Samples: {node.samples_count}]")
            else:
                f_name = feature_names[node.feature_idx] if feature_names and node.feature_idx < len(feature_names) else f"Feature_{node.feature_idx}"
                lines.append(f"{indent}IF {f_name} <= {node.threshold:.4f} (Samples: {node.samples_count}):")
                recurse(node.left, depth + 1)
                lines.append(f"{indent}ELSE ({f_name} > {node.threshold:.4f}):")
                recurse(node.right, depth + 1)

        recurse(self.root)
        return lines
