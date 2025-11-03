export interface AMDResult {
  label: 'human' | 'machine' | 'uncertain' | 'error';
  confidence: number;
  human_probability?: number;
  machine_probability?: number;
  processing_time?: number;
  model_used?: string;
  error?: string;
}

export class RealAMDService {
  private pythonServiceUrl = 'http://localhost:8000';

  async processWithHuggingFace(audioData: ArrayBuffer): Promise<AMDResult> {
    try {
      const response = await fetch(`${this.pythonServiceUrl}/api/amd/huggingface`, {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/wav',
        },
        body: audioData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Hugging Face AMD error:', error);
      return {
        label: 'error',
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async processWithAudioFeatures(audioData: ArrayBuffer): Promise<AMDResult> {
    try {
      const response = await fetch(`${this.pythonServiceUrl}/api/amd/audio-features`, {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/wav',
        },
        body: audioData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Audio Features AMD error:', error);
      return {
        label: 'error',
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const realAMDService = new RealAMDService();