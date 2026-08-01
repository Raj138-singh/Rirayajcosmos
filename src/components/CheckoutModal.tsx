import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Sparkles, Smartphone, Building, Lock } from 'lucide-react';
import { Plan } from '../types';

interface CheckoutModalProps {
  plan: Plan | null;
  isYearly: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ plan, isYearly, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('singhraj74060@upi');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!plan) return null;

  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80"
          id="checkout-modal-close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">Subscription Activated!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Welcome to <span className="text-white font-bold">{plan.name} Plan</span> ({plan.resolution}). You now have unlimited HD & 4K access on Rirayajcosmos.
            </p>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-left space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Transaction ID:</span>
                <span className="text-white font-mono">RC-2026-94817</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Plan Duration:</span>
                <span className="text-white">{isYearly ? '1 Year' : '1 Month'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="text-emerald-400 font-bold">₹{price}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              Start Streaming Now ▶
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                Checkout Summary
              </span>
              <h3 className="text-2xl font-black text-white">
                Subscribe to {plan.name}
              </h3>
            </div>

            {/* Plan Info Badge */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-base">{plan.name} Plan</span>
                <p className="text-xs text-slate-400">{plan.resolution} • {plan.devices} Screen(s)</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-white">₹{price}</span>
                <p className="text-[10px] text-slate-400">{isYearly ? '/year' : '/month'}</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-red-600/20 border-red-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>UPI / GPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-red-600/20 border-red-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'bg-red-600/20 border-red-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4 text-purple-400" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enter VPA / UPI ID</label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@upi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Accepts Google Pay, PhonePe, Paytm, Amazon Pay & BHIM</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4532 •••• •••• 8892"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">CVV Code</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="•••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Bank</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500">
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                id="checkout-pay-btn"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{price} & Activate Subscription</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted & Secure Payment Gateway</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
