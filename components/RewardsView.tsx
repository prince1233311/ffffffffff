
import React, { useState, useEffect } from 'react';
import { Gift, Diamond, Clock, Trophy, CheckCircle2, Star } from 'lucide-react';

interface RewardsViewProps {
  lastClaimed: number | null;
  onClaim: () => boolean;
  diamonds: number;
}

const RewardsView: React.FC<RewardsViewProps> = ({ lastClaimed, onClaim, diamonds }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const nextClaim = lastClaimed ? lastClaimed + oneWeek : 0;
      
      if (now >= nextClaim) {
        setCanClaim(true);
        setTimeLeft('READY TO CLAIM!');
      } else {
        setCanClaim(false);
        const diff = nextClaim - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${mins}m remaining`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastClaimed]);

  const handleClaim = () => {
    if (onClaim()) {
      alert("Success! 50 Diamonds added to your balance. 💎");
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-yellow-50 rounded-3xl mb-6 ring-8 ring-yellow-50/50">
          <Trophy className="w-12 h-12 text-yellow-500" />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Reward Center</h2>
        <p className="text-slate-500 mt-2 text-lg">Consistent creation earns you bonuses!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className={`p-10 rounded-[40px] border-2 transition-all relative overflow-hidden flex flex-col items-center text-center ${
          canClaim ? 'bg-indigo-600 border-indigo-400 shadow-2xl shadow-indigo-200' : 'bg-white border-slate-100 opacity-80'
        }`}>
          {canClaim && (
             <div className="absolute top-0 right-0 p-4 animate-pulse">
                <Star className="text-indigo-200 fill-indigo-200" />
             </div>
          )}
          
          <h3 className={`text-2xl font-bold mb-6 ${canClaim ? 'text-white' : 'text-slate-800'}`}>Weekly Bonus</h3>
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-md">
            <Gift className={`w-12 h-12 ${canClaim ? 'text-white' : 'text-slate-400'}`} />
          </div>
          
          <div className="flex items-center gap-3 mb-8">
            <Diamond className={`w-10 h-10 ${canClaim ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
            <span className={`text-5xl font-black ${canClaim ? 'text-white' : 'text-slate-400'}`}>50</span>
          </div>

          <p className={`mb-8 font-medium ${canClaim ? 'text-indigo-100' : 'text-slate-500'}`}>
            Available once every 7 days
          </p>

          <button
            onClick={handleClaim}
            disabled={!canClaim}
            className={`w-full py-5 rounded-3xl font-bold text-xl transition-all ${
              canClaim 
                ? 'bg-white text-indigo-600 hover:scale-105 active:scale-95 shadow-lg' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {canClaim ? 'CLAIM NOW' : timeLeft}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-800 text-lg">Account Status</h4>
              <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Active</span>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <Diamond className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-slate-600 font-medium">Total Diamonds</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">{diamonds}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <Clock className="w-5 h-5 text-indigo-500" />
                  </div>
                  <span className="text-slate-600 font-medium">Last Claimed</span>
                </div>
                <span className="text-sm font-bold text-slate-500">
                  {lastClaimed ? new Date(lastClaimed).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-8 rounded-[40px] text-white">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-green-400 w-6 h-6" />
              <h4 className="font-bold text-lg">Pro Benefits</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Earn diamonds to unlock premium features and increase your daily limit.
            </p>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-3/4 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsView;
