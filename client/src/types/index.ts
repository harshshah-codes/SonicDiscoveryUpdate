export interface User {
    display_name: string;
    images: { url: string }[];
    id: string;
}

export interface Track {
    id: string;
    name: string;
    artists: string[];
    image_url: string;
    external_url: string;
    preview_url?: string;
    release_date?: string;
}

export interface Artist {
    name: string;
    image_url: string;
    external_url: string;
}

export interface DashboardStats {
    top_genres: [string, number][];
    top_artists: Artist[];
    top_tracks: Track[];
    new_releases: Track[];
    recent: Track[];
}
