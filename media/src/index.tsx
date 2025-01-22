import React, { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import './styles.css';
import Player from './components/Player';
import Search from './components/Search';
import { CurrentSongContext } from './contexts/CurrentSongContext';
import DisconnectedView from './components/DisconnectedView';
import Playlists from './components/Playlists';

type options = 'search' | 'playlist';

const App: React.FC = () => {
    const [disconnected, setDisconnected] = useState<boolean | undefined>(undefined);
    const [currSong, setCurrSong] = useState<string | null>(null);
    const [option, setOption] = useState<options>('search');

    useEffect(() => {
        window.addEventListener('message', e => {
            const message = e.data;
            switch (message.command) {
                case 'connected':
                    setDisconnected(false);
                    break;
                case 'disconnected':
                    setDisconnected(true);
                    vscode.setState(null);
                    setCurrSong(null);
                    break;
            }
        });
    }, []);

    if (disconnected === undefined) {
        vscode.postMessage({ command: 'sendConnectStatus' });
        return null;
    }

    return (
        <div className='main'>
            {disconnected ? (
                <DisconnectedView />
            ) : (
                <CurrentSongContext.Provider value={{ currSong, setCurrSong }}>
                    <div className='options-list'>
                        <span className={`search-option ${option === 'search' && 'selected'}`} onClick={() => setOption('search')}>Search</span>
                        <span className={`playlist-option ${option === 'playlist' && 'selected'}`} onClick={() => setOption('playlist')}>Playlists</span>
                    </div>
                    <div className='content'>
                        {option === 'search' ?
                        <Search /> :
                        <Playlists />}
                    </div>
                    <Player />
                </CurrentSongContext.Provider>
            )}
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
