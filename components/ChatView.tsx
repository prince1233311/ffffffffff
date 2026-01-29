
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Diamond, Download } from 'lucide-react';
import { Message } from '../types';
import { geminiChat } from '../services/geminiService';

interface ChatViewProps {
  spendDiamonds: (amount: number) => boolean;
  diamonds: number;
  isUnlimited?: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({ spendDiamonds, diamonds, isUnlimited }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (!spendDiamonds(1)) {
      alert("Not enough diamonds! 💎");
      return;
    }

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const response = await geminiChat(history, input);
      setMessages(prev => [...prev, { role: 'model', text: response || 'No response.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error." }]);
    } finally {
      setLoading(false);
    }
  };

  const downloadChat = () => {
    if (messages.length === 0) return;
    const content = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat-transcript-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-xl font-bold text-slate-800">AI Dialogue</h3>
        {messages.length > 0 && (
          <button 
            onClick={downloadChat}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-full transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download Chat
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-4 px-2 custom-scrollbar" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-60">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <Bot className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Crocsthepenai Intelligence</h3>
            <p className="text-slate-500 max-w-sm mt-2">
              Gemini 3 Pro is ready to assist you. {isUnlimited ? 'Unlimited Access Enabled' : 'Each message costs 1 Diamond.'}
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'model' && (
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                <Bot className="text-white w-5 h-5" />
              </div>
            )}
            <div className={`max-w-[80%] px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {m.text}
            </div>
            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                <User className="text-slate-500 w-5 h-5" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center animate-pulse">
              <Bot className="text-white w-5 h-5" />
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
              <span className="text-slate-400 italic">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 relative group">
        <div className="absolute -top-10 left-0 text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-100 flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
          <Diamond className="w-3 h-3 fill-indigo-100" />
          COST: {isUnlimited ? 'FREE' : '1 DIAMOND'}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="w-full pl-6 pr-16 py-5 bg-white border border-slate-200 rounded-[30px] focus:outline-none focus:ring-4 focus:ring-indigo-50 shadow-lg transition-all text-slate-800"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="absolute right-2 top-2 bottom-2 px-6 gradient-bg text-white rounded-[24px] hover:scale-95 active:scale-90 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatView;
