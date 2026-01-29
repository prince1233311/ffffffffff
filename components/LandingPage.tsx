
import React from 'react';
import { Sparkles, Zap, Shield, Rocket, Bot, Cpu } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-md">
            <Bot className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">crocsthepenai</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm font-medium">
             <Cpu className="w-4 h-4" /> Powered by Gemini
          </div>
          <button 
            onClick={onGetStarted}
            className="px-6 py-2 rounded-full font-semibold border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
          >
            Sign In
          </button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 mb-8 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-slate-600 uppercase tracking-wider">Next-Gen Intelligence</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 leading-tight mb-8">
          The Premier <br />
          <span className="gradient-text">AI Multiverse</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12">
          Experience the power of Gemini inside <span className="text-indigo-600 font-bold">crocsthepenai</span>. 
          Generate professional websites, artistic images, and high-fidelity voices effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto px-10 py-5 gradient-bg text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-200 hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            Get Started Free <Rocket className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-start">
             <p className="text-sm text-slate-400 font-medium">100 free diamonds included</p>
             <p className="text-[10px] text-indigo-400 font-bold uppercase">No credit card required</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Gemini 3 Pro", text: "Driven by Google's latest and most capable AI models for superior reasoning." },
            { icon: Zap, title: "Diamond Rewards", text: "Claim 50 free diamonds every week to keep your creative momentum flowing." },
            { icon: Bot, title: "Universal Creation", text: "From coding websites to synthesizing multi-speaker audio, it's all here." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
