from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import scam_text, link_check, image_detect

app = FastAPI(title="Scamless API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scam_text.router)
app.include_router(link_check.router)
app.include_router(image_detect.router)


@app.get("/")
def root():
    return {"status": "Scamless API is running"}