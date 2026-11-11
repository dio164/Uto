export interface RecordingItem {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  artwork_url?: string;
  category: 'Spoken Letters' | 'Little Voicenotes' | 'Songs for You' | 'For When You Miss Me' | 'Special Occasions' | 'Just Because';
  duration?: string;
  date_recorded?: string;
  is_published: boolean;
  order_index?: number;
}

export interface LetterItem {
  id: string;
  title: string;
  content: string;
  category: 'Open When You Miss Me' | 'Open When You Need Encouragement' | 'Open When You Can’t Sleep' | 'Open When You Need a Reminder' | 'Special Occasions' | 'Just Because';
  cover_artwork?: string;
  unlock_date?: string;
  is_locked: boolean;
  is_published: boolean;
  created_at?: string;
}

export interface ImportantDateItem {
  id: string;
  title: string;
  target_date: string;
  category: 'Anniversary' | 'Birthday' | 'Graduation' | 'Meeting' | 'Milestone';
  description?: string;
  country_connection?: string; // e.g. "Nigeria ↔ Romania"
  is_highlighted: boolean;
}

export interface GardenFlowerItem {
  id: string;
  flower_name: string;
  flower_type: 'Vintage Rose' | 'Princess Peony' | 'Celestial Lily' | 'Stardust Orchid' | 'Sweet Hydrangea';
  milestone_title: string;
  story: string;
  bloom_date: string;
  color?: string;
  artwork_url?: string;
}

export interface CinemaMediaItem {
  id: string;
  title: string;
  caption?: string;
  media_type: 'photo' | 'video';
  media_url: string;
  thumbnail_url?: string;
  event_date?: string;
  recap_month?: string;
  recap_year?: string;
}

export interface LittleThingItem {
  id: string;
  title: string;
  quote_or_memory: string;
  context?: string;
  category: 'Funny Things She Said' | 'Little Details I Remember' | 'Favourite Conversations' | 'Things She Was Excited About' | 'Inside Jokes' | 'Random Memories' | 'Things I Never Want to Forget';
  date_noted?: string;
  image_url?: string;
}

export interface FutureMuseumItem {
  id: string;
  title: string;
  category: 'Adventures' | 'Places to Visit' | 'Restaurants to Try' | 'Traditions to Begin' | 'Things to Experience';
  status: 'someday' | 'planned' | 'experienced';
  target_location?: string;
  notes?: string;
  reflection?: string;
  photo_url?: string;
}

export interface SecretDiscovery {
  id: string;
  code: string;
  title: string;
  message: string;
  author: string;
  rewardType: 'letter' | 'voice' | 'easter_egg';
  isUnlocked?: boolean;
}

