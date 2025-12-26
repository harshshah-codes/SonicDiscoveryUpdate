import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin, Cloud, Clock, Plane } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { TrackGrid } from '../components/TrackGrid';

const API_URL = 'https://sonicdiscoveryupdate.onrender.com';

interface Track {
    id: string;
    name: string;
    artists: string[];
    image_url: string;
    external_url: string;
}

const locations = [
    { name: "Tokyo", emoji: "🗼", vibe: "Neon-lit streets, anime vibes" },
    { name: "London", emoji: "🎡", vibe: "Indie pubs, rainy afternoons" },
    { name: "Paris", emoji: "🗼", vibe: "Romantic cafes, artistic soul" },
    { name: "NYC", emoji: "🗽", vibe: "Hip hop roots, jazz clubs" },
    { name: "Berlin", emoji: "🎧", vibe: "Underground techno, industrial" },
    { name: "Rio", emoji: "🏖️", vibe: "Carnival beats, bossa nova" },
];

const weatherOptions = [
    { name: "Rain", emoji: "🌧️", color: "from-blue-500" },
    { name: "Sunny", emoji: "☀️", color: "from-yellow-500" },
    { name: "Snow", emoji: "❄️", color: "from-cyan-300" },
    { name: "Cloudy", emoji: "☁️", color: "from-gray-400" },
];

const timeOptions = [
    { name: "Morning", emoji: "🌅", color: "to-orange-400" },
    { name: "Night", emoji: "🌃", color: "to-indigo-600" },
    { name: "Late Night", emoji: "🌙", color: "to-purple-900" },
];

export function VibeTeleporter() {
    const [location, setLocation] = useState("Tokyo");
    const [weather, setWeather] = useState("Rain");
    const [time, setTime] = useState("Night");
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasTeleported, setHasTeleported] = useState(false);

    const teleport = async () => {
        setLoading(true);
        const token = localStorage.getItem('spotify_token');

        try {
            const res = await axios.get(`${API_URL}/features/vibe`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { location, weather, time }
            });
            setTracks(res.data);
            setHasTeleported(true);
        } catch (err) {
            console.error('Failed to teleport:', err);
        } finally {
            setLoading(false);
        }
    };

    const currentLocation = locations.find(l => l.name === location);
    const currentWeather = weatherOptions.find(w => w.name === weather);
    const currentTime = timeOptions.find(t => t.name === time);

    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative mb-12 p-8 rounded-3xl bg-gradient-to-br ${currentWeather?.color} ${currentTime?.color}/20 border border-white/10 overflow-hidden`}
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">🔮</span>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                Vibe Teleporter
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-xl mb-8">
                            Generate a playlist based on a specific place, weather, and time of day.
                            Transport yourself anywhere in the world.
                        </p>

                        {/* Vibe Preview */}
                        <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <span className="text-5xl">{currentLocation?.emoji}</span>
                            <span className="text-4xl">{currentWeather?.emoji}</span>
                            <span className="text-4xl">{currentTime?.emoji}</span>
                            <div className="ml-4">
                                <h3 className="text-xl font-bold">{location} • {weather} • {time}</h3>
                                <p className="text-gray-400 text-sm">{currentLocation?.vibe}</p>
                            </div>
                        </div>

                        {/* Selectors Grid */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            {/* Location */}
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="text-pink-400" size={20} />
                                    <span className="font-semibold">Location</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {locations.map(loc => (
                                        <button
                                            key={loc.name}
                                            onClick={() => setLocation(loc.name)}
                                            className={`p-3 rounded-xl text-sm font-medium transition-all ${location === loc.name
                                                    ? 'bg-pink-500/30 border-pink-500 text-white border'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                                                }`}
                                        >
                                            {loc.emoji} {loc.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Weather */}
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Cloud className="text-cyan-400" size={20} />
                                    <span className="font-semibold">Weather</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {weatherOptions.map(w => (
                                        <button
                                            key={w.name}
                                            onClick={() => setWeather(w.name)}
                                            className={`p-3 rounded-xl text-sm font-medium transition-all ${weather === w.name
                                                    ? 'bg-cyan-500/30 border-cyan-500 text-white border'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                                                }`}
                                        >
                                            {w.emoji} {w.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time */}
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock className="text-purple-400" size={20} />
                                    <span className="font-semibold">Time of Day</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {timeOptions.map(t => (
                                        <button
                                            key={t.name}
                                            onClick={() => setTime(t.name)}
                                            className={`p-3 rounded-xl text-sm font-medium transition-all ${time === t.name
                                                    ? 'bg-purple-500/30 border-purple-500 text-white border'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                                                }`}
                                        >
                                            {t.emoji} {t.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <motion.button
                            onClick={teleport}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-full transition-all disabled:opacity-50 shadow-lg shadow-purple-500/25"
                        >
                            <Plane size={20} className={loading ? 'animate-bounce' : ''} />
                            {loading ? 'Teleporting...' : 'Teleport'}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Results */}
                {hasTeleported && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold mb-6">
                            {currentLocation?.emoji} {location} • {currentWeather?.emoji} {weather} • {currentTime?.emoji} {time}
                        </h2>
                        <TrackGrid tracks={tracks} loading={loading} />
                    </motion.div>
                )}
            </main>
        </div>
    );
}
