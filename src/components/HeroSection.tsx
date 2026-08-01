import React, { useState, useEffect } from 'react';
import { Play, Film, Star, Info, Volume2, VolumeX, Sparkles, Flame, Plus, RotateCcw } from 'lucide-react';
import { Movie } from '../types';

interface HeroSectionProps {
  movies: Movie[];
  onPlayMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onBrowseClick: () => void;
  onOpenPublishStudio?: () => void;
  onResetToDemo?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  movies,
  onPlayMovie,
  onOpenDetails,
  onBrowseClick,
  onOpenPublishStudio,
  onResetToDemo,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Rotate featured movie backdrop every 8 seconds if movies exist
  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 4));
    }, 8000);
    return () => clearInterval(timer);
  }, [movies.length]);

  const featuredMovie = movies[currentIndex] || movies[0];

  // EMPTY CATALOG STATE: Welcome Creator Banner
  if (!featuredMovie || movies.length === 0) {
    return (
      <section id="hero" className="relative min-h-[80vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/30 via-slate-950 to-slate-950" />
          <div className="absolute inset-0 bg-hero-radial opacity-60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
              Creator Streaming Platform Ready
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Publish Your Own <br />
            <span className="text-gradient-red">Movies & Web Series</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            All default placeholder movies have been removed as requested. You are now in full control of your platform! Publish your custom movies or multi-episode web series with direct streaming links, YouTube embeds, or Google Drive videos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {onOpenPublishStudio && (
              <button
                onClick={onOpenPublishStudio}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base flex items-center gap-2 shadow-2xl shadow-red-600/40 transition-all hover:scale-105"
                id="hero-empty-publish-btn"
              >
                <Plus className="w-5 h-5 text-amber-300" />
                <span>+ Publish Your First Title</span>
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  // STANDARD HERO VIEW WITH FEATURED MOVIE
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={featuredMovie.backdropUrl}
          alt={featuredMovie.title}
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 filter brightness-75 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        <div className="absolute inset-0 bg-hero-radial opacity-60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-semibold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                {featuredMovie.contentType === 'series' ? 'Featured Web Series' : 'Featured Movie'} • {featuredMovie.badgeEmoji || '🎬'} {featuredMovie.title}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
              {featuredMovie.title}
            </h1>

            {/* Synopsis */}
            <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl leading-relaxed line-clamp-3">
              {featuredMovie.synopsis}
            </p>

            {/* Micro Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-300 pt-1">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {featuredMovie.rating} IMDb
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-white font-semibold">
                {featuredMovie.quality} Ultra HD
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                {featuredMovie.matchPercentage || 98}% Match
              </span>
              <span className="text-slate-400">{featuredMovie.duration}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{featuredMovie.year}</span>
              {featuredMovie.creatorName && (
                <span className="px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 text-[10px] font-bold">
                  By {featuredMovie.creatorName}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onPlayMovie(featuredMovie)}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base sm:text-lg flex items-center gap-3 shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                id="hero-watch-now-btn"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
                <span>Stream Now</span>
              </button>

              {onOpenPublishStudio && (
                <button
                  onClick={onOpenPublishStudio}
                  className="px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-red-500/30 hover:border-red-500 flex items-center gap-2 backdrop-blur-md transition-all"
                  id="hero-publish-new-btn"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>+ Publish Title</span>
                </button>
              )}

              <button
                onClick={() => onOpenDetails(featuredMovie)}
                className="px-4 py-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800 text-sm font-medium transition-colors"
                title="More Movie Details"
                id="hero-more-info-btn"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Floating Featured Preview Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden glass-card p-3 border border-slate-700/60 shadow-2xl group">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
                <img
                  src={featuredMovie.posterUrl}
                  alt={featuredMovie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
                  <span>#1 SPOTLIGHT</span>
                </div>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 flex items-center justify-center backdrop-blur-md hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {featuredMovie.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {featuredMovie.synopsis}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-amber-400">
                      ⭐ {featuredMovie.rating} / 10
                    </span>
                    <button
                      onClick={() => onPlayMovie(featuredMovie)}
                      className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <span>Stream Title</span> →
                    </button>
                  </div>
                </div>
              </div>

              {movies.length > 1 && (
                <div className="flex justify-center items-center gap-2 mt-3 pb-1">
                  {movies.slice(0, 4).map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentIndex === idx ? 'w-6 bg-red-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                      title={m.title}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
