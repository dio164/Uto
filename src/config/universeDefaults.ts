import {
  RecordingItem,
  LetterItem,
  ImportantDateItem,
  GardenFlowerItem,
  CinemaMediaItem,
  LittleThingItem,
  FutureMuseumItem,
  SecretDiscovery,
} from '../types/universeData';

export const DEFAULT_RECORDINGS: RecordingItem[] = [
  {
    id: 'rec-1',
    title: 'November 4 — Acoustic Guitar Piece',
    description: 'An acoustic guitar composition dedicated to Uto, recorded for our four-month milestone.',
    audio_url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3', // elegant gentle acoustic guitar placeholder
    category: 'Songs for You',
    duration: '2:14',
    date_recorded: 'November 4, 2026',
    is_published: true,
  },
  {
    id: 'rec-2',
    title: 'A Quiet Whisper Across The Ocean',
    description: 'A little late-night voicenote to remind you that distance has no say in how much I appreciate you.',
    audio_url: 'https://cdn.freesound.org/previews/530/530415_11861866-lq.mp3',
    category: 'For When You Miss Me',
    duration: '1:45',
    date_recorded: 'October 2026',
    is_published: true,
  },
  {
    id: 'rec-3',
    title: 'On Your Hardest Days in the Hospital',
    description: 'Spoken words for when medical school and long shifts feel overwhelming. You are capable and so loved.',
    audio_url: 'https://cdn.freesound.org/previews/469/469440_9961300-lq.mp3',
    category: 'Little Voicenotes',
    duration: '2:50',
    date_recorded: 'September 2026',
    is_published: true,
  },
];

export const DEFAULT_LETTERS: LetterItem[] = [
  {
    id: 'let-1',
    title: 'Open When You Miss Me',
    category: 'Open When You Miss Me',
    content: `My dearest Jessica,\n\nIf you are reading this, it means the miles between Nigeria and Romania feel a little heavier tonight. I want you to close your eyes, take a deep breath, and remember that every star above you is the very same sky looking down on me.\n\nDistance is only physical. My thoughts are always with you, in every quiet room, through every long day.\n\nWith all my heart,\npsállō`,
    is_locked: false,
    is_published: true,
    created_at: '2026-10-15',
  },
  {
    id: 'let-2',
    title: 'Open When You Need Encouragement',
    category: 'Open When You Need Encouragement',
    content: `Jessica,\n\nI watch you pour so much heart and discipline into medicine, studying through fatigue and carrying so much grace. Never doubt how brilliant and gifted your hands and mind are.\n\nYou were made for this work, and you are going to be an extraordinary doctor. I am cheering for you always.\n\nYours,\npsállō`,
    is_locked: false,
    is_published: true,
    created_at: '2026-10-22',
  },
  {
    id: 'let-3',
    title: 'Open When You Can’t Sleep',
    category: 'Open When You Can’t Sleep',
    content: `Rest your head, darling.\n\nThe world can wait until morning. All the exams, all the plans, all the unanswered thoughts — leave them in my keeping for tonight. Put on your softest blanket, listen to our guitar song, and let sleep come gently.\n\nGoodnight, my sweet girl.`,
    is_locked: false,
    is_published: true,
    created_at: '2026-11-01',
  },
  {
    id: 'let-4',
    title: 'A Letter for Our Next Chapter',
    category: 'Special Occasions',
    content: `Locked until the right hour.\n\nThis letter holds thoughts kept for the day we step into our next milestone together.`,
    unlock_date: '2026-12-25',
    is_locked: true,
    is_published: true,
    created_at: '2026-11-04',
  },
];

export const DEFAULT_DATES: ImportantDateItem[] = [
  {
    id: 'date-1',
    title: 'Four Months Anniversary',
    target_date: '2026-11-04T18:00:00Z',
    category: 'Anniversary',
    description: 'Four months of conversations, laughter, honest prayers, and growing connection.',
    country_connection: 'Nigeria ↔ Romania',
    is_highlighted: true,
  },
  {
    id: 'date-2',
    title: 'Jessica’s Medical Graduation',
    target_date: '2027-06-20T10:00:00Z',
    category: 'Graduation',
    description: 'Celebrating Dr. Jessica — the culmination of countless hours of sacrifice and study.',
    country_connection: 'Bucharest, Romania',
    is_highlighted: true,
  },
  {
    id: 'date-3',
    title: 'Our Next In-Person Meeting',
    target_date: '2026-12-20T14:00:00Z',
    category: 'Meeting',
    description: 'Counting down the days until we are finally in the same room without a screen between us.',
    country_connection: 'Airport Arrivals Gate',
    is_highlighted: true,
  },
];

export const DEFAULT_FLOWERS: GardenFlowerItem[] = [
  {
    id: 'flw-1',
    flower_name: 'The First Spark Rose',
    flower_type: 'Vintage Rose',
    milestone_title: 'How We First Met',
    story: 'December 2025: A spontaneous conversation that felt like breathing fresh air after years of wandering.',
    bloom_date: 'December 2025',
    color: '#F472B6',
  },
  {
    id: 'flw-2',
    flower_name: 'The Midnight Peony',
    flower_type: 'Princess Peony',
    milestone_title: 'Things Went Up a Notch',
    story: 'February 2026: When polite exchanges turned into late-night hours where neither of us wanted to say goodnight.',
    bloom_date: 'February 2026',
    color: '#FBCFE8',
  },
  {
    id: 'flw-3',
    flower_name: 'The Golden Lily of Care',
    flower_type: 'Celestial Lily',
    milestone_title: 'Involved In Her Life',
    story: 'March 2026: Sharing routines, daily prayers, medical school worries, and everyday joys.',
    bloom_date: 'March 2026',
    color: '#FDE047',
  },
  {
    id: 'flw-4',
    flower_name: 'The Four-Month Blossom',
    flower_type: 'Vintage Rose',
    milestone_title: 'November 4 Milestone',
    story: 'November 4, 2026: An acoustic guitar dedication, honest poetry, and a story worth taking one step at a time.',
    bloom_date: 'November 4, 2026',
    color: '#EC4899',
  },
];

export const DEFAULT_CINEMA: CinemaMediaItem[] = [
  {
    id: 'cin-1',
    title: 'A Glimpse of Planet Uto',
    caption: 'Our first video memory preserved in moving frames.',
    media_type: 'video',
    media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    event_date: 'March 2026',
    recap_month: 'March',
    recap_year: '2026',
  },
  {
    id: 'cin-2',
    title: 'Your Radiant Smile',
    caption: 'The smile that lights up any screen across thousands of miles.',
    media_type: 'photo',
    media_url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    event_date: 'November 2026',
    recap_month: 'November',
    recap_year: '2026',
  },
];

export const DEFAULT_LITTLE_THINGS: LittleThingItem[] = [
  {
    id: 'lt-1',
    title: 'The Way You Pronounce Certain Words',
    quote_or_memory: 'A soft Romanian cadence that slips into your English when you get excited talking about your day.',
    context: 'Late night voice calls',
    category: 'Little Details I Remember',
    date_noted: 'September 2026',
  },
  {
    id: 'lt-2',
    title: 'Dr. Jessica’s Coffee Philosophy',
    quote_or_memory: '"Coffee isn’t a beverage during exam week; it’s an intravenous fluid!"',
    context: 'Studying for pharmacology finals',
    category: 'Funny Things She Said',
    date_noted: 'October 2026',
  },
  {
    id: 'lt-3',
    title: 'The Quietest Prayers',
    quote_or_memory: 'How you always whisper a prayer of gratitude before sleeping, no matter how exhausted you are.',
    context: 'Devotion and character',
    category: 'Things I Never Want to Forget',
    date_noted: 'August 2026',
  },
];

export const DEFAULT_FUTURE_MUSEUM: FutureMuseumItem[] = [
  {
    id: 'fm-1',
    title: 'An Evening Walk in Old Town Bucharest',
    category: 'Places to Visit',
    status: 'planned',
    target_location: 'Bucharest, Romania',
    notes: 'Coffee, cobblestone alleys, your hand in mine, and no airports left between us.',
  },
  {
    id: 'fm-2',
    title: 'Cooking Our First Dinner Together',
    category: 'Traditions to Begin',
    status: 'someday',
    target_location: 'Our Kitchen',
    notes: 'A blend of Nigerian spices and Romanian sweets, with music playing in the background.',
  },
  {
    id: 'fm-3',
    title: 'Celebrating Your Graduation Day in Person',
    category: 'Things to Experience',
    status: 'planned',
    target_location: 'Medical University Hall',
    notes: 'Bringing the biggest bouquet of pink peonies and clapping louder than anyone in the room.',
  },
  {
    id: 'fm-4',
    title: 'Four Months Anniversary Date Online',
    category: 'Things to Experience',
    status: 'experienced',
    target_location: 'Planet Uto Screen Date',
    notes: 'November 4, 2026: An original guitar piece, poetry, and dedicated keepsakes.',
    reflection: 'The foundation of something truly beautiful and enduring.',
  },
];

export const DEFAULT_SECRET_DISCOVERIES: SecretDiscovery[] = [
  {
    id: 'secret-1',
    code: 'NOVEMBER4',
    title: 'The Constellation of Jessica',
    message: 'You found the secret star! In the vastness of the universe, loving you is the easiest choice I ever made.',
    author: 'psállō',
    rewardType: 'letter',
  },
  {
    id: 'secret-2',
    code: 'UTO',
    title: 'Princess of Planet Uto',
    message: 'A crown made of stardust and roses, fitted only for you.',
    author: 'psállō',
    rewardType: 'easter_egg',
  },
];

