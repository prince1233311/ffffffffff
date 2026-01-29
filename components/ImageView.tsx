
import React, { useState } from 'react';
import { Image as ImageIcon, Send, Loader2, Download, Diamond, Sparkles } from 'lucide-react';
import { generateImage } from '../services/geminiService';

interface ImageViewProps {
  spendDiamonds: (amount: number) => boolean;
  diamonds: number;
  isUnlimited?: boolean;
}

const ImageView: React.FC<ImageViewProps> = ({ spendDiamonds, diamonds, isUnlimited }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    if (!spendDiamonds(10)) {
      alert("Not enough diamonds! Image generation costs 10 💎");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const url = await generateImage(prompt);
      if (url) setResult(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          Artistic Generator <Sparkles className="w-7 h-7 text-amber-400" />
        </h2>
        <p className="text-slate-500 mt-2">Bring your imagination to life. {isUnlimited ? 'Unlimited generations enabled.' : 'Downloads enabled.'}</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-xl aspect-square rounded-[40px] border-8 border-white bg-white relative overflow-hidden shadow-2xl flex items-center justify-center group">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
              <p className="text-slate-400 font-bold animate-pulse">Painting your vision...</p>
            </div>
          ) : result ? (
            <>
              <img src={result} alt="AI Generated" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a 
                  href={result} 
                  download={`lumina-gen-${Date.now()}.png`} 
                  className="px-6 py-3 bg-white rounded-2xl hover:scale-110 transition-transform text-indigo-600 font-bold flex items-center gap-2"
                >
                  <Download className="w-5 h-5" /> Download Image
                </a>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-slate-200 gap-4">
              <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border-4 border-dashed border-slate-100">
                <ImageIcon className="w-10 h-10" />
              </div>
              <p className="font-bold text-slate-300">Awaiting your prompt...</p>
            </div>
          )}
        </div>

        <div className="w-full max-w-xl relative">
          <div className="absolute -top-10 right-0 flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100 text-[11px] font-bold text-amber-700">
            <Diamond className="w-3 h-3 fill-amber-300" />
            COST: {isUnlimited ? 'FREE' : '10 DIAMONDS'}
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your masterpiece..."
            className="w-full px-6 py-5 bg-white border-4 border-white rounded-[30px] focus:outline-none focus:ring-4 focus:ring-indigo-50 shadow-xl text-slate-800 resize-none h-32 leading-relaxed font-medium"
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="absolute right-4 bottom-4 px-8 py-3 gradient-bg text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            Generate <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageView;
