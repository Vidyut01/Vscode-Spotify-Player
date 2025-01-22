export const sendPlayPause = () => 
    vscode.postMessage({ command: 'play_pause' });

export const sendNext = () => 
    vscode.postMessage({ command: 'next' });

export const sendPrev = () => 
    vscode.postMessage({ command: 'prev' });

export const search = (searchTerm: string) => 
    vscode.postMessage({ command: 'search', searchTerm });

export const getPlaylists = () => 
    vscode.postMessage({ command: 'getPlaylists' });

export const getPlaylistTracks = (playlistId: string) => 
    vscode.postMessage({ command: 'getPlaylistTracks', playlistId });

export const playSong = (songId: string, albumId?: string) =>
    vscode.postMessage({
        command: 'playSong',
        songId,
        albumId
    });

export const playSongPlaylist = (songId: string | null, playlistId?: string) =>
    vscode.postMessage({
        command: 'playSongPlaylist',
        songId,
        playlistId
    });

export const connectAccount = () => 
    vscode.postMessage({ command: 'connectAccount' });
