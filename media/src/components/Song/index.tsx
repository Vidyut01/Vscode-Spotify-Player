import React, { useContext } from 'react'
import { SpotifyTrack } from '../../interfaces/SpotifyResponse.interface'
import { playSong } from '../../messages';
import { CurrentSongContext } from '../../contexts/CurrentSongContext';
import './styles.css';

const Song = ({track}: {
    track: SpotifyTrack,
}) => {
    const { currSong } = useContext(CurrentSongContext);

    const pickSong = () => {
        if (currSong && currSong === track.id) return;
        playSong(track.id, track.album.id);
    };

    return (
        <div className='song' onClick={pickSong}>
            <img src={track.album.images[0].url} alt='song cover' />
            <div>
                {currSong && currSong === track.id && <p className='curr-playing'>Playing!</p>}
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

export default Song