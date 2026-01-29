
import React, { useState, useEffect, useCallback } from 'react';
import { ViewType, UserState, PlanType } from './types';
import LandingPage from './components/LandingPage';
import ChatView from './components/ChatView';
import ImageView from './components/ImageView';
import VoiceView from './components/VoiceView';
import WebGenView from './components/WebGenView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RewardsView from './components/RewardsView';
import PricingView from './components/PricingView';
import AuthView from './components/AuthView';
import { supabase } from './services/supabaseClient';

const INITIAL_DIAMONDS = 100;
const WEEKLY_REWARD_AMOUNT = 50;
const DAILY_LIMIT = 200;

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(ViewType.LANDING);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userState, setUserState] = useState<UserState>({ 
    diamonds: INITIAL_DIAMONDS, 
    lastRewardClaim: null, 
    plan: 'free',
    lastDailyRefresh: null 
  });

  // Auth State Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setView(ViewType.LANDING);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No profile, create one
      const newProfile = {
        id: userId,
        diamonds: INITIAL_DIAMONDS,
        plan: 'free',
        last_reward_claim: null,
        last_daily_refresh: null
      };
      await supabase.from('profiles').insert([newProfile]);
      setUserState({
        diamonds: INITIAL_DIAMONDS,
        plan: 'free',
        lastRewardClaim: null,
        lastDailyRefresh: null
      });
    } else if (data) {
      setUserState({
        diamonds: data.diamonds,
        plan: data.plan,
        lastRewardClaim: data.last_reward_claim,
        lastDailyRefresh: data.last_daily_refresh
      });
    }
  };

  const updateProfile = async (updates: Partial<UserState>) => {
    if (!session) return;
    const dbUpdates = {
      diamonds: updates.diamonds !== undefined ? updates.diamonds : userState.diamonds,
      plan: updates.plan !== undefined ? updates.plan : userState.plan,
      last_reward_claim: updates.lastRewardClaim !== undefined ? updates.lastRewardClaim : userState.lastRewardClaim,
      last_daily_refresh: updates.lastDailyRefresh !== undefined ? updates.lastDailyRefresh : userState.lastDailyRefresh
    };

    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', session.user.id);

    if (!error) {
      setUserState(prev => ({ ...prev, ...updates }));
    }
  };

  // Daily Refresh Logic for 'daily200' plan
  useEffect(() => {
    if (userState.plan === 'daily200' && session) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      
      if (!userState.lastDailyRefresh || userState.lastDailyRefresh < today) {
        updateProfile({
          diamonds: Math.max(userState.diamonds, DAILY_LIMIT),
          lastDailyRefresh: Date.now()
        });
      }
    }
  }, [userState.plan, userState.lastDailyRefresh, session]);

  const spendDiamonds = useCallback((amount: number) => {
    if (userState.plan === 'unlimited') return true;
    if (userState.diamonds >= amount) {
      updateProfile({ diamonds: userState.diamonds - amount });
      return true;
    }
    return false;
  }, [userState.diamonds, userState.plan, session]);

  const claimWeeklyReward = useCallback(() => {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if (!userState.lastRewardClaim || now - userState.lastRewardClaim >= oneWeek) {
      updateProfile({
        diamonds: userState.diamonds + WEEKLY_REWARD_AMOUNT,
        lastRewardClaim: now
      });
      return true;
    }
    return false;
  }, [userState.lastRewardClaim, userState.diamonds, session]);

  const changePlan = useCallback((newPlan: PlanType) => {
    updateProfile({
      plan: newPlan,
      diamonds: newPlan === 'daily200' ? Math.max(userState.diamonds, 200) : userState.diamonds
    });
  }, [userState.diamonds, session]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (view === ViewType.LANDING && !session) {
    return <LandingPage onGetStarted={() => setView('auth' as any)} />;
  }

  if (view === ('auth' as any) && !session) {
    return <AuthView onBack={() => setView(ViewType.LANDING)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar currentView={view} setView={setView} onLogout={() => supabase.auth.signOut()} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-2xl rounded-l-[40px] border-l border-slate-200">
        <Header 
          diamonds={userState.diamonds} 
          plan={userState.plan} 
          onRewardClick={() => setView(ViewType.REWARDS)} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {view === ViewType.CHAT && (
            <ChatView spendDiamonds={spendDiamonds} diamonds={userState.diamonds} isUnlimited={userState.plan === 'unlimited'} />
          )}
          {view === ViewType.IMAGE && (
            <ImageView spendDiamonds={spendDiamonds} diamonds={userState.diamonds} isUnlimited={userState.plan === 'unlimited'} />
          )}
          {view === ViewType.VOICE && (
            <VoiceView spendDiamonds={spendDiamonds} diamonds={userState.diamonds} isUnlimited={userState.plan === 'unlimited'} />
          )}
          {view === ViewType.WEBSITE && (
            <WebGenView spendDiamonds={spendDiamonds} diamonds={userState.diamonds} isUnlimited={userState.plan === 'unlimited'} />
          )}
          {view === ViewType.REWARDS && (
            <RewardsView 
              lastClaimed={userState.lastRewardClaim} 
              onClaim={claimWeeklyReward} 
              diamonds={userState.diamonds}
            />
          )}
          {view === ViewType.PRICING && (
            <PricingView currentPlan={userState.plan} onSelectPlan={changePlan} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
