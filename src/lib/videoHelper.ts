/**
 * Utility to parse and format video URLs from various platforms
 * including Google Drive, YouTube, Vimeo, Dropbox, and direct media files.
 */

export interface VideoInfo {
  type: 'gdrive' | 'youtube' | 'vimeo' | 'direct';
  src: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  isEmbed: boolean;
}

export function parseVideoUrl(rawUrl?: string | null): VideoInfo {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { type: 'direct', src: '', isEmbed: false };
  }
  const trimmed = rawUrl.trim();

  // 1. Google Drive:
  // e.g. https://drive.google.com/file/d/1a2b3c4d5e/view?usp=sharing
  // https://drive.google.com/file/d/1a2b3c4d5e/view
  // https://drive.google.com/open?id=1a2b3c4d5e
  // https://drive.google.com/uc?id=1a2b3c4d5e
  const gdriveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  const gdriveIdMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([a-zA-Z0-9_-]+)/i);
  const gdriveId = gdriveFileMatch?.[1] || gdriveIdMatch?.[1];

  if (gdriveId) {
    return {
      type: 'gdrive',
      src: `https://drive.google.com/file/d/${gdriveId}/preview`,
      embedUrl: `https://drive.google.com/file/d/${gdriveId}/preview`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${gdriveId}&sz=w800`,
      isEmbed: true,
    };
  }

  // 2. YouTube:
  // e.g. https://www.youtube.com/watch?v=VIDEO_ID, https://youtu.be/VIDEO_ID, https://www.youtube.com/shorts/VIDEO_ID
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/i);
  if (ytMatch?.[1]) {
    const ytId = ytMatch[1];
    return {
      type: 'youtube',
      src: `https://www.youtube.com/embed/${ytId}?autoplay=1`,
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      isEmbed: true,
    };
  }

  // 3. Vimeo:
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch?.[1]) {
    const vimeoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      isEmbed: true,
    };
  }

  // 4. Dropbox: Convert ?dl=0 to ?raw=1 for direct streaming
  if (trimmed.includes('dropbox.com')) {
    const directUrl = trimmed.replace(/[?&]dl=0/, '').replace(/[?&]raw=1/, '') + (trimmed.includes('?') ? '&raw=1' : '?raw=1');
    return {
      type: 'direct',
      src: directUrl,
      isEmbed: false,
    };
  }

  // 5. Direct MP4 / WebM / Blob / Base64
  return {
    type: 'direct',
    src: trimmed,
    isEmbed: false,
  };
}
