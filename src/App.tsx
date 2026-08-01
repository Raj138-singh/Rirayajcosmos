import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrendingSection } from './components/TrendingSection';
import { CategoriesSection } from './components/CategoriesSection';
import { TopRatedSection } from './components/TopRatedSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { PricingSection } from './components/PricingSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';

import { VideoPlayerModal } from './components/VideoPlayerModal';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SupportModal } from './components/SupportModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { PublishStudioModal } from './components/PublishStudioModal';

import { MOVIES, SAMPLE_STARTER_MOVIES } from './data/moviesData';
import { Movie, Plan } from './types';

export default function App() {
  // Manage user published movies in state & localStorage
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('rirayajcosmos_published_movies');
      return saved ? JSON.parse(saved) : MOVIES; // Default starts as [] per user request
    } catch {
      return MOVIES;
    }
  });

  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [detailedMovie, setDetailedMovie] = useState<Movie | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rirayajcosmos_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [isPublishStudioOpen, setIsPublishStudioOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
  const [checkoutIsYearly, setCheckoutIsYearly] = useState(false);
  const [supportType, setSupportType] = useState<'about' | 'contact' | 'privacy' | 'terms' | null>(null);
  const [activeSection, setActiveSection] = useState('hero');

  // Sync published movies to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rirayajcosmos_published_movies', JSON.stringify(movies));
    } catch (e) {
      console.error(e);
    }
  }, [movies]);

  // Sync watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rirayajcosmos_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error(e);
    }
  }, [watchlist]);

  const handlePublishMovie = (newMovie: Movie) => {
    setMovies((prev) => [newMovie, ...prev]);
  };

  const handleDeleteMovie = (movieId: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
    setWatchlist((prev) => prev.filter((id) => id !== movieId));
  };

  const handleResetToDemo = () => {
    setMovies(SAMPLE_STARTER_MOVIES);
  };

  const handleClearAll = () => {
    setMovies([]);
    setWatchlist([]);
  };

  const toggleWatchlist = (movieId: string) => {
    setWatchlist((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlan = (plan: Plan, isYearly: boolean) => {
    setCheckoutPlan(plan);
    setCheckoutIsYearly(isYearly);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-600 selection:text-white">
      {/* Top Fixed Header Navbar */}
      <Navbar
        onSelectMovie={(m) => setDetailedMovie(m)}
        movies={movies}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDrive={() => setIsDriveOpen(true)}
        onOpenPublishStudio={() => setIsPublishStudioOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Banner Section */}
        <HeroSection
          movies={movies}
          onPlayMovie={(m) => setPlayingMovie(m)}
          onOpenDetails={(m) => setDetailedMovie(m)}
          onBrowseClick={() => handleNavigate('categories')}
          onOpenPublishStudio={() => setIsPublishStudioOpen(true)}
          onResetToDemo={handleResetToDemo}
        />

        {/* 2. Trending Now Section */}
        <TrendingSection
          movies={movies}
          onPlayMovie={(m) => setPlayingMovie(m)}
          onOpenDetails={(m) => setDetailedMovie(m)}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
          onOpenPublishStudio={() => setIsPublishStudioOpen(true)}
        />

        {/* 3. Movie Categories Section */}
        <CategoriesSection
          movies={movies}
          onPlayMovie={(m) => setPlayingMovie(m)}
          onOpenDetails={(m) => setDetailedMovie(m)}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />

        {/* 4. Top Rated Movies Section */}
        <TopRatedSection
          movies={movies}
          onPlayMovie={(m) => setPlayingMovie(m)}
          onOpenDetails={(m) => setDetailedMovie(m)}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />

        {/* 5. Why Choose Rirayajcosmos Section */}
        <WhyChooseSection />

        {/* 6. Subscription Plans Section */}
        <PricingSection onSelectPlan={handleSelectPlan} />

        {/* 7. Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSupport={(type) => setSupportType(type)}
      />

      {/* Overlays & Modals */}
      <VideoPlayerModal
        movie={playingMovie}
        onClose={() => setPlayingMovie(null)}
        onSelectMovie={(m) => setPlayingMovie(m)}
        allMovies={movies}
      />

      <MovieDetailsModal
        movie={detailedMovie}
        onClose={() => setDetailedMovie(null)}
        onPlayTrailer={(m) => setPlayingMovie(m)}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistIds={watchlist}
        allMovies={movies}
        onPlayMovie={(m) => setPlayingMovie(m)}
        onRemoveFromWatchlist={toggleWatchlist}
        onOpenDrive={() => setIsDriveOpen(true)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <CheckoutModal
        plan={checkoutPlan}
        isYearly={checkoutIsYearly}
        onClose={() => setCheckoutPlan(null)}
      />

      <SupportModal
        isOpen={!!supportType}
        type={supportType}
        onClose={() => setSupportType(null)}
      />

      <GoogleDriveModal
        isOpen={isDriveOpen}
        onClose={() => setIsDriveOpen(false)}
        watchlist={watchlist}
        allMovies={movies}
        onUpdateWatchlist={(newWatchlist) => setWatchlist(newWatchlist)}
      />

      <PublishStudioModal
        isOpen={isPublishStudioOpen}
        onClose={() => setIsPublishStudioOpen(false)}
        movies={movies}
        onPublishMovie={handlePublishMovie}
        onDeleteMovie={handleDeleteMovie}
        onResetToDemo={handleResetToDemo}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
