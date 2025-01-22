import React, { useContext, useEffect, useRef, useState } from 'react'
import './styles.css'
import { IoPause, IoPlay, IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import { sendNext, sendPlayPause, sendPrev } from '../../messages';
import ColorThief from 'colorthief';
import { CurrentSongContext } from '../../contexts/CurrentSongContext';

const Player = () => {
    const [title, setTitle] = useState<string | null>(null);
    const [artist, setArtist] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [is_playing, setIsPlaying] = useState(false);

    const colorthief = new ColorThief();
    const [color, setColor] = useState<[number, number, number]>([0, 0, 0]);

    const imgRef = useRef<HTMLImageElement>(null);

    const { currSong, setCurrSong } = useContext(CurrentSongContext);

    useEffect(() => {
        const state = vscode.getState();
        if (state) {
          setTitle(state.title || null);
          setArtist(state.artist || null);
          setIsPlaying(state.is_playing || false);
          setCurrSong?.(state.id || null);
          setImageUrl(state.image_url || null);
        }

        window.addEventListener('message', e => {
            const message = e.data;
            switch (message.command) {
                case 'current_playing':
                    updatePlayerDetails(message.title, message.artist, message.image_url, message.is_playing, message.id);
                    break;
                case 'no_song':
                    resetPlayer();
                    break;
            }
        });
    }, []);
    
    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;
        if (img.complete) {
            setColor(colorthief.getColor(img)!);
        }
        else {
            img.addEventListener('load', () => {
                setColor(colorthief.getColor(img)!);
            });
        }
    }, [imageUrl]);

    function updatePlayerDetails(title: string, artist: string, image_url: string, is_playing: boolean, id: string) {
        setTitle(title);
        setArtist(artist);
        setImageUrl(image_url);
        setCurrSong?.(id || null);
        setIsPlaying(is_playing);

        vscode.setState({ title, artist, is_playing, image_url, id });
    }

    function resetPlayer() {
        setTitle(null);
        setArtist(null);
        setImageUrl(null);
        setCurrSong?.(null);
        setIsPlaying(false);
        
        vscode.setState(null);
    }

    if (!currSong || !title || !artist) return null;

    return (
        <div
            className='player'
            style={{
                '--bg-color-r': color[0],
                '--bg-color-g': color[1],
                '--bg-color-b': color[2],
            } as React.CSSProperties}
        >
            <img ref={imgRef} id='cover-image' src={imageUrl!} alt='current song' crossOrigin="anonymous"/>
            <div className='options'>
                <div className='long-text'>
                    <h2 className='title elipsis-text' title={title}>{title}</h2>
                </div>
                <div className="long-text">
                    <h3 className='artist elipsis-text' title={artist}>{artist}</h3>
                </div>
                <div className='buttons'>
                    <div className='playback-buttons' onClick={sendPrev}><IoPlaySkipBack size={25}/></div>
                    <div  className='playback-buttons' onClick={sendPlayPause}>{is_playing ? <IoPause size={25} /> : <IoPlay size={25} />}</div>
                    <div  className='playback-buttons' onClick={sendNext}><IoPlaySkipForward size={25}/></div>
                </div>
            </div>
        </div>
    )
}

export default Player