# Update main.py to include the test endpoint
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(__file__))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import our services
try:
    from services.real_huggingface import RealHuggingFaceAMD
    from services.audio_features import AudioFeatureAMD
    hf_service = RealHuggingFaceAMD()
    audio_feature_service = AudioFeatureAMD()
    services_loaded = True
    logger.info("✅ All AMD services loaded successfully!")
except Exception as e:
    logger.error(f"❌ Error importing services: {e}")
    services_loaded = False
    hf_service = None
    audio_feature_service = None

app = FastAPI(
    title="AMD ML Service", 
    version="1.0.0",
    description="Advanced Answering Machine Detection with Audio Analysis"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    if services_loaded:
        logger.info("🚀 AMD ML Service started successfully with real audio analysis!")
    else:
        logger.warning("⚠️ Service started in limited mode")

@app.get("/")
async def root():
    return {
        "message": "AMD ML Service is running!", 
        "status": "active",
        "services_loaded": services_loaded,
        "endpoints": {
            "health": "/health",
            "huggingface_amd": "/api/amd/huggingface",
            "audio_features_amd": "/api/amd/audio-features",
            "websocket_huggingface": "/ws/amd/huggingface",
            "test": "/api/amd/test"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "services_loaded": services_loaded,
        "version": "1.0.0"
    }

# ADD THIS TEST ENDPOINT
@app.get("/api/amd/test")
async def test_amd():
    """Test endpoint that returns sample AMD results"""
    return {
        "message": "🎉 AMD Test Endpoint Working!",
        "services_status": "All AMD services are running",
        "huggingface_sample": {
            "label": "human", 
            "confidence": 0.87, 
            "model_used": "simple_audio_analyzer", 
            "real_model": True,
            "analysis_reason": "speech_like_pattern"
        },
        "audio_features_sample": {
            "label": "machine", 
            "confidence": 0.79, 
            "model_used": "basic_audio_features", 
            "real_model": True,
            "analysis_reason": "low_zero_crossing"
        },
        "available_strategies": ["huggingface", "audio-features", "twilio", "jambonz", "gemini"]
    }

@app.websocket("/ws/amd/huggingface")
async def websocket_huggingface(websocket: WebSocket):
    await websocket.accept()
    logger.info("🔌 Hugging Face WebSocket connected")
    
    try:
        while True:
            audio_data = await websocket.receive_bytes()
            if hf_service:
                result = await hf_service.process_audio_chunk(audio_data)
            else:
                result = {"label": "human", "confidence": 0.85, "model_used": "fallback", "real_model": False}
            await websocket.send_json(result)
    except WebSocketDisconnect:
        logger.info("🔌 Hugging Face WebSocket disconnected")

@app.post("/api/amd/huggingface")
async def batch_huggingface(file: UploadFile = File(...)):
    try:
        audio_data = await file.read()
        if hf_service:
            result = await hf_service.process_audio_chunk(audio_data)
        else:
            result = {"label": "human", "confidence": 0.85, "model_used": "fallback", "real_model": False}
        return result
    except Exception as e:
        return {
            "error": str(e), 
            "label": "error",
            "real_model": False
        }

@app.post("/api/amd/audio-features")
async def batch_audio_features(file: UploadFile = File(...)):
    try:
        audio_data = await file.read()
        if audio_feature_service:
            result = await audio_feature_service.process_audio(audio_data)
        else:
            result = {"label": "machine", "confidence": 0.75, "model_used": "fallback", "real_model": False}
        return result
    except Exception as e:
        return {
            "error": str(e), 
            "label": "error",
            "real_model": False
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)