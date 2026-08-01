import React, { useState } from 'react';
import { Film, Play, Star, Plus, Check, Search, Filter } from 'lucide-react';
import { Movie, Genre } from '../types';
import { CATEGORIES } from '../data/moviesData';

interface CategoriesSectionProps {
  movies: Movie[];
  onPlayMovie: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  movies,
  onPlayMovie,
  onOpenDetails,
  watchlist,
  onToggleWatchlist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterQuery, setFilterQuery] = useState<string>('');

  const filteredMovies = movies.filter((m) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      m.genre === selectedCategory ||
      m.secondaryGenre === selectedCategory;
    const matchesQuery =
      filterQuery.trim() === '' ||
      m.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.genre.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section id="categories" className="py-16 bg-slate-900/60 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest mb-1">
              <Film className="w-4 h-4" /> Explore By Genre
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              🎥 Movie Categories
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Browse through curated action, comedy, drama, horror, sci-fi, thriller, animation, and documentary collections.
            </p>
          </div>

          {/* Quick Search inside Categories */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter genre movies..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-red-500 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-400/50'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
              id={`cat-filter-${cat.toLowerCase()}-btn`}
            >
              <span>{cat}</span>
              {cat !== 'All' && (
                <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded-md text-slate-400 font-normal">
                  {movies.filter((m) => m.genre === cat || m.secondaryGenre === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filtered Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {filteredMovies.map((movie) => {
              const inWatchlist = watchlist.includes(movie.id);

              return (
                <div
                  key={movie.id}
                  className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col shadow-lg"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Top rating badge */}
                    <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {movie.rating}
                    </div>

                    {/* Play hover overlay */}
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => onPlayMovie(movie)}
                        className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                        title="Play Movie Trailer"
                      >
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onToggleWatchlist(movie.id)}
                          className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                            inWatchlist
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                          }`}
                          title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                        >
                          {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => onOpenDetails(movie)}
                          className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-300 hover:text-white"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                        <span>{movie.genre}</span>
                        <span>•</span>
                        <span>{movie.year}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
            <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No movies found in this category</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting search filters or selecting another category.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setFilterQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
