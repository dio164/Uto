import React from 'react';
import { parseVideoUrl } from '../../lib/videoHelper';
import { Video as VideoIcon } from 'lucide-react';

interface UniversalVideoProps {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  poster?: string;
  playsInline?: boolean;
  muted?: boolean;
  title?: string;
}

export const UniversalVideo: React.FC<UniversalVideoProps> = ({
  src,
  autoPlay = false,
  controls = true,
  className = 'w-full h-full',
  poster,
  playsInline = true,
  muted = false,
  title = 'Video player',
}) => {
  const parsed = parseVideoUrl(src);

  if (!parsed.src) {
    return (
      <div className={`flex items-center justify-center bg-black/60 text-white/50 text-xs ${className}`}>
        No video source
      </div>
    );
  }

  // Google Drive, YouTube, or Vimeo embed
  if (parsed.isEmbed && parsed.embedUrl) {
    return (
      <div className={`relative overflow-hidden bg-black flex items-center justify-center ${className}`}>
        <iframe
          src={parsed.embedUrl}
          title={title}
          className="w-full h-full min-h-[300px] sm:min-h-[420px] border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // Standard HTML5 video
  return (
    <video
      src={parsed.src}
      controls={controls}
      autoPlay={autoPlay}
      poster={poster || parsed.thumbnailUrl}
      playsInline={playsInline}
      muted={muted}
      preload="metadata"
      className={className}
    >
      Your browser does not support the video tag.
    </video>
  );
};

interface UniversalVideoThumbnailProps {
  src: string;
  className?: string;
  alt?: string;
}

export const UniversalVideoThumbnail: React.FC<UniversalVideoThumbnailProps> = ({
  src,
  className = 'w-full h-full object-cover',
  alt = 'Video thumbnail',
}) => {
  const parsed = parseVideoUrl(src);

  // If it's Google Drive or YouTube, we have an image thumbnail URL!
  if (parsed.thumbnailUrl) {
    return (
      <img
        src={parsed.thumbnailUrl}
        alt={alt}
        className={className}
        loading="lazy"
        onError={(e) => {
          // If Google Drive thumbnail fails (e.g. strict domain policy), fallback to simple placeholder
          (e.currentTarget as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  // Direct video: render muted metadata video element
  if (parsed.type === 'direct') {
    return (
      <video
        src={parsed.src}
        className={className}
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <div className={`flex items-center justify-center bg-black/40 text-white/60 ${className}`}>
      <VideoIcon className="w-6 h-6" />
    </div>
  );
};
