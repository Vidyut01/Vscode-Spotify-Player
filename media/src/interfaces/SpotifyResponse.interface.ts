export interface SpotifyArtist {
    id: string;
    name: string;
};

export interface SpotifyAlbum {
    id: string;
    name: string;
    images: Array<{
        url: string;
        height: number | null;
        width: number | null;
    }>;
};

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: SpotifyArtist[];
    album: SpotifyAlbum;
    duration_ms: number;
};

export interface SpotifyPlaylist {
    id: string;
    name: string;
    images: Array<{
        url: string;
        height: number | null;
        width: number | null;
    }>;
    owner: {
        display_name: string | null;
    }
    tracks: {
        href: string;
        total: number;
    } | null;
};
