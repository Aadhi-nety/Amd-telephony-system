import librosa
import numpy as np
from typing import Dict, Any
import logging
import os

logger = logging.getLogger(__name__)

class AudioFeatureAMD:
    def __init__(self):
        pass
    
    async def process_audio(self, audio_data: bytes) -> Dict[str, Any]:
        try:
            temp_path = "temp_audio.wav"
            with open(temp_path, 'wb') as f:
                f.write(audio_data)
            
            result = await self.analyze_audio_file(temp_path)
            
            if os.path.exists(temp_path):
                os.remove(temp_path)
            
            logger.info(f"🎵 Audio Feature AMD: {result['label']} (confidence: {result['confidence']:.3f})")
            
            return result
            
        except Exception as e:
            logger.error(f"Error in audio feature AMD: {e}")
            return {
                "label": "uncertain",
                "confidence": 0.5,
                "error": str(e)
            }
    
    async def analyze_audio_file(self, file_path: str) -> Dict[str, Any]:
        try:
            y, sr = librosa.load(file_path, sr=22050)
            
            features = []
            
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            features.extend(np.mean(mfcc, axis=1))
            features.extend(np.std(mfcc, axis=1))
            
            spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
            features.append(np.mean(spectral_centroid))
            features.append(np.std(spectral_centroid))
            
            zcr = librosa.feature.zero_crossing_rate(y)
            features.append(np.mean(zcr))
            features.append(np.std(zcr))
            
            rms = librosa.feature.rms(y=y)
            features.append(np.mean(rms))
            features.append(np.std(rms))
            
            feature_array = np.array(features)
            
            return self.rule_based_classification(feature_array)
            
        except Exception as e:
            return {"label": "error", "confidence": 0.0, "error": str(e)}
    
    def rule_based_classification(self, features: np.ndarray) -> Dict[str, Any]:
        mfcc_variance = np.mean(features[13:26]) if len(features) > 26 else 0.5
        spectral_centroid = features[26] if len(features) > 26 else 1000
        zcr = features[28] if len(features) > 28 else 0.1
        
        if spectral_centroid > 1500 and mfcc_variance > 0.3:
            return {"label": "human", "confidence": 0.75}
        elif zcr < 0.05 and spectral_centroid < 800:
            return {"label": "machine", "confidence": 0.70}
        else:
            return {"label": "uncertain", "confidence": 0.5}