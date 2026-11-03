/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export function useYouTubePlayer(playlistId: string) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [currentTitle, setCurrentTitle] = useState<string>('Loading...');

  const updateTitle = () => {
    if (playerRef.current && playerRef.current.getVideoData) {
      const data = playerRef.current.getVideoData();
      if (data && data.title) {
        setCurrentTitle(data.title);
      }
    }
  };

  useEffect(() => {
    // Load YT API if not already loaded
    if (!window.YT && !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    const initPlayer = () => {
      if (!containerRef.current) return;
      
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '0',
        width: '0',
        playerVars: {
          listType: 'playlist',
          list: playlistId,
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            event.target.setLoop(true);
            setIsLooping(true);
            if (event.target.setShuffle) event.target.setShuffle(true);
            // Browser autoplay policy requires starting muted, then unmuting.
            // This allows music to begin immediately without a user gesture block.
            event.target.mute();
            event.target.playVideo();
            // After a short delay, unmute and restore volume so it plays audibly
            setTimeout(() => {
              if (event.target && event.target.unMute) {
                event.target.unMute();
                event.target.setVolume(60);
              }
            }, 1500);
            updateTitle();
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0, BUFFERING = 3
            if (event.data === 1) {
              setIsPlaying(true);
              updateTitle();
            } else if (event.data === 2) {
              setIsPlaying(false);
            } else if (event.data === 0) {
              // If not looping internally, we might need to handle next
            }
          },
        },
      });
    };

    // If API ready, init immediately (if we have a container)
    // Wait for container to be set via ref callback
    const checkAndInit = setInterval(() => {
      if (window.YT && window.YT.Player && containerRef.current && !playerRef.current) {
        clearInterval(checkAndInit);
        initPlayer();
      }
    }, 100);

    // Fallback callback
    window.onYouTubeIframeAPIReady = () => {
      if (containerRef.current && !playerRef.current) initPlayer();
    };

    return () => {
      clearInterval(checkAndInit);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      setIsReady(false);
    };
  }, [playlistId]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying, isReady]);

  const play = useCallback(() => {
    if (!playerRef.current || !isReady) return;
    playerRef.current.playVideo();
  }, [isReady]);

  const nextTrack = useCallback(() => {
    if (!playerRef.current || !isReady) return;
    playerRef.current.nextVideo();
  }, [isReady]);

  const prevTrack = useCallback(() => {
    if (!playerRef.current || !isReady) return;
    playerRef.current.previousVideo();
  }, [isReady]);

  const toggleLoop = useCallback(() => {
    if (!playerRef.current || !isReady) return;
    const newLoopState = !isLooping;
    playerRef.current.setLoop(newLoopState);
    setIsLooping(newLoopState);
  }, [isLooping, isReady]);

  const setMuted = useCallback((muted: boolean) => {
    if (!playerRef.current || !isReady) return;
    if (muted) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
      playerRef.current.setVolume(60);
    }
  }, [isReady]);

  const mountNode = useCallback((node: HTMLDivElement | null) => {
    if (node && !containerRef.current) {
      containerRef.current = node;
    }
  }, []);

  return {
    isReady,
    isPlaying,
    isLooping,
    currentTitle,
    togglePlay,
    play,
    nextTrack,
    prevTrack,
    toggleLoop,
    setMuted,
    mountNode, // The component must render <div ref={mountNode} />
  };
}
