import React, { useState } from 'react';
import { Tv, Smartphone, Sparkles, ShieldCheck, Download, CheckCircle2, Laptop, MonitorPlay } from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/moviesData';

export const WhyChooseSection: React.FC = () => {
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tv' | 'laptop'>('tv');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Tv':
        return <Tv className="w-6 h-6 text-red-500" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-red-500" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-red-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-red-500" />;
      case 'Download':
        return <Download className="w-6 h-6 text-red-500" />;
      default:
        return <CheckCircle2 className="w-6 h-6 text-red-500" />;
    }
  };

  return (
    <section id="why-us" className="py-20 bg-slate-900/80 relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest">
            📱 Next-Gen Streaming Experience
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Why Choose Rirayajcosmos?
          </h2>
          <p className="text-base text-slate-400">
            Engineered with ultra-fast cloud edge streaming, high fidelity spatial surround audio, and intelligent cross-device synchronization.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {WHY_CHOOSE_US.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {getIcon(item.icon)}
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <span className="text-emerald-400">✅</span>
                  <span>{item.title}</span>
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
                <span>Feature #0{idx + 1}</span>
                <span className="text-red-400 font-semibold group-hover:translate-x-1 transition-transform">Included in All Plans →</span>
              </div>
            </div>
          ))}

          {/* Interactive Multi-Device Banner Card */}
          <div className="bg-gradient-to-br from-red-950/60 via-slate-900 to-slate-950 border border-red-800/40 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
                Multi-Platform Sync
              </span>
              <h3 className="text-2xl font-bold text-white leading-snug">
                Stream Seamlessly Everywhere
              </h3>
              <p className="text-xs text-slate-300">
                Start watching on your Smart TV at home, pause, and pick up right where you left off on your mobile during your commute.
              </p>
            </div>

            {/* Device Switcher Controls */}
            <div className="mt-6 space-y-4">
              <div className="flex justify-center items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveDevice('mobile')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    activeDevice === 'mobile' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </button>
                <button
                  onClick={() => setActiveDevice('tv')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    activeDevice === 'tv' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" /> Smart TV
                </button>
                <button
                  onClick={() => setActiveDevice('laptop')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    activeDevice === 'laptop' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" /> Laptop
                </button>
              </div>

              {/* Dynamic Mock Screen Frame */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-[11px] font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                  <MonitorPlay className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {activeDevice === 'tv' && 'Connected to 65" 4K OLED Smart TV (Dolby Atmos)'}
                    {activeDevice === 'mobile' && 'Synced with iPhone / Android App (Offline Ready)'}
                    {activeDevice === 'laptop' && 'Active on Chrome / Safari Browser (4K HDR)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
