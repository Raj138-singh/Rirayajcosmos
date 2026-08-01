import React, { useState } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Tv,
  Film,
  Sparkles,
  Link,
  Image as ImageIcon,
  Check,
  AlertCircle,
  HelpCircle,
  Video,
  Play,
  RotateCcw,
  Star,
  BookOpen,
  Info
} from 'lucide-react';
import { Movie, Genre, Episode } from '../types';

interface PublishStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  onPublishMovie: (newMovie: Movie) => void;
  onDeleteMovie: (movieId: string) => void;
  onResetToDemo: () => void;
  onClearAll: () => void;
}

const GENRES: Genre[] = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Thriller',
  'Animation',
  'Documentary',
  'Romance',
  'Adventure',
  'Mystery',
];

const ARTWORK_PRESETS = [
  {
    label: 'Sci-Fi Universe',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
  },
  {
    label: 'Action Hero',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
  },
  {
    label: 'Drama & Romance',
    poster: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1600&auto=format&fit=crop',
  },
  {
    label: 'Dark Horror/Thriller',
    poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
  },
  {
    label: 'Epic Adventure',
    poster: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
  },
];

export const PublishStudioModal: React.FC<PublishStudioModalProps> = ({
  isOpen,
  onClose,
  movies,
  onPublishMovie,
  onDeleteMovie,
  onResetToDemo,
  onClearAll,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'guide'>('create');
  
  // Content Form state
  const [contentType, setContentType] = useState<'movie' | 'series'>('movie');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<Genre>('Action');
  const [rating, setRating] = useState('8.8');
  const [year, setYear] = useState('2026');
  const [duration, setDuration] = useState('2h 10m');
  const [quality, setQuality] = useState<'HD' | '4K' | 'UHD'>('4K');
  const [ageRating, setAgeRating] = useState('13+');
  const [director, setDirector] = useState('My Studio');
  const [castInput, setCastInput] = useState('Self, Independent Cast');
  const [synopsis, setSynopsis] = useState('');
  
  // Video & Image URLs
  const [trailerUrl, setTrailerUrl] = useState('https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [posterUrl, setPosterUrl] = useState(ARTWORK_PRESETS[0].poster);
  const [backdropUrl, setBackdropUrl] = useState(ARTWORK_PRESETS[0].backdrop);
  
  // Episodes state for Web Series
  const [episodes, setEpisodes] = useState<Episode[]>([
    {
      id: 'ep-1',
      title: 'Episode 1: The Beginning',
      episodeNumber: 1,
      seasonNumber: 1,
      duration: '45m',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      synopsis: 'First episode of your custom web series.',
    },
  ]);

  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddEpisode = () => {
    const nextEpNum = episodes.length + 1;
    setEpisodes((prev) => [
      ...prev,
      {
        id: `ep-${Date.now()}-${nextEpNum}`,
        title: `Episode ${nextEpNum}`,
        episodeNumber: nextEpNum,
        seasonNumber: 1,
        duration: '45m',
        videoUrl: trailerUrl || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        synopsis: `Synopsis for episode ${nextEpNum}`,
      },
    ]);
  };

  const handleUpdateEpisode = (id: string, field: keyof Episode, value: any) => {
    setEpisodes((prev) =>
      prev.map((ep) => (ep.id === id ? { ...ep, [field]: value } : ep))
    );
  };

  const handleRemoveEpisode = (id: string) => {
    if (episodes.length <= 1) {
      alert('A web series must have at least one episode.');
      return;
    }
    setEpisodes((prev) => prev.filter((ep) => ep.id !== id));
  };

  const handleApplyPreset = (preset: typeof ARTWORK_PRESETS[0]) => {
    setPosterUrl(preset.poster);
    setBackdropUrl(preset.backdrop);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setFormError('Please enter a title for your content.');
      return;
    }

    if (!trailerUrl.trim()) {
      setFormError('Please enter a video stream URL or YouTube link.');
      return;
    }

    if (!synopsis.trim()) {
      setFormError('Please write a brief synopsis or plot summary.');
      return;
    }

    const newMedia: Movie = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      genre,
      rating: parseFloat(rating) || 8.5,
      year: parseInt(year) || 2026,
      duration: contentType === 'series' ? `${episodes.length} Episodes` : duration,
      quality,
      ageRating,
      posterUrl: posterUrl.trim() || ARTWORK_PRESETS[0].poster,
      backdropUrl: backdropUrl.trim() || ARTWORK_PRESETS[0].backdrop,
      trailerUrl: trailerUrl.trim(),
      synopsis: synopsis.trim(),
      cast: castInput.split(',').map((c) => c.trim()).filter(Boolean),
      director: director.trim() || 'My Studio',
      isTrending: true,
      isTopRated: true,
      matchPercentage: 99,
      badgeEmoji: contentType === 'series' ? '📺' : '🎬',
      contentType,
      isCustomUserPublished: true,
      creatorName: director || 'Creator',
      episodes: contentType === 'series' ? episodes : undefined,
    };

    onPublishMovie(newMedia);
    setSuccessMessage(`Successfully published '${title}' as a ${contentType === 'series' ? 'Web Series' : 'Movie'}!`);
    
    // Reset basic fields
    setTitle('');
    setSynopsis('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Creator Publishing Studio</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                  Self-Publishing
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Publish your own custom Movies and Web Series directly to your app
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/50">
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'create'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-red-400" />
            <span>+ Publish New Content</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'manage'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-blue-400" />
            <span>Manage My Titles ({movies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>How to Publish Video Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: CREATE & PUBLISH */}
          {activeTab === 'create' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {formError && (
                <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Type Switcher */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  1. Content Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setContentType('movie')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      contentType === 'movie'
                        ? 'bg-red-600/20 border-red-500 text-white shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Feature Movie</h4>
                      <p className="text-[11px] text-slate-400">Single feature film or documentary</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContentType('series')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      contentType === 'series'
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Web Series</h4>
                      <p className="text-[11px] text-slate-400">Multi-episode web show or drama</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Title, Genre, Rating & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={contentType === 'series' ? 'e.g. Cyber City Chronicles' : 'e.g. The Final Odyssey'}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as Genre)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Rating (IMDb)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Year, Duration, Quality, Director */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Release Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    {contentType === 'series' ? 'Total Runtime' : 'Movie Duration'}
                  </label>
                  <input
                    type="text"
                    placeholder="2h 15m or 10 Eps"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Streaming Quality</label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="4K">4K Ultra HD</option>
                    <option value="HD">1080p Full HD</option>
                    <option value="UHD">UHD Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Studio / Director</label>
                  <input
                    type="text"
                    placeholder="e.g. My Studio"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Video Stream URL Section */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-400" />
                    <span>Video Stream / Trailer URL *</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Supports Direct MP4, YouTube Links, or Google Drive Video Links
                  </span>
                </div>

                <input
                  type="url"
                  required
                  placeholder="Paste YouTube link (https://youtube.com/watch?v=...), Google Drive link, or direct MP4 URL"
                  value={trailerUrl}
                  onChange={(e) => setTrailerUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                />

                <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 pt-1">
                  <span className="text-slate-500 font-medium">Quick Test Links:</span>
                  <button
                    type="button"
                    onClick={() => setTrailerUrl('https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Big Buck Bunny (MP4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrailerUrl('https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Tears of Steel (MP4)
                  </button>
                </div>
              </div>

              {/* Web Series Episodes Manager */}
              {contentType === 'series' && (
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                      <Tv className="w-4 h-4" />
                      <span>Manage Web Series Episodes ({episodes.length})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddEpisode}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Episode</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {episodes.map((ep, idx) => (
                      <div
                        key={ep.id}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white">Episode {idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEpisode(ep.id)}
                            className="text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Episode Title"
                            value={ep.title}
                            onChange={(e) => handleUpdateEpisode(ep.id, 'title', e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Duration (e.g. 45m)"
                            value={ep.duration}
                            onChange={(e) => handleUpdateEpisode(ep.id, 'duration', e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                          <input
                            type="url"
                            placeholder="Video Stream URL for Episode"
                            value={ep.videoUrl}
                            onChange={(e) => handleUpdateEpisode(ep.id, 'videoUrl', e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Poster and Backdrop Image URL Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Artwork & Posters</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Poster Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={posterUrl}
                      onChange={(e) => setPosterUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Backdrop Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={backdropUrl}
                      onChange={(e) => setBackdropUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                    Or select artwork theme presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ARTWORK_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handleApplyPreset(p)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-600 text-[11px] text-slate-300 font-medium transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Synopsis & Cast */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Synopsis / Plot Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Write a brief overview of your movie or web series..."
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Cast Members (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Actor 1, Actor 2, Producer"
                    value={castInput}
                    onChange={(e) => setCastInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish Content to My Platform</span>
              </button>

            </form>
          )}

          {/* TAB 2: MANAGE TITLES */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white">Your Published Library</h4>
                  <p className="text-xs text-slate-400">
                    Currently managing {movies.length} custom titles in your streaming catalog.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClearAll}
                    className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Titles</span>
                  </button>
                </div>
              </div>

              {movies.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
                  <Film className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="font-bold text-slate-300 text-sm">No Movies or Web Series Published Yet</p>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Click '+ Publish New Content' above to add your first movie or web series!
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    + Publish Content Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {movies.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          className="w-12 h-16 object-cover rounded-lg shrink-0"
                        />
                        <div className="overflow-hidden">
                          <h5 className="text-xs font-bold text-white truncate">{m.title}</h5>
                          <p className="text-[10px] text-slate-400">
                            {m.contentType === 'series' ? 'Web Series' : 'Movie'} • {m.genre} • {m.year}
                          </p>
                          <span className="text-[10px] text-amber-400 font-semibold">
                            ⭐ {m.rating} IMDb
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteMovie(m.id)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
                        title="Delete Title"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PUBLISHING GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>How to Host & Publish Video Streams Easily</span>
                </h4>
                <p>
                  You can publish your own movies and web series using three simple options:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <h5 className="font-bold text-white flex items-center gap-2 text-xs">
                      <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                      Option A: YouTube Video Links (Easiest & Free)
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Upload your movie or web series episode to YouTube as "Public" or "Unlisted", then copy the link (e.g. <span className="text-slate-200 font-mono">https://www.youtube.com/watch?v=...</span>) and paste it into the Video Stream URL field! It embeds seamlessly in full HD.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <h5 className="font-bold text-white flex items-center gap-2 text-xs">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                      Option B: Google Drive Video Links
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Upload your MP4 video file to your Google Drive account, set file sharing to "Anyone with the link can view", and paste the link (<span className="text-slate-200 font-mono">https://drive.google.com/file/d/.../view</span>).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <h5 className="font-bold text-white flex items-center gap-2 text-xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">3</span>
                      Option C: Direct MP4 / WebM Cloud File URLs
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Host your video files on Amazon S3, Cloudinary, Vercel Blob, Internet Archive, or any direct HTTPS MP4 web server.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
