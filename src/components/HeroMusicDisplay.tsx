import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Play, Pause, ExternalLink, ArrowRight } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useNavigate } from 'react-router-dom';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork_url: string;
  spotify_url?: string;
  youtube_url?: string;
  apple_url?: string;
  preview_url?: string | null;
  date_added: string;
}

interface AllSongsData {
  songs: Song[];
}

const HeroMusicDisplay = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentSongs();
  }, []);

  // Auto-rotation when not playing
  useEffect(() => {
    if (!isPlaying && songs.length > 1) {
      // Start rotation timer (5 seconds)
      rotationTimerRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % songs.length);
          setTimeout(() => setIsTransitioning(false), 50);
        }, 200);
      }, 5000);
    } else {
      // Clear rotation timer when playing
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
        rotationTimerRef.current = null;
      }
    }

    return () => {
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
        rotationTimerRef.current = null;
      }
    };
  }, [isPlaying, songs.length]);


  const fetchCurrentSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/data/all-songs.json');
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data: AllSongsData = await response.json();
      // Take only the first 5 songs (most recent)
      const recentSongs = data.songs.slice(0, 5);
      setSongs(recentSongs);
      setCurrentDate(new Date().toISOString().split('T')[0]);
      setError(null);
      
      analytics.trackTopSongsWidgetLoaded(new Date().toISOString().split('T')[0], recentSongs.length);
    } catch (err) {
      setError('Failed to load songs');
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentSong = songs[currentIndex];

  // Audio control effects
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    const handleAudioEnd = () => {
      // Auto-advance to next song when current song ends
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % songs.length);
        analytics.trackEvent('song_auto_advance', { 
          from_song: currentSong.title,
          from_artist: currentSong.artist 
        });
        setTimeout(() => setIsTransitioning(false), 50);
      }, 200);
    };

    if (isPlaying) {
      // If there's a preview URL, try to play it
      if (currentSong.preview_url) {
        audio.src = currentSong.preview_url;
        audio.addEventListener('ended', handleAudioEnd);
        audio.play().catch(() => {
          // If preview fails, stop playing
          setIsPlaying(false);
        });
      } else {
        // No preview available, just track the play event
        setIsPlaying(false);
      }
    } else {
      audio.pause();
    }

    // Cleanup event listener
    return () => {
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, [isPlaying, currentSong, songs.length]);

  const handlePrevious = () => {
    const wasPlaying = isPlaying;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
      // Keep playing state if music was playing
      if (!wasPlaying) {
        setIsPlaying(false);
      }
      analytics.trackEvent('song_navigation', { direction: 'previous' });
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  };

  const handleNext = () => {
    const wasPlaying = isPlaying;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % songs.length);
      // Keep playing state if music was playing
      if (!wasPlaying) {
        setIsPlaying(false);
      }
      analytics.trackEvent('song_navigation', { direction: 'next' });
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  };

  const handlePlayPause = () => {
    if (currentSong) {
      if (isPlaying) {
        setIsPlaying(false);
        analytics.trackSongPaused(currentSong.title, currentSong.artist, currentIndex + 1);
      } else {
        // If no preview URL is available, just open the external link
        if (!currentSong.preview_url) {
          const url = getPreferredExternalUrl();
          if (url) {
            const platform = currentSong.apple_url ? 'apple_music' : 
                             currentSong.spotify_url ? 'spotify' : 'youtube';
            handleExternalLink(platform, url);
            return;
          }
        }
        setIsPlaying(true);
        analytics.trackSongPlayed(currentSong.title, currentSong.artist, currentIndex + 1);
      }
    }
  };

  const handleExternalLink = (platform: string, url: string) => {
    if (currentSong) {
      analytics.trackExternalMusicLink(platform, currentSong.title, currentSong.artist);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getPreferredExternalUrl = () => {
    if (!currentSong) return null;
    // Prefer Apple Music if available, then Spotify, then YouTube
    return currentSong.apple_url || currentSong.spotify_url || currentSong.youtube_url;
  };

  if (loading) {
    return (
      <div className="mt-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-20 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !currentSong) {
    return (
      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-2">Current Song</p>
        <Card className="p-3 border-dashed">
          <p className="text-sm text-gray-400">No songs available</p>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="mt-4">
      <audio ref={audioRef} />

      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-600 font-mono">
          Recent Top Songs - {currentDate && formatDate(currentDate)}
        </p>
        <button
          onClick={() => {
            analytics.trackNavigation('all_music_from_hero');

            // Check if browser supports View Transitions API
            if (document.startViewTransition) {
              document.startViewTransition(() => {
                flushSync(() => {
                  navigate('/music');
                });
              });
            } else {
              navigate('/music');
            }
          }}
          className="text-xs font-mono text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 cursor-pointer"
        >
          View All
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <Card className="p-3 bg-white/90 backdrop-blur-sm border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative flex-shrink-0">
            <img
              src={currentSong.artwork_url}
              alt={`${currentSong.album} artwork`}
              className={`w-12 h-12 rounded-md object-cover transition-transform duration-200 ${
                isTransitioning ? 'scale-95 rotate-2' : 'scale-100 rotate-0'
              }`}
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={handlePlayPause}
              className="absolute -bottom-1 -right-1 h-6 w-6 p-0 rounded-full shadow-sm"
            >
              {isPlaying ? (
                <Pause className="h-2.5 w-2.5" />
              ) : (
                <Play className="h-2.5 w-2.5" />
              )}
            </Button>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm truncate text-gray-900 transition-opacity duration-200 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}>
              {currentSong.title}
            </h4>
            <p className={`text-xs text-gray-600 truncate transition-opacity duration-200 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}>
              {currentSong.artist}
            </p>
            
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const url = getPreferredExternalUrl();
                if (url) {
                  const platform = currentSong.apple_url ? 'apple_music' : 
                                   currentSong.spotify_url ? 'spotify' : 'youtube';
                  handleExternalLink(platform, url);
                }
              }}
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            
            <div className="flex flex-col space-y-0.5">
              <Button
                size="sm"
                variant="ghost"
                onClick={handlePrevious}
                className="h-5 w-5 p-0 text-gray-500 hover:text-gray-700"
                disabled={songs.length <= 1}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleNext}
                className="h-5 w-5 p-0 text-gray-500 hover:text-gray-700"
                disabled={songs.length <= 1}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HeroMusicDisplay;