import React, { useEffect, useState } from 'react'
import { SpotifyPlaylist, SpotifyTrack } from '../../interfaces/SpotifyResponse.interface'
import { getPlaylistTracks, playSongPlaylist } from '../../messages';
import Scrollbars from 'react-custom-scrollbars-2';
import { HiArrowLeft } from 'react-icons/hi2';
import { FaPlay } from 'react-icons/fa';
import PlaylistSong from '../Song/PlaylistSong';

const SonglistView = ({playlist, setCurrView}: {
    playlist: SpotifyPlaylist,
    setCurrView: React.Dispatch<React.SetStateAction<SpotifyPlaylist | null>>
}) => {
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);

    useEffect(() => {
        window.addEventListener('message', e => {
            const message = e.data;
            switch (message.command) {
                case 'playlistTracks':
                    setTracks(message.results);
                    break;
            }
        });

        getPlaylistTracks(playlist.id);
    }, []);

    const playPlaylist = () => {
        playSongPlaylist(null, playlist.id)
    };

    return (
        <>
        <div className='top-container'>
            <div className="top-section">
                <HiArrowLeft className="back-arrow" size={20} onClick={() => setCurrView(null)} />
                <img src={playlist.images[0].url} alt='playlist cover' />
                <div>
                    <h2>{playlist.name}</h2>
                    <h3>{playlist.owner.display_name}</h3>
                </div>
            </div>
            <div className="button-container">
                <span className="play-button" onClick={playPlaylist}>
                    <FaPlay size={16} />
                </span>
            </div>
        </div>
        <div className='playlists specific-playlist-items'>
            {tracks.length ?
            (
            <div className='playlist-items'>
                {tracks.map(track => <PlaylistSong track={track} playlistId={playlist.id} />)}
            </div>
            ) :
            (
            <h3 className='noplaylists'>No Tracks in Playlist</h3>
            ) 
            }
        </div>
        </>
    )
}

export default SonglistView