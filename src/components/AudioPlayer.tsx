import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  bookTitle: string;
  className?: string;
}

const AudioPlayer = ({ audioUrl, bookTitle, className = "" }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
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

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [audioUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // Pause all other audio and video elements
        const allMedia = document.querySelectorAll('audio, video');
        allMedia.forEach(media => {
          const mediaElement = media as HTMLMediaElement;
          if (mediaElement !== audio && !mediaElement.paused) {
            mediaElement.pause();
          }
        });
        
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoading(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    const newTime = clickRatio * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickRatio * 100);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) return null;

  return (
    <div className={`bg-card/60 backdrop-blur-sm border border-gold/20 rounded-lg p-2 ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      
      
      {/* Compact Control Layout */}
      <div className="flex items-center gap-2">
        {/* Play/Pause Button with Progress Ring */}
        <div className="relative flex-shrink-0">
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="relative w-10 h-10 bg-gold/20 hover:bg-gold/30 border-2 border-gold/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 text-gold" />
            ) : (
              <Play className="w-4 h-4 text-gold ml-0.5" />
            )}
            
            {/* Circular Progress Ring */}
            {duration > 0 && (
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="hsl(var(--gold) / 0.2)"
                  strokeWidth="2"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="hsl(var(--gold))"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress / 100)}`}
                  className="transition-all duration-150 ease-out"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Time Display and Volume */}
        <div className="flex-1 flex items-center justify-between gap-2">
          {/* Time Display */}
          <div className="text-xs text-gold font-medium">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Animated Playing Indicator */}
            {isPlaying && (
              <div className="flex items-center gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-gold rounded-full animate-pulse"
                    style={{
                      height: `${4 + (i % 2) * 2}px`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '0.6s'
                    }}
                  />
                ))}
              </div>
            )}
            
            <button
              onClick={toggleMute}
              className="w-5 h-5 flex items-center justify-center text-gold/70 hover:text-gold transition-colors rounded-lg hover:bg-gold/10"
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;