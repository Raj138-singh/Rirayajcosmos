import { Movie, Plan } from '../types';

export const CATEGORIES = [
  'All',
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

// Default initial movies set to empty as requested by user ("remove all default movies what you have published")
export const MOVIES: Movie[] = [];
export const SAMPLE_STARTER_MOVIES: Movie[] = [];

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Creator',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    currency: '$',
    quality: 'Good',
    resolution: '720p',
    devices: 1,
    downloads: false,
    ads: true,
    features: ['Access on 1 device', 'HD streaming available', 'Unlimited publishing'],
  },
  {
    id: 'standard',
    name: 'Standard Studio',
    monthlyPrice: 15.99,
    yearlyPrice: 159.99,
    currency: '$',
    quality: 'Better',
    resolution: '1080p Full HD',
    devices: 2,
    downloads: true,
    ads: false,
    popular: true,
    features: ['Access on 2 devices simultaneously', 'Full HD streaming', 'Unlimited video hosting links', 'Cancel anytime'],
  },
  {
    id: 'premium',
    name: 'Premium Cinema',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    currency: '$',
    quality: 'Best',
    resolution: '4K Ultra HD + HDR',
    devices: 4,
    downloads: true,
    ads: false,
    features: ['Access on 4 devices simultaneously', '4K Ultra HD + Spatial Audio', 'Unlimited publishing & custom webseries', 'Priority stream bandwidth'],
  }
];

export const SUBSCRIPTION_PLANS = PLANS;

export const WHY_CHOOSE_US = [
  {
    id: 'w1',
    title: 'Watch On Your TV',
    description: 'Stream on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.',
    icon: 'Tv',
  },
  {
    id: 'w2',
    title: 'Download To Watch Offline',
    description: 'Save your favorites easily and always have something to watch offline on mobile.',
    icon: 'Download',
  },
  {
    id: 'w3',
    title: 'Watch Everywhere',
    description: 'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.',
    icon: 'Smartphone',
  },
  {
    id: 'w4',
    title: 'Ultra HD 4K Quality',
    description: 'Enjoy stunning 4K Ultra High Definition resolution with Spatial Audio surround sound.',
    icon: 'Sparkles',
  },
];
