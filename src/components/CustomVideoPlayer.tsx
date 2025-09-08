import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface CustomVideoPlayerProps {
  src: string;
  className?: string;
  onPlay?: () => void;
  autoPlay?: boolean;
  playOnIntersect?: boolean;
  showControls?: boolean;
  playOnceOnly?: boolean;
  pauseTrigger?: number;
}

const CustomVideoPlayer = ({ src, className = "", onPlay, autoPlay = false, playOnIntersect = false, showControls = true, playOnceOnly = false, pauseTrigger }: CustomVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideoControls, setShowVideoControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.6,
    triggerOnce: true,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadstart', handleLoadStart);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [src]);

  // Auto-play when intersection is detected (only once if playOnceOnly is true)
  useEffect(() => {
    if (playOnIntersect && isIntersecting && !isPlaying && videoRef.current) {
      // Check if we should skip auto-play due to playOnceOnly restriction
      if (playOnceOnly && hasAutoPlayed) return;
      
      const playVideo = async () => {
        try {
          // Pause all other media
          const allMedia = document.querySelectorAll('audio, video');
          allMedia.forEach(media => {
            const mediaElement = media as HTMLMediaElement;
            if (mediaElement !== videoRef.current && !mediaElement.paused) {
              mediaElement.pause();
            }
          });
          
          await videoRef.current!.play();
          setIsPlaying(true);
          setHasAutoPlayed(true);
          onPlay?.();
        } catch (error) {
          console.error('Auto-play failed:', error);
        }
      };
      
      playVideo();
    }
  }, [playOnIntersect, isIntersecting, isPlaying, onPlay, playOnceOnly, hasAutoPlayed]);

  // Listen for external pause requests
  useEffect(() => {
    if (pauseTrigger && pauseTrigger > 0 && isPlaying && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [pauseTrigger, isPlaying]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        // Pause all other audio and video elements
        const allMedia = document.querySelectorAll('audio, video');
        allMedia.forEach(media => {
          const mediaElement = media as HTMLMediaElement;
          if (mediaElement !== video && !mediaElement.paused) {
            mediaElement.pause();
          }
        });
        
        await video.play();
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (error) {
      console.error('Error playing video:', error);
      setIsLoading(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    const newTime = clickRatio * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickRatio * 100);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    if (showControls) {
      setShowVideoControls(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowVideoControls(false);
        }, 3000);
      }
    }
  };

  return (
    <div 
      ref={intersectionRef}
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && showControls && setShowVideoControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto rounded-xl cursor-pointer"
        autoPlay={autoPlay}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        style={{ minHeight: '250px', maxHeight: '600px' }}
      />
      
      {/* Custom Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl transition-opacity duration-300">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-gold/90 hover:bg-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl"
          >
            {isLoading ? (
              <div className="w-8 h-8 border-3 border-gold-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-10 h-10 text-gold-foreground ml-1" />
            )}
          </button>
        </div>
      )}

      {/* Custom Controls */}
      {showControls && (
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-b-xl transition-opacity duration-300 ${
            showVideoControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-3">
            <div 
              className="w-full h-2 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-gold rounded-full transition-all duration-150 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-gold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>
              
              <button
                onClick={toggleMute}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              
              {!isPlaying && (
                <span className="text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;