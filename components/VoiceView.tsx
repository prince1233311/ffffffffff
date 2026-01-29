
import React, { useState, useRef } from 'react';
import { Mic2, Play, Volume2, Loader2, Diamond, Radio, Download } from 'lucide-react';
import { generateVoice, decodeAudioData } from '../services/geminiService';
import { VoiceOption } from '../types';

const VOICES: VoiceOption[] = [
  { id: 'Zephyr', name: 'Zephyr', description: 'Deep & Energetic', previewColor: 'bg-blue-500' },
  { id: 'Kore', name: 'Kore', description: 'Warm & Friendly', previewColor: 'bg-green-500' },
  { id: 'Puck', name: 'Puck', description: 'High & Playful', previewColor: 'bg-amber-500' },
  { id: 'Charon', name: 'Charon', description: 'Serious & Calm', previewColor: 'bg-slate-500' },
];

interface VoiceViewProps {
  spendDiamonds: (amount: number) => boolean;
  diamonds: number;
  isUnlimited?: boolean;
}

const VoiceView: React.FC<VoiceViewProps> = ({ spendDiamonds, diamonds, isUnlimited }) => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastAudio, setLastAudio] = useState<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleSynthesize = async () => {
    if (!text.trim() || loading) return;

    if (!spendDiamonds(5)) {
      alert("Not enough diamonds! Voice synthesis costs 5 💎");
      return;
    }

    setLoading(true);
    try {
      const audioBytes = await generateVoice(text, selectedVoice);
      if (audioBytes) {
        setLastAudio(audioBytes);
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
        setIsPlaying(true);
        source.onended = () => setIsPlaying(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAudio = () => {
    if (!lastAudio) return;
    const blob = new Blob([lastAudio], { type: 'audio/pcm' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `voice-${selectedVoice.toLowerCase()}.pcm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          Professional Voice Studio <Mic2 className="w-7 h-7 text-indigo-600" />
        </h2>
        <p className="text-slate-500 mt-2">Convert any text into natural human-like speech.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 flex-1">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[30px] border-4 border-white shadow-xl">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Select Personality</h3>
            <div className="space-y-3">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                    selectedVoice === v.id 
                      ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500 ring-offset-2' 
                      : 'bg-slate-50 border-transparent hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className={`w-3 h-3 rounded-full ${v.previewColor}`} />
                    <div>
                      <div className="font-bold text-slate-800">{v.name}</div>
                      <div className="text-xs text-slate-500">{v.description}</div>
                    </div>
                  </div>
                  {selectedVoice === v.id && <Radio className="w-5 h-5 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[30px] border-4 border-white shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                <Diamond className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-bold text-slate-700">
                {isUnlimited ? 'Unlimited' : '5 Diamonds'} / Use
              </span>
            </div>
            {lastAudio && (
               <button 
                onClick={downloadAudio}
                className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors text-slate-600"
                title="Download Audio"
               >
                 <Download className="w-5 h-5" />
               </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What should I say?"
            className="flex-1 w-full p-8 bg-white border-4 border-white rounded-[40px] focus:outline-none focus:ring-4 focus:ring-indigo-50 shadow-2xl text-slate-800 resize-none leading-relaxed text-lg"
          />
          <button
            onClick={handleSynthesize}
            disabled={!text.trim() || loading}
            className="w-full py-6 gradient-bg text-white font-extrabold text-xl rounded-[30px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-4"
          >
            {loading ? (
              <>Synthesizing... <Loader2 className="w-6 h-6 animate-spin" /></>
            ) : isPlaying ? (
              <>Playing Audio... <Volume2 className="w-6 h-6 animate-bounce" /></>
            ) : (
              <>Generate Voice <Play className="w-6 h-6 fill-white" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceView;
