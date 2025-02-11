import axios from 'axios';
import * as vscode from 'vscode';
import { isAuthenticated, refreshAccessToken } from '../authenticate/auth';

export const playpause = async (context: vscode.ExtensionContext, isRetry: boolean = false) => {
    let access_token = await context.secrets.get('access_token');
    const refresh_token = await context.secrets.get('refresh_token');

    if (!(await isAuthenticated(context))) {
        if (refresh_token) {
            const refreshSuccessful = await refreshAccessToken(context);
            if (refreshSuccessful) {
                access_token = await context.secrets.get('access_token');
            }
            else {
                vscode.window.showErrorMessage('Error getting access token.', 'Reconnect Spotify Account')
                .then(selection => {
                    if (selection === 'Reconnect Spotify Account') {
                        vscode.commands.executeCommand('spotify-api-vscode.connect');
                    }
                });
                return;
            }
        }
        else {
            vscode.window.showErrorMessage('You need to connect to Spotify to use this feature.', 'Connect Spotify Account')
            .then(selection => {
                if (selection === 'Connect Spotify Account') {
                    vscode.commands.executeCommand('spotify-api-vscode.connect');
                }
            });
            return;
        }
    }

    try {
        const res = await axios.get(`https://api.spotify.com/v1/me/player`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        
        const stateChange = res.data.is_playing ? 'pause' : 'play';

        await axios.put(
            `https://api.spotify.com/v1/me/player/${stateChange}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                }
            }
        );
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                if (!isRetry && await refreshAccessToken(context)) {
                    await playpause(context, true);
                }
                else {
                    vscode.window.showErrorMessage("Invalid token", 'Reconnect to Spotify')
                        .then(s => {
                            if (s === 'Reconnect to Spotify') {
                                vscode.commands.executeCommand('spotify-api-vscode.connect');
                            }
                        });
                }
            }
            else if (err.response?.status === 404) {
                vscode.window.showErrorMessage("No active player found.");
            }
        }
    }
};

export const nextSong = async (context: vscode.ExtensionContext, isRetry: boolean = false) => {
    let access_token = await context.secrets.get('access_token');
    const refresh_token = await context.secrets.get('refresh_token');

    if (!(await isAuthenticated(context))) {
        if (refresh_token) {
            const refreshSuccessful = await refreshAccessToken(context);
            if (refreshSuccessful) {
                access_token = await context.secrets.get('access_token');
            }
            else {
                vscode.window.showErrorMessage('Error getting access token.', 'Reconnect Spotify Account')
                .then(selection => {
                    if (selection === 'Reconnect Spotify Account') {
                        vscode.commands.executeCommand('spotify-api-vscode.connect');
                    }
                });
                return;
            }
        }
        else {
            vscode.window.showErrorMessage('You need to connect to Spotify to use this feature.', 'Connect Spotify Account')
            .then(selection => {
                if (selection === 'Connect Spotify Account') {
                    vscode.commands.executeCommand('spotify-api-vscode.connect');
                }
            });
            return;
        }
    }

    try {
        await axios.post(
            `https://api.spotify.com/v1/me/player/next`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                }
            }
        );
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                if (!isRetry && await refreshAccessToken(context)) {
                    await nextSong(context, true);
                }
                else {
                    vscode.window.showErrorMessage("Invalid token", 'Reconnect to Spotify')
                        .then(s => {
                            if (s === 'Reconnect to Spotify') {
                                vscode.commands.executeCommand('spotify-api-vscode.connect');
                            }
                        });
                }
            }
            else if (err.response?.status === 404) {
                vscode.window.showErrorMessage("No active player found.");
            }
        }
    }
};

export const prevSong = async (context: vscode.ExtensionContext, isRetry: boolean = false) => {
    let access_token = await context.secrets.get('access_token');
    const refresh_token = await context.secrets.get('refresh_token');

    if (!(await isAuthenticated(context))) {
        if (refresh_token) {
            const refreshSuccessful = await refreshAccessToken(context);
            if (refreshSuccessful) {
                access_token = await context.secrets.get('access_token');
            }
            else {
                vscode.window.showErrorMessage('Error getting access token.', 'Reconnect Spotify Account')
                .then(selection => {
                    if (selection === 'Reconnect Spotify Account') {
                        vscode.commands.executeCommand('spotify-api-vscode.connect');
                    }
                });
                return;
            }
        }
        else {
            vscode.window.showErrorMessage('You need to connect to Spotify to use this feature.', 'Connect Spotify Account')
            .then(selection => {
                if (selection === 'Connect Spotify Account') {
                    vscode.commands.executeCommand('spotify-api-vscode.connect');
                }
            });
            return;
        }
    }

    try {
        const res = await axios.get(`https://api.spotify.com/v1/me/player`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        
        const { progress_ms } = res.data;

        if (progress_ms > 3000) {
            await axios.put(
                `https://api.spotify.com/v1/me/player/seek?position_ms=0`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }
            );
        }
        else {
            await axios.post(
                `https://api.spotify.com/v1/me/player/previous`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
        }
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                if (!isRetry && await refreshAccessToken(context)) {
                    await prevSong(context, true);
                }
                else {
                    vscode.window.showErrorMessage("Invalid token", 'Reconnect to Spotify')
                        .then(s => {
                            if (s === 'Reconnect to Spotify') {
                                vscode.commands.executeCommand('spotify-api-vscode.connect');
                            }
                        });
                }
            }
            else if (err.response?.status === 404) {
                vscode.window.showErrorMessage("No active player found.");
            }
        }
    }
};

export const toggleShuffle = async (context: vscode.ExtensionContext, isRetry: boolean = false) => {
    let access_token = await context.secrets.get('access_token');
    const refresh_token = await context.secrets.get('refresh_token');

    if (!(await isAuthenticated(context))) {
        if (refresh_token) {
            const refreshSuccessful = await refreshAccessToken(context);
            if (refreshSuccessful) {
                access_token = await context.secrets.get('access_token');
            }
            else {
                vscode.window.showErrorMessage('Error getting access token.', 'Reconnect Spotify Account')
                .then(selection => {
                    if (selection === 'Reconnect Spotify Account') {
                        vscode.commands.executeCommand('spotify-api-vscode.connect');
                    }
                });
                return;
            }
        }
        else {
            vscode.window.showErrorMessage('You need to connect to Spotify to use this feature.', 'Connect Spotify Account')
            .then(selection => {
                if (selection === 'Connect Spotify Account') {
                    vscode.commands.executeCommand('spotify-api-vscode.connect');
                }
            });
            return;
        }
    }

    try {
        const res = await axios.get(`https://api.spotify.com/v1/me/player`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        
        const stateChange = res.data.shuffle_state ? 'false' : 'true';

        await axios.put(
            `https://api.spotify.com/v1/me/player/shuffle?state=${stateChange}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                }
            }
        );        
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                if (!isRetry && await refreshAccessToken(context)) {
                    await prevSong(context, true);
                }
                else {
                    vscode.window.showErrorMessage("Invalid token", 'Reconnect to Spotify')
                        .then(s => {
                            if (s === 'Reconnect to Spotify') {
                                vscode.commands.executeCommand('spotify-api-vscode.connect');
                            }
                        });
                }
            }
            else if (err.response?.status === 404) {
                vscode.window.showErrorMessage("No active player found.");
            }
        }
    }
};

export const toggleRepeat = async (context: vscode.ExtensionContext, isRetry: boolean = false) => {
    let access_token = await context.secrets.get('access_token');
    const refresh_token = await context.secrets.get('refresh_token');

    if (!(await isAuthenticated(context))) {
        if (refresh_token) {
            const refreshSuccessful = await refreshAccessToken(context);
            if (refreshSuccessful) {
                access_token = await context.secrets.get('access_token');
            }
            else {
                vscode.window.showErrorMessage('Error getting access token.', 'Reconnect Spotify Account')
                .then(selection => {
                    if (selection === 'Reconnect Spotify Account') {
                        vscode.commands.executeCommand('spotify-api-vscode.connect');
                    }
                });
                return;
            }
        }
        else {
            vscode.window.showErrorMessage('You need to connect to Spotify to use this feature.', 'Connect Spotify Account')
            .then(selection => {
                if (selection === 'Connect Spotify Account') {
                    vscode.commands.executeCommand('spotify-api-vscode.connect');
                }
            });
            return;
        }
    }

    try {
        const res = await axios.get(`https://api.spotify.com/v1/me/player`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        
        let stateChange = 'off';
        if (res.data.repeat_state === 'off') {
            stateChange = 'context';
        }
        else if (res.data.repeat_state === 'context') {
            stateChange = 'track';
        }

        await axios.put(
            `https://api.spotify.com/v1/me/player/repeat?state=${stateChange}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                }
            }
        );
        
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                if (!isRetry && await refreshAccessToken(context)) {
                    await prevSong(context, true);
                }
                else {
                    vscode.window.showErrorMessage("Invalid token", 'Reconnect to Spotify')
                        .then(s => {
                            if (s === 'Reconnect to Spotify') {
                                vscode.commands.executeCommand('spotify-api-vscode.connect');
                            }
                        });
                }
            }
            else if (err.response?.status === 404) {
                vscode.window.showErrorMessage("No active player found.");
            }
        }
    }
};

export const playSong = async (songId: string, albumId: string, context: vscode.ExtensionContext, isRetry: boolean = false) => {
    let access_token = await context.secrets.get('access_token');
    const refresh_token = await context.secrets.get('refresh_token');

    if (!(await isAuthenticated(context))) {
        if (refresh_token) {
            const refreshSuccessful = await refreshAccessToken(context);
            if (refreshSuccessful) {
                access_token = await context.secrets.get('access_token');
            }
            else {
                vscode.window.showErrorMessage('Error getting access token.', 'Reconnect Spotify Account')
                .then(selection => {
                    if (selection === 'Reconnect Spotify Account') {
                        vscode.commands.executeCommand('spotify-api-vscode.connect');
                    }
                });
                return;
            }
        }
        else {
            vscode.window.showErrorMessage('You need to connect to Spotify to use this feature.', 'Connect Spotify Account')
            .then(selection => {
                if (selection === 'Connect Spotify Account') {
                    vscode.commands.executeCommand('spotify-api-vscode.connect');
                }
            });
            return;
        }
    }

    const body = albumId ? {
        context_uri: `spotify:album:${albumId}`,
        offset: {
            uri: `spotify:track:${songId}`
        }
    } : {
        uris: [`spotify:track:${songId}`]
    };

    try {
        await axios.put(`https://api.spotify.com/v1/me/player/play`, body, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        });
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                if (!isRetry && await refreshAccessToken(context)) {
                    await playSong(songId, albumId, context, true);
                }
                else {
                    vscode.window.showErrorMessage("Invalid token", 'Reconnect to Spotify')
                        .then(s => {
                            if (s === 'Reconnect to Spotify') {
                                vscode.commands.executeCommand('spotify-api-vscode.connect');
                            }
                        });
                }
            }
            else if (err.response?.status === 404) {
                vscode.window.showErrorMessage("No active player found.");
            }
        }
    }
};

export const playSongPlaylist = async (songId: string | null, playlistId: string, context: vscode.ExtensionContext, isRetry: boolean = false) => {
    let access_token = await context.secrets.get('access_token');
    const refresh_token = await context.secrets.get('refresh_token');

    if (!(await isAuthenticated(context))) {
        if (refresh_token) {
            const refreshSuccessful = await refreshAccessToken(context);
            if (refreshSuccessful) {
                access_token = await context.secrets.get('access_token');
            }
            else {
                vscode.window.showErrorMessage('Error getting access token.', 'Reconnect Spotify Account')
                .then(selection => {
                    if (selection === 'Reconnect Spotify Account') {
                        vscode.commands.executeCommand('spotify-api-vscode.connect');
                    }
                });
                return;
            }
        }
        else {
            vscode.window.showErrorMessage('You need to connect to Spotify to use this feature.', 'Connect Spotify Account')
            .then(selection => {
                if (selection === 'Connect Spotify Account') {
                    vscode.commands.executeCommand('spotify-api-vscode.connect');
                }
            });
            return;
        }
    }

    const body = songId ? {
        context_uri: `spotify:playlist:${playlistId}`,
        offset: {
            uri: `spotify:track:${songId}`
        }
    } : {
        context_uri: `spotify:playlist:${playlistId}`
    };

    try {
        await axios.put(`https://api.spotify.com/v1/me/player/play`, body, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            }
        });
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                if (!isRetry && await refreshAccessToken(context)) {
                    await playSongPlaylist(songId, playlistId, context, true);
                }
                else {
                    vscode.window.showErrorMessage("Invalid token", 'Reconnect to Spotify')
                        .then(s => {
                            if (s === 'Reconnect to Spotify') {
                                vscode.commands.executeCommand('spotify-api-vscode.connect');
                            }
                        });
                }
            }
            else if (err.response?.status === 404) {
                vscode.window.showErrorMessage("No active player found.");
            }
        }
    }
};
