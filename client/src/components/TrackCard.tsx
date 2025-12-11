import { Play } from 'lucide-react';
import type { Track } from '../types';

export const TrackCard = ({ track }: { track: Track }) => {
    return (
        <div className="group relative bg-card hover:bg-card-hover p-4 rounded-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                <img
                    src={track.image_url}
                    alt={track.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <a
                    href={track.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 bg-spotify rounded-full p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-lg hover:scale-110"
                >
                    <Play fill="black" size={20} className="text-black ml-1" />
                </a>
            </div>

            <h3 className="font-bold text-white truncate" title={track.name}>{track.name}</h3>
            <p className="text-sm text-gray-400 truncate mt-1">
                {track.artists.join(', ')}
            </p>
            {track.release_date && (
                <p className="text-xs text-gray-600 mt-1">{track.release_date}</p>
            )}
        </div>
    );
};
