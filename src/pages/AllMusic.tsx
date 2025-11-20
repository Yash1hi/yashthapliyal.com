import React, { useEffect, useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Play, Pause, ExternalLink } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  date_added: string;
  preview_url?: string;
  apple_url?: string;
  spotify_url?: string;
  youtube_url?: string;
  artwork_url: string;
  apple_music_id?: string;
}

interface AllSongsData {
  songs: Song[];
}

const AllMusic = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.title = "All Music | Yash Thapliyal";
    fetchAllSongs();
    // Trigger staggered animations after a short delay
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const fetchAllSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/data/all-songs.json');
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data: AllSongsData = await response.json();
      setSongs(data.songs);
      setError(null);
      analytics.trackEvent('all_music_page_loaded', { song_count: data.songs.length });
    } catch (err) {
      setError('Failed to load songs');
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (song: Song) => {
    if (playingSongId === song.id) {
      // Pause current song
      audioRef.current?.pause();
      setPlayingSongId(null);
      analytics.trackEvent('song_paused', {
        title: song.title,
        artist: song.artist
      });
    } else {
      // Play new song
      if (song.preview_url) {
        if (audioRef.current) {
          audioRef.current.src = song.preview_url;
          audioRef.current.play().catch(() => {
            // If preview fails, open external link
            handleExternalLink(song);
          });
          setPlayingSongId(song.id);
          analytics.trackEvent('song_played', {
            title: song.title,
            artist: song.artist
          });
        }
      } else {
        // No preview available, open external link
        handleExternalLink(song);
      }
    }
  };

  const handleExternalLink = (song: Song) => {
    const url = song.apple_url || song.spotify_url || song.youtube_url;
    if (url) {
      const platform = song.apple_url ? 'apple_music' :
                       song.spotify_url ? 'spotify' : 'youtube';
      analytics.trackEvent('external_music_link_clicked', {
        platform,
        title: song.title,
        artist: song.artist
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="animate-pulse space-y-8">
            <div className="h-20 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="text-center">
            <h1 className="font-mono text-4xl font-bold mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      <audio ref={audioRef} />

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-24 pb-20">
        <div className="mb-4">
          <h1 className={`font-mono text-3xl md:text-4xl font-bold mb-4 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="bg-black text-white px-3 py-1 rounded-md">Songs</span>
          </h1>
          <p className={`font-mono text-sm text-gray-600 mb-6 transition-all duration-500 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            I like music. Take a look
          </p>

          {/* Search Bar */}
          <div className={`flex items-center gap-4 mb-2 transition-all duration-500 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <input
              type="text"
              placeholder="Search by title, artist, or album..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-2xl w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-gray-900 focus:outline-none font-mono text-sm transition-colors"
            />
            <p className="font-mono text-xs text-gray-500">
              {filteredSongs.length} song{filteredSongs.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Songs Table */}
        <div className={`bg-white border-2 border-gray-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900 text-white border-b-2 border-gray-900">
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider">
                    Artwork
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider hidden md:table-cell">
                    Artist
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider hidden lg:table-cell">
                    Date Added
                  </th>
                  <th className="px-4 py-3 text-center font-mono text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSongs.map((song, index) => (
                  <tr
                    key={song.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 ${
                      playingSongId === song.id ? 'bg-gray-100' : ''
                    } ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                      transitionDelay: loaded ? `${400 + index * 30}ms` : '0ms'
                    }}
                  >
                    <td className="px-4 py-2">
                      <img
                        src={song.artwork_url}
                        alt={`${song.album} artwork`}
                        className="w-12 h-12 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-mono font-semibold text-sm text-gray-900">
                        {song.title}
                      </div>
                      <div className="font-mono text-xs text-gray-600 md:hidden">
                        {song.artist}
                      </div>
                    </td>
                    <td className="px-4 py-2 font-mono text-sm text-gray-700 hidden md:table-cell">
                      {song.artist}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-gray-500 hidden lg:table-cell">
                      {formatDate(song.date_added)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant={playingSongId === song.id ? "default" : "outline"}
                          onClick={() => handlePlayPause(song)}
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          {playingSongId === song.id ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        {(song.apple_url || song.spotify_url || song.youtube_url) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExternalLink(song)}
                            className="h-8 w-8 p-0 rounded-full"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredSongs.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-xl text-gray-500">
              No songs found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMusic;