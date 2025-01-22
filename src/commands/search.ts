import axios from 'axios';
import * as vscode from 'vscode';
import { isAuthenticated, refreshAccessToken } from '../authenticate/auth';

export const search = async (
    searchParam: string,
    context: vscode.ExtensionContext,
    isRetry: boolean = false
) => {
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
        const res = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            params: {
                q: searchParam,
                type: 'track',
                limit: 30
            }
        });

        return res.data.tracks.items;
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                if (!isRetry && await refreshAccessToken(context)) {
                    await search(searchParam, context, true);
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
        }
    }
};

export const getPlaylists = async (
    context: vscode.ExtensionContext,
    isRetry: boolean = false
) => {
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
        const res = await axios.get(`https://api.spotify.com/v1/me/playlists`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        return res.data.items;
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                if (!isRetry && await refreshAccessToken(context)) {
                    await getPlaylists(context, true);
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
        }
    }
};

export const getPlaylistTracks = async (
    playlistId: string,
    context: vscode.ExtensionContext,
    isRetry: boolean = false
) => {
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
        const res = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        return res.data.items.map((item: any) => item.track);
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                if (!isRetry && await refreshAccessToken(context)) {
                    await getPlaylistTracks(playlistId, context, true);
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
        }
    }
};
