import React from 'react';
import { Film, Globe, Heart, Shield, HelpCircle, Mail, Twitter, Instagram, Youtube, Github } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenSupport: (type: 'about' | 'contact' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSupport }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-2xl text-white tracking-tight">
                  Rirayajcosmos
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 block -mt-1 font-semibold">
                  Cinema Streaming Portal
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Watch the biggest movies anytime, anywhere. Experience unlimited high-definition streaming of action, comedy, drama, horror, sci-fi, and top rated cinema masterpieces.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#twitter" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-red-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#instagram" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-red-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#youtube" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-red-500 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#github" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-red-500 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links Column 1 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-white transition-colors">
                  Movies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('trending')} className="hover:text-white transition-colors">
                  TV Shows
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('top-rated')} className="hover:text-white transition-colors">
                  Top Rated
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Links Column 2 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Subscription
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('why-us')} className="hover:text-white transition-colors">
                  Why Choose Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('newsletter')} className="hover:text-white transition-colors">
                  Newsletter
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Links Column 3 - Company & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onOpenSupport('about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onOpenSupport('contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onOpenSupport('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenSupport('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <div>
            <p>© 2026 Rirayajcosmos / CineVerse. All Rights Reserved.</p>
            <p className="mt-1 text-[11px] text-slate-400">
              This is a fictional example suitable for a movie website project or portfolio.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <button onClick={() => onOpenSupport('privacy')} className="hover:text-white">Privacy</button>
            <span>•</span>
            <button onClick={() => onOpenSupport('terms')} className="hover:text-white">Terms</button>
            <span>•</span>
            <button onClick={() => onOpenSupport('contact')} className="hover:text-white">Help Center</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
