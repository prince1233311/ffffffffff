
import React from 'react';
import { Check, Diamond, Sparkles, Zap, Shield } from 'lucide-react';
import { PlanType } from '../types';

interface PricingViewProps {
  currentPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
}

const PricingView: React.FC<PricingViewProps> = ({ currentPlan, onSelectPlan }) => {
  const plans = [
    {
      id: 'free' as PlanType,
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      features: [
        '100 initial diamonds',
        '50 weekly rewards',
        'Standard generation speed',
        'Gemini 3 Flash access'
      ],
      icon: Zap,
      color: 'slate',
      buttonText: 'Current Plan'
    },
    {
      id: 'daily200' as PlanType,
      name: 'Daily Plus',
      price: '$50',
      period: '/mo',
      features: [
        '200 Diamonds EVERY DAY',
        'Auto-refill at midnight',
        'Priority generation queue',
        'Full creative history'
      ],
      icon: Diamond,
      color: 'indigo',
      buttonText: 'Upgrade Now',
      highlight: true,
      stripeId: 'buy_btn_1SuTmF2O6sF2OkL0b2pmWmxn',
      publishableKey: 'pk_test_51StSVh2O6sF2OkL0z67Sxa9m6afi0xXi4HiFsfHZDEHIuRctkbVBiVWvSjHzyBfYdUOSESsgAqlBefkeYYrRJyCJ00FhFzzlcF'
    },
    {
      id: 'unlimited' as PlanType,
      name: 'Ultimate Unlocked',
      price: '$200',
      period: '/mo',
      features: [
        'UNLIMITED DIAMONDS',
        'Never run out of juice',
        'Ultra-high fidelity images',
        'Exclusive Gemini 3 Pro access',
        'White-label website exports'
      ],
      icon: Sparkles,
      color: 'amber',
      buttonText: 'Get Unlimited',
      isPremium: true,
      stripeId: 'buy_btn_1SuTxk2O6sF2OkL0zJjME72e',
      publishableKey: 'pk_test_51StSVh2O6sF2OkL0z67Sxa9m6afi0xXi4HiFsfHZDEHIuRctkbVBiVWvSjHzyBfYdUOSESsgAqlBefkeYYrRJyCJ00FhFzzlcF'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Choose Your Power Level</h2>
        <p className="text-slate-500 text-lg">Fuel your creativity with the diamond plan that fits your needs.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative p-8 rounded-[40px] border-4 transition-all flex flex-col ${
              plan.highlight ? 'bg-indigo-50/30 border-indigo-200 scale-105 z-10' : 
              plan.isPremium ? 'bg-amber-50/30 border-amber-100 shadow-xl' :
              'bg-white border-slate-100'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}
            
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
              plan.color === 'indigo' ? 'bg-indigo-600 shadow-indigo-200' :
              plan.color === 'amber' ? 'bg-amber-500 shadow-amber-200' :
              'bg-slate-800 shadow-slate-200'
            } shadow-lg`}>
              <plan.icon className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-slate-900">{plan.price}</span>
              <span className="text-slate-500 font-medium">{plan.period}</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <div className={`p-0.5 rounded-full ${
                    plan.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                    plan.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              {currentPlan === plan.id ? (
                <button
                  disabled
                  className="w-full py-4 rounded-2xl font-bold text-lg bg-slate-100 text-slate-400 cursor-not-allowed"
                >
                  Active Plan
                </button>
              ) : plan.stripeId ? (
                <div className="w-full flex justify-center">
                  {React.createElement('stripe-buy-button', {
                    'buy-button-id': plan.stripeId,
                    'publishable-key': plan.publishableKey
                  } as any)}
                </div>
              ) : (
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                    plan.color === 'indigo' ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' :
                    plan.color === 'amber' ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-100' :
                    'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-100'
                  }`}
                >
                  {plan.buttonText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-center gap-8">
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
           <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                 <Shield className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                 <h4 className="font-bold text-slate-800">Secure Billing</h4>
                 <p className="text-sm text-slate-500">All transactions are encrypted and processed securely via Stripe. No hidden fees.</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                 <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                 <h4 className="font-bold text-slate-800">Instant Activation</h4>
                 <p className="text-sm text-slate-500">Your plan features are unlocked immediately after successful payment.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PricingView;
