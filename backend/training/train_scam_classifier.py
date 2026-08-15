try:
    import pandas as pd
except ImportError:
    pd = None

import csv
import pickle
from pathlib import Path

try:
    from sklearn.feature_extraction.text import TfidfVectorizer  # type: ignore[import]
    from sklearn.linear_model import LogisticRegression  # type: ignore[import]
    from sklearn.model_selection import train_test_split  # type: ignore[import]
    from sklearn.metrics import classification_report  # type: ignore[import]
except ImportError as e:
    raise ImportError("scikit-learn is required. Install it with: pip install scikit-learn") from e

DATA_DIR = Path(__file__).parent.parent / "data"

def load_dataset(data_path):
    if pd is not None:
        df = pd.read_csv(data_path)
        df = df.dropna(subset=["label", "text"])
        df["label"] = df["label"].str.strip().str.lower()
        return df["text"].astype(str).tolist(), df["label"].tolist()

    texts = []
    labels = []
    with open(data_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row:
                continue
            text = row.get("text")
            label = row.get("label")
            if text is None or label is None:
                continue
            text = text.strip()
            label = label.strip().lower()
            if not text or not label:
                continue
            texts.append(text)
            labels.append(label)
    return texts, labels
MODEL_DIR = Path(__file__).parent.parent / "app" / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

full_path = DATA_DIR / "full_scam_dataset.csv"
starter_path = DATA_DIR / "starter_scam_dataset.csv"
data_path = full_path if full_path.exists() else starter_path
print(f"Loading dataset from: {data_path}")

texts, labels = load_dataset(data_path)

X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.2, random_state=42, stratify=labels
)

vectorizer = TfidfVectorizer(
    lowercase=True, stop_words="english", ngram_range=(1, 2), max_features=5000,
)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

clf = LogisticRegression(max_iter=1000, class_weight="balanced")
clf.fit(X_train_vec, y_train)

print("\n--- Evaluation ---")
preds = clf.predict(X_test_vec)
print(classification_report(y_test, preds))

with open(MODEL_DIR / "scam_classifier.pkl", "wb") as f:
    pickle.dump(clf, f, protocol=pickle.HIGHEST_PROTOCOL)
with open(MODEL_DIR / "vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f, protocol=pickle.HIGHEST_PROTOCOL)
print(f"\nSaved model + vectorizer to {MODEL_DIR}")