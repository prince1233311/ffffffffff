
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

// Fix: Always use process.env.API_KEY directly as a named parameter as per standard guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Use gemini-3-pro-preview for complex reasoning tasks like multi-turn chat conversations.
export const geminiChat = async (history: any[], message: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
  });
  return response.text;
};

// Fix: gemini-2.5-flash-image is the recommended default for image generation tasks.
export const generateImage = async (prompt: string): Promise<string | undefined> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};

// Fix: Use gemini-2.5-flash-preview-tts for high-quality text-to-speech generation.
export const generateVoice = async (text: string, voiceName: string): Promise<Uint8Array | undefined> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    return decodeBase64(base64Audio);
  }
  return undefined;
};

// Fix: Use gemini-3-pro-preview for complex structured JSON generation tasks like website layouts.
export const generateWebLayout = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a structured website JSON for: ${prompt}. Include title, a catchy description, a vibrant hex primaryColor, and 3 content sections with heading and detailed text.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          primaryColor: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                content: { type: Type.STRING },
              },
              required: ["heading", "content"]
            }
          }
        },
        required: ["title", "description", "primaryColor", "sections"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

// Utils: Custom base64 decoding function for handling raw PCM audio data streams.
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Fix: Implementation for raw PCM audio decoding as required by the Gemini voice synthesis API.
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
