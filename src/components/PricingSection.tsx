import React, { useState } from 'react';
import { Check, Shield, Zap, Sparkles, CreditCard, Star } from 'lucide-react';
import { PLANS } from '../data/moviesData';
import { Plan } from '../types';

interface PricingSectionProps {
  onSelectPlan: (plan: Plan, isYearly: boolean) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest">
            💳 Flexible Cinema Subscription
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Subscription Plans
          </h2>
          <p className="text-base text-slate-400">
            Choose the plan that fits your movie streaming lifestyle. Upgrade, downgrade, or cancel anytime with zero hidden fees.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm font-semibold ${!isYearly ? 'text-white' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-8 rounded-full bg-slate-800 p-1 transition-colors duration-300 focus:outline-none border border-slate-700"
              id="pricing-billing-toggle"
            >
              <div
                className={`w-6 h-6 rounded-full bg-red-600 shadow-md transform transition-transform duration-300 ${
                  isYearly ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1.5 ${isYearly ? 'text-white' : 'text-slate-400'}`}>
              <span>Annual Billing</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid as specified in user prompt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {PLANS.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const periodText = isYearly ? '/year' : '/month';

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-red-500 shadow-2xl shadow-red-950/50 scale-105 z-10'
                    : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> MOST POPULAR
                  </div>
                )}

                <div>
                  {/* Plan Name & Tag */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {plan.resolution}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-white">
                        {plan.currency}{price.toLocaleString()}
                      </span>
                      <span className="text-slate-400 font-semibold text-sm">{periodText}</span>
                    </div>
                    {isYearly && (
                      <p className="text-xs text-emerald-400 font-medium mt-1">
                        Equivalent to {plan.currency}{Math.round(price / 12)}/month
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 py-6 border-t border-slate-800">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Included Features:
                    </p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subscription Action Button */}
                <div className="pt-6 border-t border-slate-800">
                  <button
                    onClick={() => onSelectPlan(plan, isYearly)}
                    className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                    id={`plan-subscribe-${plan.id}-btn`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Subscribe to {plan.name}</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-500 mt-2">
                    7-Day Free Trial • Instant Cancellation
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto">
          <h4 className="text-lg font-bold text-white mb-4 text-center">
            Plan Comparison Summary
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4 text-center">Basic</th>
                  <th className="py-3 px-4 text-center text-red-400 font-bold">Standard</th>
                  <th className="py-3 px-4 text-center text-amber-400 font-bold">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold">Monthly Price</td>
                  <td className="py-3 px-4 text-center">₹199</td>
                  <td className="py-3 px-4 text-center font-bold text-white">₹399</td>
                  <td className="py-3 px-4 text-center font-bold text-white">₹699</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Resolution</td>
                  <td className="py-3 px-4 text-center">720p HD</td>
                  <td className="py-3 px-4 text-center">1080p Full HD</td>
                  <td className="py-3 px-4 text-center text-amber-400 font-bold">4K Ultra HD + HDR</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Concurrent Screens</td>
                  <td className="py-3 px-4 text-center">1 Screen</td>
                  <td className="py-3 px-4 text-center">2 Screens</td>
                  <td className="py-3 px-4 text-center">4 Screens</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Offline Downloads</td>
                  <td className="py-3 px-4 text-center text-slate-500">❌ No</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✅ Yes</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✅ Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Ad-Free Experience</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✅ Included</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✅ Included</td>
                  <td className="py-3 px-4 text-center text-emerald-400">✅ Included</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
