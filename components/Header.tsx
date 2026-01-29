
import React from 'react';
import { Diamond, Bell, Sparkles } from 'lucide-react';
import { PlanType } from '../types';

interface HeaderProps {
  diamonds: number;
  plan: PlanType;
  onRewardClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ diamonds, plan, onRewardClick }) => {
  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-slate-50">
      <div className="flex items-center gap-4">
        <h2 className="text-slate-400 font-medium hidden sm:block">Welcome back, Explorer</h2>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          plan === 'unlimited' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
          plan === 'daily200' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
          'bg-slate-100 text-slate-500 border border-slate-200'
        }`}>
          {plan} Plan
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onRewardClick}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-100 rounded-full shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="w-6 h-6 flex items-center justify-center bg-purple-50 rounded-full group-hover:bg-purple-100">
            {plan === 'unlimited' ? (
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-200" />
            ) : (
              <Diamond className="w-4 h-4 text-purple-600 fill-purple-300" />
            )}
          </div>
          <span className="font-bold text-slate-700">
            {plan === 'unlimited' ? '∞' : diamonds}
          </span>
        </button>

        <button className="p-2 text-slate-400 hover:text-slate-600 relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full"></span>
        </button>

        <div className="w-10 h-10 rounded-full border-2 border-indigo-100 p-0.5 overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors">
          <img 
            src="https://picsum.photos/seed/user/100" 
            alt="User" 
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
