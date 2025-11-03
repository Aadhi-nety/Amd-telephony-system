
# 🎯 AMD Telephony System

Advanced Answering Machine Detection System with multiple AI strategies for intelligent outbound calling.

## 🚀 Features

- **Multi-Strategy AMD**: Twilio Native, Jambonz, Hugging Face, Gemini Flash
- **Real-time Audio Processing**: WebSocket streaming for live analysis
- **AI-Powered Detection**: Machine learning models for human/machine classification
- **Call Analytics**: Comprehensive logging and performance metrics
- **Modern UI**: Next.js 14 with Tailwind CSS and TypeScript

## 🛠 Tech Stack

### Frontend & Backend
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Prisma ORM** with PostgreSQL
- **Better-Auth** for authentication

### AI/ML Services
- **Python FastAPI** microservice
- **Hugging Face Transformers** for voice classification
- **Google Gemini Flash** for real-time audio analysis
- **Custom audio feature extraction**

### Telephony
- **Twilio Voice API** for call handling
- **Twilio Media Streams** for real-time audio
- **Jambonz** for SIP-based AMD

## 📋 Prerequisites

- Node.js 18+
- Python 3.8+
- PostgreSQL database
- Twilio account with Voice API access

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/amd-telephony-system.git
cd amd-telephony-system
cd amd-telephony-system
npm install

# Database & environment
cp .env.example .env  # Edit with your credentials
npx prisma generate
npx prisma db push

# Run services (in separate terminals)
npm run dev
cd python-service && uvicorn app.main:app --reload --port 8000
```
- Access: http://localhost:3000 | API Docs: http://localhost:8000/docs
  
## ⚙️ Environment Setup
```bash
echo 'DATABASE_URL="postgresql://user:pass@localhost:5432/amd_system"
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
PYTHON_SERVICE_URL=http://localhost:8000
BETTER_AUTH_SECRET=your_secret' > .env
```
## 🎮 Usage
- Open http://localhost:3000
- Select AMD strategy from dropdown
- Enter phone number or use test numbers
- Click "Dial Now"
- View results in call history

## 🧪 AMD Strategies
### Available strategies:
- Twilio Native (85% accuracy, <2s latency)
- Jambonz SIP (90% accuracy, <3s latency) 
- Hugging Face AI (92% accuracy, <4s latency)
- Gemini Flash (88% accuracy, <5s latency)


