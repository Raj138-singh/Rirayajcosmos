import React, { useState } from 'react';
import { X, Shield, FileText, HelpCircle, Mail, CheckCircle2 } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  type: 'about' | 'contact' | 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, type, onClose }) => {
  const [sentMessage, setSentMessage] = useState(false);

  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80"
          id="support-modal-close"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'about' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white">About Rirayajcosmos</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Rirayajcosmos is a fictional premier entertainment and cinema streaming web platform designed to bring blockbuster movies, trending series, and critically acclaimed films directly to your screens in HD and 4K resolution.
            </p>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-2">
              <h4 className="text-white font-bold">Key Highlights:</h4>
              <p>• Ultra-low latency streaming with Dolby Surround sound support.</p>
              <p>• Cross-device synchronization across Smart TV, Mobile, and Desktop.</p>
              <p>• Unlimited offline downloads for on-the-go viewing.</p>
            </div>
          </div>
        )}

        {type === 'contact' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white">Contact & Support</h3>
            <p className="text-xs text-slate-300">
              Have questions regarding subscription plans, playback, or account settings? Our team is here 24/7.
            </p>

            {sentMessage ? (
              <div className="p-6 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Message Received!</h4>
                <p className="text-xs text-emerald-300">
                  Our support team will get back to your email within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSentMessage(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    defaultValue="singhraj74060@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry / Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your question or issue..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg"
                >
                  Send Support Message
                </button>
              </form>
            )}
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white">Privacy Policy</h3>
            <p className="text-xs text-slate-400">Effective Date: August 2026</p>
            <div className="text-xs text-slate-300 space-y-3 max-h-72 overflow-y-auto pr-2">
              <p>
                At Rirayajcosmos, we value your privacy and security. We collect minimal personal data required to deliver personalized movie recommendations and seamless streaming services.
              </p>
              <h4 className="text-white font-bold">1. Data Collection</h4>
              <p>We log device information and playback history solely to provide offline resume states and curated watch recommendations.</p>
              <h4 className="text-white font-bold">2. Payment Security</h4>
              <p>All subscription transactions are processed securely through encrypted SSL gateways. We do not store raw credit card details.</p>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white">Terms of Service</h3>
            <p className="text-xs text-slate-400">Last Updated: August 2026</p>
            <div className="text-xs text-slate-300 space-y-3 max-h-72 overflow-y-auto pr-2">
              <p>
                By accessing Rirayajcosmos or subscribing to any plan, you agree to comply with our streaming terms and copyright guidelines.
              </p>
              <h4 className="text-white font-bold">1. Account Usage</h4>
              <p>Each subscription plan determines the maximum concurrent streams allowed per household.</p>
              <h4 className="text-white font-bold">2. Cancellation Policy</h4>
              <p>You can cancel your subscription at any time without penalty. Streaming access remains active until the end of your billing cycle.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
