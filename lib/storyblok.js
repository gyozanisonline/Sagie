// lib/storyblok.js — Storyblok API client
import StoryblokClient from 'storyblok-js-client';

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  cache: {
    clear: 'auto',
    type: 'memory',
  },
});

// Helper: use 'draft' in dev, 'published' in prod
export const version = process.env.NODE_ENV === 'development' ? 'draft' : 'published';

export default Storyblok;
