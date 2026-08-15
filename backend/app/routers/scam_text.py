from fastapi import APIRouter  # type: ignore[import]
from pydantic import BaseModel  # type: ignore[import]
try:
    import joblib
except ImportError:  # fallback for environments where joblib is bundled with sklearn
    from sklearn.externals import joblib  # type: ignore[import]
from pathlib import Path

router = APIRouter(prefix="/api/scam-text", tags=["scam-text"])

MODEL_DIR = Path(__file__).parent.parent / "models"
clf = joblib.load(MODEL_DIR / "scam_classifier.pkl")
vectorizer = joblib.load(MODEL_DIR / "vectorizer.pkl")

# index -> word, used to explain which words pushed the score toward "scam"
feature_names = list(vectorizer.get_feature_names_out())
scam_class_index = list(clf.classes_).index("scam")


class TextCheckRequest(BaseModel):
    text: str


class TextCheckResponse(BaseModel):
    verdict: str          # "Low risk" | "Medium risk" | "High risk"
    risk_score: int        # 0-100
    flagged_phrases: list[str]


def score_to_verdict(score: int) -> str:
    if score >= 70:
        return "High risk"
    if score >= 40:
        return "Medium risk"
    return "Low risk"


@router.post("", response_model=TextCheckResponse)
def check_text(payload: TextCheckRequest):
    text = payload.text.strip()
    if not text:
        return TextCheckResponse(verdict="Low risk", risk_score=0, flagged_phrases=[])

    vec = vectorizer.transform([text])
    proba = clf.predict_proba(vec)[0][scam_class_index]
    risk_score = int(round(proba * 100))


    coef = clf.coef_[0]  # logistic regression weights, aligned with feature_names
    present_indices = vec.nonzero()[1]
    word_weights = [(feature_names[i], coef[i]) for i in present_indices]
    word_weights.sort(key=lambda x: x[1], reverse=True)
    flagged = [w for w, weight in word_weights[:5] if weight > 0]

    return TextCheckResponse(
        verdict=score_to_verdict(risk_score),
        risk_score=risk_score,
        flagged_phrases=flagged,
    )