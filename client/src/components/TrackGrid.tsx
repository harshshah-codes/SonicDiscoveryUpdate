import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface Track {
    id: string;
    name: string;
    artists: string[];
    image_url: string;
    external_url: string;
    preview_url?: string;
}

interface TrackGridProps {
    tracks: Track[];
    loading?: boolean;
    emptyMessage?: string;
}

export function TrackGrid({ tracks, loading, emptyMessage = "No tracks found" }: TrackGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-square bg-white/5 rounded-xl mb-4" />
                        <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-white/5 rounded w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (!tracks || tracks.length === 0) {
        return (
            <div className="text-center py-16 text-gray-400">
                <p className="text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {tracks.map((track, index) => (
                <motion.div
                    key={track.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative bg-gradient-to-b from-white/5 to-transparent p-4 rounded-2xl border border-white/5 hover:border-spotify/30 transition-all duration-300"
                >
                    {/* Album Art */}
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4 shadow-xl">
                        <img
                            src={track.image_url || "https://via.placeholder.com/300"}
                            alt={track.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Play Button */}
                        <a
                            href={track.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-3 right-3 bg-spotify rounded-full p-3.5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-2xl hover:scale-110 hover:bg-spotify-light"
                        >
                            <Play fill="black" size={20} className="text-black ml-0.5" />
                        </a>
                    </div>

                    {/* Track Info */}
                    <h3 className="font-bold text-white truncate text-sm md:text-base" title={track.name}>
                        {track.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 truncate mt-1">
                        {track.artists?.join(', ') || 'Unknown Artist'}
                    </p>

                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-spotify/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
                </motion.div>
            ))}
        </div>
    );
}
