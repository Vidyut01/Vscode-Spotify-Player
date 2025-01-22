import axios from 'axios';
import * as vscode from 'vscode';
import { isAuthenticated, refreshAccessToken } from '../authenticate/auth';

let interval: NodeJS.Timeout;

export const displayCurrentSongDetails = async (
    context: vscode.ExtensionContext,
    statusBar: vscode.StatusBarItem[],
    songDataEmitter: vscode.EventEmitter<any>,
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
                clearInterval(interval);
                return;
            }
        }
        else {
            clearInterval(interval);
            return;
        }
    }

    const refreshDisplay = async () => {
        try {
            const res = await axios.get(
                `https://api.spotify.com/v1/me/player/currently-playing`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            
            if (res.status === 200 && res.data) {
                const name = res.data.item.name;
                const artist = res.data.item.artists.map((artist: any) => artist.name).join(', ');
        
                statusBar[0].text = `${name} - ${artist}`;
                statusBar[0].tooltip = `Current Playing: ${name} - ${artist}`
                statusBar[1].text = res.data.is_playing ? `$(debug-pause)` : `$(play)`;
                statusBar[1].tooltip = res.data.is_playing ? 'Pause Track' : 'Play Track';

                statusBar.forEach(e => e.show());

                const message = {
                    command: 'current_playing',
                    title: name,
                    artist,
                    image_url: res.data?.item?.album?.images[0].url,
                    id: res.data.item.id,
                    is_playing: res.data.is_playing
                };

                // Send message to frontend
                songDataEmitter.fire(message);
            }
            else {
                statusBar.forEach(e => e.hide());
                songDataEmitter.fire({ command: 'no_song' });
            }
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    if (!isRetry && await refreshAccessToken(context)) {
                        await displayCurrentSongDetails(context, statusBar, songDataEmitter, true);
                    }
                    else {
                        console.error("Invalid spotify access token");
                        clearInterval(interval);
                    }
                }
            }
        }
    };

    await refreshDisplay();
    clearInterval(interval);
    interval = setInterval(refreshDisplay, 5000);
};

export const stopDisplay = async (statusBar: vscode.StatusBarItem[], songDataEmitter: vscode.EventEmitter<any>) => {
    clearInterval(interval);
    statusBar.forEach(e => e.hide());
    songDataEmitter.fire({ command: 'no_song' });
};
