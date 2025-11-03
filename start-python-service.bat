# Create a simple batch file that will definitely work
echo off
echo 🚀 Starting Real Python ML Service...
cd python-service

echo 📦 Creating virtual environment...
python -m venv venv

echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

echo 📚 Installing dependencies...
pip install fastapi uvicorn transformers torch torchaudio librosa numpy scikit-learn joblib python-multipart

echo 🎯 Starting FastAPI server...
echo 📡 ML Service will be available at: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload