
import React from 'react';
import { ViewType } from '../types';
import { 
  MessageCircle, 
  Image as ImageIcon, 
  Mic2, 
  Layout, 
  Gift, 
  Bot,
  LogOut,
  Cpu,
  CreditCard,
  Home
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const menuItems = [
    { id: ViewType.LANDING, icon: Home, label: 'Home' },
    { id: ViewType.CHAT, icon: MessageCircle, label: 'Ask AI' },
    { id: ViewType.IMAGE, icon: ImageIcon, label: 'Generator' },
    { id: ViewType.VOICE, icon: Mic2, label: 'Voice Maker' },
    { id: ViewType.WEBSITE, icon: Layout, label: 'Web Gen' },
    { id: ViewType.REWARDS, icon: Gift, label: 'Rewards' },
    { id: ViewType.PRICING, icon: CreditCard, label: 'Upgrade' },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-50 flex flex-col h-full py-8 px-4 border-r border-slate-100">
      <div className="flex items-center gap-3 px-2 mb-10 overflow-hidden">
        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shrink-0 shadow-lg">
          <Bot className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-lg text-slate-800 hidden md:block tracking-tight">crocsthepenai</span>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-white shadow-md text-indigo-600 scale-105' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-indigo-600' : 'group-hover:text-indigo-500'}`} />
              <span className={`font-medium hidden md:block ${isActive ? 'text-indigo-600' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="px-3 py-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 hidden md:block">
           <div className="flex items-center gap-2 mb-1">
             <Cpu className="w-4 h-4 text-indigo-500" />
             <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Engine</span>
           </div>
           <p className="text-[11px] font-medium text-slate-500">Powered by Gemini AI</p>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-6 h-6" />
          <span className="font-medium hidden md:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
