import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, TrendingUp, Music2, Disc3, Heart, X } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';

const API_URL = 'http://127.0.0.1:8501';

interface Artist {
    name: string;
    image_url: string;
    external_url: string;
}

interface Track {
    id: string;
    name: string;
    artists: string[];
    image_url: string;
    external_url: string;
    release_date?: string;
}

interface AudioProfile {
    energy: number;
    danceability: number;
    valence: number;
    acousticness: number;
    instrumentalness: number;
    tempo: number;
    tracks_analyzed: number;
}

interface ListeningStats {
    total_top_tracks: number;
    total_top_artists: number;
    total_genres: number;
    total_liked_tracks: number;
    top_track: {
        name: string;
        artist: string;
        image_url: string;
        external_url: string;
    } | null;
    top_artist: {
        name: string;
        image_url: string;
        external_url: string;
        genres: string[];
    } | null;
}

interface DashboardStats {
    top_genres: [string, number][];
    top_artists: Artist[];
    top_tracks: Track[];
    new_releases: Track[];
    recent: Track[];
    audio_profile: AudioProfile | null;
    listening_stats: ListeningStats | null;
}

export function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedStat, setExpandedStat] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('spotify_token');
            if (!token) {
                setError('Not authenticated');
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${API_URL}/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err: any) {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('spotify_token');
                    window.location.href = `${API_URL}/login`;
                    return;
                }
                setError(err.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-spotify border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-green-500 text-xl">Loading your music stats...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center text-red-500 p-8">
                <h1 className="text-2xl mb-4">Error Loading Dashboard</h1>
                <p className="mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="bg-spotify text-black px-6 py-2 rounded-full font-bold">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar />

            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-10 p-8 rounded-3xl bg-gradient-to-br from-spotify/20 via-emerald-900/10 to-transparent border border-spotify/10 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-spotify/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="text-spotify" size={32} />
                            <h1 className="text-4xl font-bold">Your Music Dashboard</h1>
                        </div>
                        <p className="text-gray-400 text-lg">Here's a snapshot of your unique taste in music</p>
                    </div>
                </motion.div>

                {/* Audio Profile */}
                {stats?.audio_profile && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            🎧 Your Audio DNA
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <AudioBar label="Energy" value={stats.audio_profile.energy} color="from-orange-500 to-red-500" emoji="⚡" />
                            <AudioBar label="Danceability" value={stats.audio_profile.danceability} color="from-pink-500 to-purple-500" emoji="💃" />
                            <AudioBar label="Happiness" value={stats.audio_profile.valence} color="from-yellow-400 to-orange-500" emoji="😊" />
                            <AudioBar label="Acoustic" value={stats.audio_profile.acousticness} color="from-green-400 to-emerald-600" emoji="🎸" />
                        </div>
                        <p className="text-gray-500 text-sm mt-4 text-center">
                            Based on analysis of your top {stats.audio_profile.tracks_analyzed} tracks • Avg tempo: {stats.audio_profile.tempo} BPM
                        </p>
                    </motion.section>
                )}

                {/* Top Track & Artist Highlight */}
                {stats?.listening_stats && (stats.listening_stats.top_track || stats.listening_stats.top_artist) && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold mb-6">🏆 Your #1s</h2>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Top Track Card */}
                            {stats.listening_stats.top_track && (
                                <motion.a
                                    href={stats.listening_stats.top_track.external_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02 }}
                                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-spotify/20 to-emerald-900/20 border border-spotify/20 p-6 flex items-center gap-6 group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                    <img
                                        src={stats.listening_stats.top_track.image_url || 'https://via.placeholder.com/100'}
                                        alt={stats.listening_stats.top_track.name}
                                        className="w-24 h-24 rounded-xl shadow-xl"
                                    />
                                    <div>
                                        <p className="text-spotify text-sm font-semibold mb-1">TOP TRACK</p>
                                        <h3 className="text-xl font-bold">{stats.listening_stats.top_track.name}</h3>
                                        <p className="text-gray-400">{stats.listening_stats.top_track.artist}</p>
                                    </div>
                                </motion.a>
                            )}

                            {/* Top Artist Card */}
                            {stats.listening_stats.top_artist && (
                                <motion.a
                                    href={stats.listening_stats.top_artist.external_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02 }}
                                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/20 p-6 flex items-center gap-6 group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                    <img
                                        src={stats.listening_stats.top_artist.image_url || 'https://via.placeholder.com/100'}
                                        alt={stats.listening_stats.top_artist.name}
                                        className="w-24 h-24 rounded-full shadow-xl"
                                    />
                                    <div>
                                        <p className="text-purple-400 text-sm font-semibold mb-1">TOP ARTIST</p>
                                        <h3 className="text-xl font-bold">{stats.listening_stats.top_artist.name}</h3>
                                        <p className="text-gray-400">{stats.listening_stats.top_artist.genres?.join(', ')}</p>
                                    </div>
                                </motion.a>
                            )}
                        </div>

                        {/* Interactive Stats Row */}
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            {/* Liked Tracks */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setExpandedStat(expandedStat === 'liked' ? null : 'liked')}
                                className="bg-white/5 p-4 rounded-xl text-center cursor-pointer hover:bg-white/10 transition-all border border-transparent hover:border-spotify/30"
                            >
                                <Heart className="mx-auto mb-2 text-spotify" size={20} />
                                <p className="text-2xl font-bold text-spotify">{stats.listening_stats.total_liked_tracks}</p>
                                <p className="text-xs text-gray-400">Liked Tracks</p>
                                <p className="text-[10px] text-gray-600 mt-1">Click to see recent</p>
                            </motion.div>

                            {/* Top Artists */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setExpandedStat(expandedStat === 'artists' ? null : 'artists')}
                                className="bg-white/5 p-4 rounded-xl text-center cursor-pointer hover:bg-white/10 transition-all border border-transparent hover:border-purple-500/30"
                            >
                                <TrendingUp className="mx-auto mb-2 text-purple-400" size={20} />
                                <p className="text-2xl font-bold text-purple-400">{stats.listening_stats.total_top_artists}</p>
                                <p className="text-xs text-gray-400">Top Artists</p>
                                <p className="text-[10px] text-gray-600 mt-1">Click to see list</p>
                            </motion.div>

                            {/* Unique Genres */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setExpandedStat(expandedStat === 'genres' ? null : 'genres')}
                                className="bg-white/5 p-4 rounded-xl text-center cursor-pointer hover:bg-white/10 transition-all border border-transparent hover:border-pink-500/30"
                            >
                                <Music2 className="mx-auto mb-2 text-pink-400" size={20} />
                                <p className="text-2xl font-bold text-pink-400">{stats.listening_stats.total_genres}</p>
                                <p className="text-xs text-gray-400">Unique Genres</p>
                                <p className="text-[10px] text-gray-600 mt-1">Click to explore</p>
                            </motion.div>

                            {/* Top Tracks */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setExpandedStat(expandedStat === 'tracks' ? null : 'tracks')}
                                className="bg-white/5 p-4 rounded-xl text-center cursor-pointer hover:bg-white/10 transition-all border border-transparent hover:border-cyan-500/30"
                            >
                                <Disc3 className="mx-auto mb-2 text-cyan-400" size={20} />
                                <p className="text-2xl font-bold text-cyan-400">{stats.listening_stats.total_top_tracks}</p>
                                <p className="text-xs text-gray-400">Top Tracks</p>
                                <p className="text-[10px] text-gray-600 mt-1">Click to see list</p>
                            </motion.div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {expandedStat && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 overflow-hidden"
                                >
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold">
                                                {expandedStat === 'liked' && '💚 Recently Liked Tracks'}
                                                {expandedStat === 'artists' && '🎤 Your Top Artists'}
                                                {expandedStat === 'genres' && '🎵 Your Music Genres'}
                                                {expandedStat === 'tracks' && '🎧 Your Top Tracks'}
                                            </h3>
                                            <button
                                                onClick={() => setExpandedStat(null)}
                                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        {/* Liked Tracks Content */}
                                        {expandedStat === 'liked' && stats.recent && (
                                            <div className="grid grid-cols-4 gap-3">
                                                {stats.recent.slice(0, 8).map((track, i) => (
                                                    <a key={i} href={track.external_url} target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                                        <img src={track.image_url} className="w-10 h-10 rounded" />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium truncate">{track.name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{track.artists?.join(', ')}</p>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        {/* Artists Content */}
                                        {expandedStat === 'artists' && stats.top_artists && (
                                            <div className="flex flex-wrap gap-3">
                                                {stats.top_artists.map((artist, i) => (
                                                    <a key={i} href={artist.external_url} target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-2 pr-4 rounded-full bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
                                                        <img src={artist.image_url} className="w-8 h-8 rounded-full" />
                                                        <span className="text-sm font-medium">{artist.name}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        {/* Genres Content */}
                                        {expandedStat === 'genres' && stats.top_genres && (
                                            <div className="flex flex-wrap gap-2">
                                                {stats.top_genres.map(([genre, count], i) => (
                                                    <span key={i} className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-sm border border-pink-500/20">
                                                        {genre} <span className="text-pink-400 ml-1">×{count}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Tracks Content */}
                                        {expandedStat === 'tracks' && stats.top_tracks && (
                                            <div className="grid grid-cols-2 gap-3">
                                                {stats.top_tracks.map((track, i) => (
                                                    <a key={i} href={track.external_url} target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors border border-cyan-500/10">
                                                        <span className="text-xl font-bold text-cyan-500 w-6">#{i + 1}</span>
                                                        <img src={track.image_url} className="w-12 h-12 rounded" />
                                                        <div className="min-w-0">
                                                            <p className="font-medium truncate">{track.name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{track.artists?.join(', ')}</p>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.section>
                )}

                {/* Top Artists */}
                {stats?.top_artists && stats.top_artists.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="text-purple-400" size={24} />
                            Your Top Artists
                        </h2>
                        <div className="grid grid-cols-5 gap-6">
                            {stats.top_artists.slice(0, 5).map((artist, index) => (
                                <motion.a
                                    key={artist.name}
                                    href={artist.external_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="flex flex-col items-center group"
                                >
                                    <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 ring-4 ring-transparent group-hover:ring-spotify transition-all shadow-xl">
                                        <img src={artist.image_url} alt={artist.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Play fill="white" className="text-white" size={32} />
                                        </div>
                                    </div>
                                    <span className="font-semibold text-center text-sm">{artist.name}</span>
                                    <span className="text-xs text-gray-500">#{index + 1}</span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Taste Profile / Top Genres */}
                {stats?.top_genres && stats.top_genres.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Music2 className="text-pink-400" size={24} />
                            Your Taste Profile
                        </h2>
                        <div className="flex gap-3 flex-wrap">
                            {stats.top_genres.slice(0, 8).map(([genre], index) => (
                                <motion.div
                                    key={genre}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.1 }}
                                    className="bg-gradient-to-r from-spotify/20 to-emerald-900/20 px-5 py-2.5 rounded-full text-spotify font-semibold uppercase tracking-wider text-sm border border-spotify/20 cursor-default"
                                >
                                    {genre}
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Top Tracks */}
                {stats?.top_tracks && stats.top_tracks.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Disc3 className="text-cyan-400" size={24} />
                            Top Tracks
                        </h2>
                        <div className="grid grid-cols-4 gap-6">
                            {stats.top_tracks.slice(0, 4).map((track, index) => (
                                <TrackCard key={track.id} track={track} index={index} />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* New Releases */}
                {stats?.new_releases && stats.new_releases.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold mb-6">🆕 New Releases</h2>
                        <div className="grid grid-cols-4 gap-6">
                            {stats.new_releases.slice(0, 4).map((track, index) => (
                                <TrackCard key={track.id || track.name} track={track} index={index} />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Recently Liked */}
                {stats?.recent && stats.recent.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold mb-6">💚 Recently Liked</h2>
                        <div className="grid grid-cols-4 gap-6">
                            {stats.recent.slice(0, 8).map((track, index) => (
                                <TrackCard key={track.id} track={track} index={index} />
                            ))}
                        </div>
                    </motion.section>
                )}
            </main>
        </div>
    );
}

function TrackCard({ track, index }: { track: Track; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative bg-gradient-to-b from-white/5 to-transparent p-4 rounded-2xl border border-white/5 hover:border-spotify/30 transition-all"
        >
            <div className="relative aspect-square rounded-xl overflow-hidden mb-4 shadow-xl">
                <img
                    src={track.image_url || "https://via.placeholder.com/300"}
                    alt={track.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <a
                    href={track.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 bg-spotify rounded-full p-3.5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-2xl hover:scale-110"
                >
                    <Play fill="black" size={20} className="text-black ml-0.5" />
                </a>
            </div>
            <h3 className="font-bold text-white truncate text-sm" title={track.name}>{track.name}</h3>
            <p className="text-xs text-gray-400 truncate mt-1">
                {track.artists?.join(', ') || 'Unknown Artist'}
            </p>
            <div className="absolute inset-0 rounded-2xl bg-spotify/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
        </motion.div>
    );
}

function AudioBar({ label, value, color, emoji }: { label: string; value: number; color: string; emoji: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 p-4 rounded-xl border border-white/10"
        >
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                    <span>{emoji}</span> {label}
                </span>
                <span className="text-sm font-bold text-white">{value}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${color} rounded-full`}
                />
            </div>
        </motion.div>
    );
}

