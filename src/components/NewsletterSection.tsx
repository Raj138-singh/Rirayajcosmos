import React, { useState } from 'react';
import { Mail, CheckCircle, Bell, Sparkles, Send } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('singhraj74060@gmail.com');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
    }, 600);
  };

  return (
    <section id="newsletter" className="py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border border-red-800/50 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
            {/* Header Icon */}
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto shadow-lg shadow-red-600/20">
              <Mail className="w-7 h-7" />
            </div>

            {/* Title as specified in request */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              📩 Newsletter
            </h2>

            {/* Subtitle as specified in request */}
            <p className="text-base text-slate-300">
              Stay updated with new movie releases, exclusive premiere trailers, and weekend recommendations directly in your inbox.
            </p>

            {/* Newsletter Form */}
            {isSubscribed ? (
              <div className="p-6 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-200 flex flex-col items-center gap-2 animate-fadeIn">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">You're Subscribed!</h3>
                <p className="text-xs text-emerald-300">
                  Confirmation sent to <span className="font-mono text-white underline">{email}</span>. You will receive weekly movie updates!
                </p>
                <button
                  onClick={() => setIsSubscribed(false)}
                  className="mt-2 text-xs text-slate-400 hover:text-white underline"
                >
                  Change Email Address
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    📧
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/90 border border-slate-700/80 focus:border-red-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
                    id="newsletter-email-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  id="newsletter-subscribe-btn"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-[11px] text-slate-400 pt-2">
              🔒 We respect your privacy. No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
