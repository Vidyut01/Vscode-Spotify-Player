import React, { useEffect, useState, useRef } from 'react'
import './styles.css';
import { search } from '../../messages';
import { SpotifyTrack } from '../../interfaces/SpotifyResponse.interface';
import Scrollbars from 'react-custom-scrollbars-2';
import Song from '../Song';

const Search = () => {
    const [searchText, setSearchText] = useState('');
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);

    useEffect(() => {
        window.addEventListener('message', e => {
            const message = e.data;
            switch (message.command) {
                case 'search_results':
                    setTracks(message.results);
                    break;
            }
        });
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
          if (searchText.trim() === '') {
            setTracks([]);
            return;
          }
          search(searchText);
        }, 700);
      
        return () => {
          clearTimeout(handler);
        };
    }, [searchText]);
    
    return (
        <div className='search'>
            <div className='search-container'>
                <label htmlFor='searchbar'></label>
                <input
                    type='search'
                    id='serachbar'
                    className="search-input"
                    title='Search Bar'
                    placeholder='Enter Track Name'
                    onChange={e => setSearchText(e.target.value)}
                />
            </div>
            
            <>
            {tracks.length ?
            (
            <Scrollbars autoHide style={{ flexGrow: 1 }} >
                <div className='search-results'>
                    {tracks.map(track => <Song key={track.id} track={track}/> )}
                </div>
            </Scrollbars>
            ) :
            (
            <h3 className='nosearch'>Search For Songs</h3>
            ) 
            }
            </>
        </div>
    )
}

export default Search
