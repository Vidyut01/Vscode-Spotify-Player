import React from 'react'
import { SpotifyTrack } from '../../interfaces/SpotifyResponse.interface'
import { playSongPlaylist } from '../../messages';
import './styles.css';

const PlaylistSong = ({track, playlistId}: {
    track: SpotifyTrack,
    playlistId: string
}) => {
    const pickSong = () => {
        playSongPlaylist(track.id, playlistId);
    };

    return (
        <div className='song' onClick={pickSong}>
            <img src={track.album.images[0].url} alt='song cover' />
            <div>
                <p className="song-title">
                    {track.name}
                </p>
                <p className="song-artist">
                    {track.artists.map((artist) => artist.name).join(', ')}
                </p>
            </div>
        </div>
    )
}

export default PlaylistSong