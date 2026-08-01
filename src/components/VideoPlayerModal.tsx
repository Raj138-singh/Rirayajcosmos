import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Star,
  Film,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ListVideo,
  Tv,
  Info
} from 'lucide-react';
import { Movie, Episode } from '../types';

interface VideoPlayerModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSelectMovie?: (movie: Movie) => void;
  allMovies?: Movie[];
}

const BACKUP_TRAILERS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
];

// Helper to extract YouTube ID
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

// Helper to extract Google Drive File ID
function getGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  movie,
  onClose,
  onSelectMovie,
  allMovies = [],
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [backupIndex, setBackupIndex] = useState(0);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize episode / active video stream when movie changes
  useEffect(() => {
    if (movie) {
      setIsPlaying(true);
      setProgress(0);
      setHasError(false);
      setBackupIndex(0);
      
      if (movie.contentType === 'series' && movie.episodes && movie.episodes.length > 0) {
        setActiveEpisode(movie.episodes[0]);
      } else {
        setActiveEpisode(null);
      }

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.load();
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [movie]);

  if (!movie) return null;

  // Determine current active stream URL
  const rawStreamUrl = activeEpisode ? activeEpisode.videoUrl : movie.trailerUrl;
  const youtubeId = getYouTubeId(rawStreamUrl);
  const driveId = getGoogleDriveId(rawStreamUrl);

  const currentBackupUrl = BACKUP_TRAILERS[backupIndex % BACKUP_TRAILERS.length];

  const handleVideoError = () => {
    if (backupIndex < BACKUP_TRAILERS.length) {
      setBackupIndex((prev) => prev + 1);
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {
          setHasError(true);
          setIsPlaying(false);
        });
      }
    } else {
      setHasError(true);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(cur);
      setDuration(dur || 0);
      if (dur > 0) setProgress((cur / dur) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return '00:00';
    const m = Math.floor(timeInSec / 60);
    const s = Math.floor(timeInSec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleRetry = () => {
    setHasError(false);
    setBackupIndex(0);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const relatedMovies = allMovies.filter((m) => m.id !== movie.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
              {movie.contentType === 'series' ? <Tv className="w-5 h-5" /> : <Film className="w-5 h-5" />}
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">{movie.title}</h3>
                {movie.contentType === 'series' && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold text-[10px] uppercase">
                    Web Series
                  </span>
                )}
                {activeEpisode && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-[11px]">
                    S{activeEpisode.seasonNumber} E{activeEpisode.episodeNumber}: {activeEpisode.title}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {movie.genre} • {movie.year} • {movie.quality} Streaming
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Stage Frame */}
        <div className="relative bg-black flex-1 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[460px]">
          
          {/* CASE 1: YouTube Stream Embed */}
          {youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={movie.title}
              className="w-full h-full min-h-[300px] sm:min-h-[460px] border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : driveId ? (
            /* CASE 2: Google Drive Video Stream Embed */
            <iframe
              src={`https://drive.google.com/file/d/${driveId}/preview`}
              title={movie.title}
              className="w-full h-full min-h-[300px] sm:min-h-[460px] border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : !hasError ? (
            /* CASE 3: Direct HTML5 Video Player */
            <video
              ref={videoRef}
              poster={movie.backdropUrl}
              onTimeUpdate={handleTimeUpdate}
              onError={handleVideoError}
              onClick={togglePlay}
              autoPlay
              playsInline
              className="w-full h-full object-contain max-h-[65vh] cursor-pointer"
            >
              <source src={rawStreamUrl} type="video/mp4" />
              <source src={currentBackupUrl} type="video/mp4" />
            </video>
          ) : (
            /* CASE 4: Stream Fallback & Error Handling */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950">
              <img
                src={movie.backdropUrl}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-20 blur-sm"
              />
              <div className="relative z-10 max-w-md bg-slate-900/95 border border-slate-800 p-6 rounded-2xl backdrop-blur-md space-y-4 shadow-2xl">
                <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Custom Stream Link Active</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    If this custom video stream doesn't play directly in your browser frame, you can play it via our backup mirror or open the direct video link.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Play Backup Mirror</span>
                  </button>
                  {rawStreamUrl && (
                    <a
                      href={rawStreamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Direct Link</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Controls Bar Overlay (For standard HTML5 video) */}
          {!youtubeId && !driveId && !hasError && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={progress || 0}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />

              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                  </button>

                  <button onClick={toggleMute} className="text-slate-300 hover:text-white">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-slate-400 font-mono text-[11px]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={playbackSpeed}
                    onChange={(e) => {
                      const spd = parseFloat(e.target.value);
                      setPlaybackSpeed(spd);
                      if (videoRef.current) videoRef.current.playbackRate = spd;
                    }}
                    className="bg-slate-900 border border-slate-700 rounded text-[11px] text-slate-300 px-2 py-0.5 focus:outline-none"
                  >
                    <option value="0.75">0.75x</option>
                    <option value="1">1.0x Normal</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                  </select>

                  <button onClick={toggleFullScreen} className="text-slate-300 hover:text-white" title="Fullscreen">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* WEB SERIES EPISODES SELECTOR TAB */}
        {movie.contentType === 'series' && movie.episodes && movie.episodes.length > 0 && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <ListVideo className="w-4 h-4 text-red-500" />
              <span>Select Web Series Episode ({movie.episodes.length} Episodes)</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {movie.episodes.map((ep) => {
                const isActive = activeEpisode?.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setActiveEpisode(ep);
                      setHasError(false);
                      setIsPlaying(true);
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.load();
                        videoRef.current.play().catch(() => {});
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <Play className={`w-3 h-3 ${isActive ? 'fill-white' : 'fill-slate-400'}`} />
                    <span>
                      S{ep.seasonNumber}E{ep.episodeNumber}: {ep.title}
                    </span>
                    <span className="opacity-60 text-[10px]">({ep.duration})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer info & related */}
        <div className="p-5 bg-slate-900/60 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="max-w-xl space-y-1">
            <p className="text-slate-300 line-clamp-2 leading-relaxed">
              {activeEpisode?.synopsis || movie.synopsis}
            </p>
            <div className="flex items-center gap-3 text-slate-400 text-[11px] pt-1">
              <span>Director: {movie.director}</span>
              <span>•</span>
              <span>Cast: {movie.cast.join(', ')}</span>
            </div>
          </div>

          {relatedMovies.length > 0 && onSelectMovie && (
            <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4 shrink-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">More titles:</span>
              <div className="flex gap-2">
                {relatedMovies.map((rm) => (
                  <button
                    key={rm.id}
                    onClick={() => onSelectMovie(rm)}
                    className="w-16 aspect-[2/3] rounded-lg overflow-hidden border border-slate-800 hover:border-red-500 transition-colors group relative"
                    title={rm.title}
                  >
                    <img src={rm.posterUrl} alt={rm.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
