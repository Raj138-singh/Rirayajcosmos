export type Genre = 
  | 'Action' 
  | 'Comedy' 
  | 'Drama' 
  | 'Horror' 
  | 'Sci-Fi' 
  | 'Thriller' 
  | 'Animation' 
  | 'Documentary' 
  | 'Romance' 
  | 'Adventure' 
  | 'Mystery';

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  duration: string;
  videoUrl: string;
  synopsis?: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: Genre;
  secondaryGenre?: Genre;
  rating: number;
  year: number;
  duration: string;
  quality: 'HD' | '4K' | 'UHD';
  ageRating: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string; // Direct video URL, YouTube URL, or Google Drive URL
  synopsis: string;
  cast: string[];
  director: string;
  isTrending?: boolean;
  isTopRated?: boolean;
  matchPercentage?: number;
  badgeEmoji?: string;
  
  // Custom Creator & Publishing fields
  contentType?: 'movie' | 'series';
  creatorName?: string;
  isCustomUserPublished?: boolean;
  episodes?: Episode[];
  videoType?: 'direct' | 'youtube' | 'drive' | 'auto';
}

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  quality: string;
  resolution: string;
  devices: number;
  downloads: boolean;
  ads: boolean;
  popular?: boolean;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  avatar: string;
  rating: number;
}
