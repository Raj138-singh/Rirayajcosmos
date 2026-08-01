import React, { useState, useEffect } from 'react';
import { Film, Search, Bookmark, User, Menu, X, Sparkles, Bell, HardDrive } from 'lucide-react';
import { Movie } from '../types';

interface NavbarProps {
  onSelectMovie: (movie: Movie) => void;
  movies: Movie[];
  watchlistCount: number;
  onOpenWatchlist: () => void;
  onOpenAuth: () => void;
  onOpenDrive: () => void;
  onOpenPublishStudio?: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectMovie,
  movies,
  watchlistCount,
  onOpenWatchlist,
  onOpenAuth,
  onOpenDrive,
  onOpenPublishStudio,
  onNavigate,
  activeSection
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchResults = searchQuery.trim()
    ? movies.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.cast.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-3'
          : 'bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2.5 group focus:outline-none text-left"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-rose-700 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform duration-300">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white group-hover:text-red-400 transition-colors">
                  Rirayajcosmos
                </span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 block -mt-1 font-semibold">
                Cinema Portal
              </span>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { id: 'hero', label: 'Home' },
              { id: 'trending', label: 'Trending' },
              { id: 'categories', label: 'Categories' },
              { id: 'top-rated', label: 'Top Rated' },
              { id: 'why-us', label: 'Why Us' },
              { id: 'pricing', label: 'Pricing' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-white bg-slate-800/80 border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
                id={`nav-${item.id}-btn`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle / Input */}
            <div className="relative">
              <div
                className={`flex items-center bg-slate-900/90 border border-slate-800 rounded-full transition-all duration-300 ${
                  isSearchOpen ? 'w-48 sm:w-64 px-3 py-1.5 ring-2 ring-red-500/50' : 'w-10 h-10 justify-center'
                }`}
              >
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-slate-400 hover:text-white focus:outline-none flex-shrink-0"
                  title="Search movies"
                  id="navbar-search-toggle"
                >
                  <Search className="w-4 h-4" />
                </button>
                {isSearchOpen && (
                  <input
                    type="text"
                    placeholder="Search movies, actors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none ml-2"
                  />
                )}
                {isSearchOpen && searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-500 hover:text-slate-300 ml-1 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Search dropdown results */}
              {isSearchOpen && searchQuery.trim() !== '' && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                  <div className="p-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 flex justify-between">
                    <span>SEARCH RESULTS</span>
                    <span>{searchResults.length} found</span>
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          onSelectMovie(m);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2.5 hover:bg-slate-800 flex items-center gap-3 transition-colors border-b border-slate-800/50 last:border-0"
                      >
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          className="w-10 h-14 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-semibold text-white truncate">{m.title}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="text-amber-400 font-medium">⭐ {m.rating}</span>
                            <span>•</span>
                            <span>{m.genre}</span>
                            <span>•</span>
                            <span>{m.year}</span>
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No movies found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Creator Studio / Publish Content Button */}
            {onOpenPublishStudio && (
              <button
                onClick={onOpenPublishStudio}
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5"
                title="Publish your own Movies & Web Series"
                id="navbar-publish-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">+ Publish Content</span>
                <span className="sm:hidden">+ Publish</span>
              </button>
            )}

            {/* Google Drive Sync Button */}
            <button
              onClick={onOpenDrive}
              className="p-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-blue-400 hover:text-blue-300 hover:border-blue-500/50 hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-1.5"
              title="Google Drive Sync & Cloud Watchlist"
              id="navbar-drive-btn"
            >
              <HardDrive className="w-4 h-4" />
              <span className="hidden lg:inline text-xs font-semibold">Drive</span>
            </button>

            {/* Watchlist Button */}
            <button
              onClick={onOpenWatchlist}
              className="relative p-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title="Saved Watchlist"
              id="navbar-watchlist-btn"
            >
              <Bookmark className="w-4 h-4" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* Sign In / Profile */}
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-red-600/20 transition-all"
              id="navbar-signin-btn"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
              id="navbar-mobile-toggle"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl flex flex-col gap-2">
            {[
              { id: 'hero', label: 'Home' },
              { id: 'trending', label: 'Trending Movies' },
              { id: 'categories', label: 'Browse Categories' },
              { id: 'top-rated', label: 'Top Rated' },
              { id: 'why-us', label: 'Why Choose Us' },
              { id: 'pricing', label: 'Subscription Plans' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              {onOpenPublishStudio && (
                <button
                  onClick={() => {
                    onOpenPublishStudio();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>+ Publish Movie / Web Series</span>
                </button>
              )}

              <button
                onClick={() => {
                  onOpenDrive();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <HardDrive className="w-4 h-4" />
                <span>Google Drive Cloud Sync</span>
              </button>

              <button
                onClick={() => {
                  onOpenAuth();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Account & Sign In</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
