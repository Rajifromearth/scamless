"""
Combines the Kaggle SMS Spam + Phishing Email datasets into a single
data/full_scam_dataset.csv with the two columns train_scam_classifier.py
expects: label (scam / legit), text.
"""

import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"

rows = []

# --- SMS Spam Collection ---
sms_path = DATA_DIR / "sms_spam.csv"
if sms_path.exists():
    df = pd.read_csv(sms_path, encoding="latin-1")
    print(f"sms_spam.csv columns: {list(df.columns)}")

    col_map_candidates = [
        ("v1", "v2"),
        ("label", "text"),
        ("label", "message"),
        ("Category", "Message"),
    ]
    matched = None
    for label_col, text_col in col_map_candidates:
        if label_col in df.columns and text_col in df.columns:
            matched = (label_col, text_col)
            break

    if matched:
        label_col, text_col = matched
        for _, row in df.iterrows():
            raw_label = str(row[label_col]).strip().lower()
            label = "scam" if raw_label in ("spam", "1", "scam", "phishing") else "legit"
            rows.append((label, str(row[text_col])))
        print(f"Added {len(df)} rows from sms_spam.csv using columns {matched}")
    else:
        print("!! Could not auto-detect columns in sms_spam.csv — edit this script's col_map_candidates.")
else:
    print("sms_spam.csv not found, skipping.")

# --- Phishing Emails ---
phish_path = DATA_DIR / "phishing_emails.csv"
if phish_path.exists():
    df = pd.read_csv(phish_path, encoding="latin-1")
    print(f"phishing_emails.csv columns: {list(df.columns)}")

    col_map_candidates = [
        ("Email Type", "Email Text"),
        ("label", "text"),
        ("type", "text"),
        ("Category", "Message"),
    ]
    matched = None
    for label_col, text_col in col_map_candidates:
        if label_col in df.columns and text_col in df.columns:
            matched = (label_col, text_col)
            break

    if matched:
        label_col, text_col = matched
        for _, row in df.iterrows():
            raw_label = str(row[label_col]).strip().lower()
            label = "scam" if "phish" in raw_label or raw_label in ("1", "scam", "spam") else "legit"
            rows.append((label, str(row[text_col])))
        print(f"Added {len(df)} rows from phishing_emails.csv using columns {matched}")
    else:
        print("!! Could not auto-detect columns in phishing_emails.csv — edit this script's col_map_candidates.")
else:
    print("phishing_emails.csv not found, skipping.")

# --- Also fold in the hand-written starter set ---
starter_path = DATA_DIR / "starter_scam_dataset.csv"
if starter_path.exists():
    df = pd.read_csv(starter_path)
    for _, row in df.iterrows():
        rows.append((row["label"], row["text"]))
    print(f"Added {len(df)} rows from starter_scam_dataset.csv")

# --- Save combined dataset ---
if rows:
    out_df = pd.DataFrame(rows, columns=["label", "text"])
    out_df = out_df.dropna(subset=["text"])
    out_df = out_df[out_df["text"].str.strip() != ""]
    out_path = DATA_DIR / "full_scam_dataset.csv"
    out_df.to_csv(out_path, index=False)
    print(f"\nSaved {len(out_df)} total rows to {out_path}")
    print(out_df["label"].value_counts())
else:
    print("\nNo data was combined — check that the Kaggle CSVs are in data/ with the expected names.")