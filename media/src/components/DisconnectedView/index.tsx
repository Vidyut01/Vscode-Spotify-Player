import React from 'react'
import './styles.css';
import { connectAccount } from '../../messages';

const DisconnectedView = () => {
    const handleConnect = () => {
        connectAccount();
    };

    return (
        <div className='disconnected'>
        <h2>Sign In with Spotify Account</h2>
        <p>Access and control music seamlessly.</p>
        <span
            className='connect-spotify'
            onClick={handleConnect}
        >
            Connect Spotify Account
        </span>
        </div>
    )
}

export default DisconnectedView