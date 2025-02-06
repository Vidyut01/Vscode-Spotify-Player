import React, { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { SpotifyPlaylist } from '../../interfaces/SpotifyResponse.interface';
import { getPlaylists } from '../../messages';
import Playlist from './Playlist';
import './styles.css';
import SonglistView from './SonglistView';

const Playlists = () => {
    const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
    const [currView, setCurrView] = useState<SpotifyPlaylist | null>(null);

    useEffect(() => {
        window.addEventListener('message', e => {
            const message = e.data;
            switch (message.command) {
                case 'playlists':
                    setPlaylists(message.results);
                    break;
            }
        });

        getPlaylists();
    }, []);

    useEffect(() => {
        console.log(playlists);
    }, [playlists]);

    return (
        <div className='playlists'>
            {playlists.length ?
            (
            <>
            <Scrollbars autoHide style={{ flexGrow: 1 }} >
                {!currView ? <div className='playlist-items'>
                    {playlists.map(playlist => <Playlist playlist={playlist} setCurrView={setCurrView} />)}
                </div> :
                <SonglistView playlist={currView} setCurrView={setCurrView} />}
            </Scrollbars>
            </>
            ) :
            (
            <h3 className='noplaylists'>Add playlists to appear here</h3>
            ) 
            }
        </div>
    )
}

export default Playlists