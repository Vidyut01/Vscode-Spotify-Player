import React from 'react'
import { SpotifyPlaylist } from '../../interfaces/SpotifyResponse.interface';
import { HiArrowRight } from "react-icons/hi2";

const Playlist = ({playlist, setCurrView}: {
    playlist: SpotifyPlaylist,
    setCurrView: React.Dispatch<React.SetStateAction<SpotifyPlaylist | null>>
}) => {
    return (
        <div className='playlist-item' onClick={() => setCurrView(playlist)}>
            <img src={playlist.images[0].url} alt='playlist cover' />
            <div>
                <p className="playlist-name">
                    {playlist.name}
                </p>
                <p className="playlist-owner">
                    {playlist.owner.display_name || ''}
                </p>
            </div>
            <HiArrowRight size={20} className='arrow-icon' />
        </div>
    )
}

export default Playlist