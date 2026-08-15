from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import io
from pathlib import Path

router = APIRouter(prefix="/api/image-check", tags=["image-check"])

MODEL_PATH = Path(__file__).parent.parent / "models" / "image_detector.pt"

# Class order from training: ['FAKE', 'REAL'] -> index 0 = FAKE, index 1 = REAL
CLASSES = ["FAKE", "REAL"]

device = torch.device("cpu")

model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, 2)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()
model = model.to(device)

transform = transforms.Compose([
    transforms.Resize((32, 32)),
    transforms.ToTensor(),
    transforms.Normalize([0.5] * 3, [0.5] * 3),
])


class ImageCheckResponse(BaseModel):
    verdict: str
    ai_generated_probability: float
    note: str


@router.post("", response_model=ImageCheckResponse)
async def check_image(file: UploadFile = File(...)):
    contents = await file.read()

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        return ImageCheckResponse(
            verdict="Error",
            ai_generated_probability=0.0,
            note="Could not read this file as an image.",
        )

    tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.softmax(outputs, dim=1)[0]

    fake_prob = probs[CLASSES.index("FAKE")].item()

    if fake_prob >= 0.7:
        verdict = "Likely AI-generated"
    elif fake_prob >= 0.4:
        verdict = "Uncertain"
    else:
        verdict = "Likely real"

    return ImageCheckResponse(
        verdict=verdict,
        ai_generated_probability=round(fake_prob, 3),
        note=f"Model confidence: {round(fake_prob * 100, 1)}% likely AI-generated.",
    )