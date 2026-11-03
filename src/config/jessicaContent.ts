export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  imageCaption?: string;
  video?: string;
  videoCaption?: string;
  isMilestone?: boolean;
}

export interface AppreciationItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  iconName?: 'Sparkles' | 'Heart' | 'Compass' | 'BookOpen' | 'Sun' | 'Smile' | 'Feather';
}

export interface JessicaContentConfig {
  welcome: {
    heading: string;
    subheading: string;
    supportingText: string;
    buttonText: string;
  };
  timeline: {
    sectionTitle: string;
    sectionSubtitle: string;
    entries: TimelineEntry[];
  };
  appreciations: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: AppreciationItem[];
  };
  poetry: {
    sectionTitle: string;
    sectionSubtitle: string;
    introText: string;
    /**
     * Specify poem titles (or IDs) from your Uto Omega collection to feature here.
     * If empty, the first 3 poems from your collection will be displayed by default.
     */
    featuredPoemTitles: string[];
  };
  composition: {
    sectionLabel: string;
    title: string;
    date: string;
    dedication: string;
    description: string;
    performanceNote: string;
  };
  closing: {
    heading: string;
    message: string;
    subtext: string;
  };
  music: {
    playlistId: string;
  };
}

/**
 * ==============================================================================
 * JESSICA'S EXPERIENCE CONTENT CONFIGURATION
 * ==============================================================================
 * 
 * Edit this file to customize all text, memories, dates, and appreciation notes.
 * Placeholder entries are provided below so you can easily replace them with
 * your personal memories and photos.
 */
export const JESSICA_CONTENT: JessicaContentConfig = {
  welcome: {
    heading: "For Uto.",
    subheading: "A Digital Keepsake",
    supportingText: "A little corner of the internet dedicated to a story I'm grateful to be part of.",
    buttonText: "Begin our little story",
  },

  timeline: {
    sectionTitle: "Our Story",
    sectionSubtitle: "The quiet beginnings and the moments that made us",
    entries: [
      {
        id: "timeline-1",
        date: "July 2026",
        title: "How We First Met",
        description:
          "The very first conversation that started everything. A simple exchange of words that somehow felt different from the rest—the beginning of a chapter neither of us could have anticipated.",
        // image: "/images/jessica/first-met.jpg",
        imageCaption: "Where the story began",
      },
      {
        id: "timeline-2",
        date: "July 2026",
        title: "Our First Meaningful Conversations",
        description:
          "The conversations that stretched late into the evening. Finding ourselves talking with effortless honesty about our lives, our thoughts, and the things that matter most to us.",
        imageCaption: "Hours feeling like minutes",
      },
      {
        id: "timeline-3",
        date: "August 2026",
        title: "When Connection Became Special",
        description:
          "A quiet turning point where you stopped being just someone I was getting to know, and became someone I looked forward to speaking with every single day.",
        imageCaption: "A subtle shift in the heart",
      },
      {
        id: "timeline-4",
        date: "September 2026",
        title: "Shared Laughter & Late Night Chats",
        description:
          "The banter, the jokes only the two of us understand, and the comfort of being completely ourselves. Those memories remain some of my fondest.",
        imageCaption: "Moments etched in memory",
      },
      {
        id: "timeline-5",
        date: "October 2026",
        title: "Growing Closer Through Every Conversation",
        description:
          "Navigating the distance with patience, care, and curiosity. Each talk revealed another layer of your character, and every time, I was left even more inspired.",
        imageCaption: "Deepening roots",
      },
      {
        id: "timeline-6",
        date: "November 4, 2026",
        title: "Four Months Together",
        description:
          "Four beautiful months of friendship, warmth, and discovery. Celebrating today because every single day of knowing you has made my world that much richer.",
        imageCaption: "November 4, 2026",
        isMilestone: true,
      },
    ],
  },

  appreciations: {
    sectionTitle: "Things I Love About You",
    sectionSubtitle: "The qualities, moments, and grace that make you uniquely Uto",
    items: [
      {
        id: "appreciation-kindness",
        title: "Your Genuine Kindness",
        category: "Character",
        description:
          "The natural, effortless gentleness with which you treat the people around you. You carry a warmth that puts people at ease the moment they are near you.",
        iconName: "Heart",
      },
      {
        id: "appreciation-intelligence",
        title: "Your Thoughtful Mind",
        category: "Intellect & Curiosity",
        description:
          "The way you think deeply about ideas, question things with curiosity, and speak with insight. Talking with you always challenges and expands my perspective.",
        iconName: "Sparkles",
      },
      {
        id: "appreciation-faith",
        title: "Your Faith & Core Values",
        category: "Conviction",
        description:
          "The quiet strength rooted in your faith and principles. Your values aren't just things you speak about—they genuinely shape how you live, choose, and love.",
        iconName: "Compass",
      },
      {
        id: "appreciation-ambition",
        title: "Your Quiet Ambition",
        category: "Drive & Dedication",
        description:
          "The determination with which you pursue what matters to you. Watching your discipline and passion for your goals is something I deeply admire.",
        iconName: "Sun",
      },
      {
        id: "appreciation-humour",
        title: "Your Sense of Humour",
        category: "Joy & Laughter",
        description:
          "The bright, infectious laugh that catches me off guard, and the way you can find delight in the smallest, most unexpected things.",
        iconName: "Smile",
      },
      {
        id: "appreciation-little-things",
        title: "The Little Things I Notice",
        category: "Observations",
        description:
          "The cadence of your voice when you get excited about something you love, your expressive reactions, and the attentive way you listen when I speak.",
        iconName: "Feather",
      },
    ],
  },

  poetry: {
    sectionTitle: "Words from the Journal",
    sectionSubtitle: "Selected poems from Uto Omega, kept here for you",
    introText:
      "Uto Omega was built to hold honest thoughts in verse. Of all the words written in this collection, these felt like they belonged to this chapter with you.",
    /**
     * Control which poems appear in the experience's poetry section.
     *
     * - Add a poem's exact title here and it will appear automatically,
     *   even if you add it to your collection later.
     * - To show ALL poems from your collection, clear this list: []
     * - Titles are matched case-insensitively.
     */
    featuredPoemTitles: [
      "I Found Your Name",
      "Pressed Roses",
      "The Architecture of Longing",
    ],
  },

  composition: {
    sectionLabel: "An Original Composition",
    title: "November 4",
    date: "November 4, 2026",
    dedication: "Composed on acoustic guitar — dedicated to Uto",
    description:
      "A piece written and arranged for this specific date. Every progression and melody was shaped with memories of our four months together in mind, meant to be shared with you tonight.",
    performanceNote: "To be performed live for you during our call.",
  },

  closing: {
    heading: "To be continued...",
    message:
      "Some stories are worth taking one step at a time. I'm grateful for the chapters we've shared, and excited about the ones still ahead.",
    subtext: "November 4, 2026 — Four months of our story.",
  },

  music: {
    playlistId: "PLCOpQhumGeHc",
  },
};
