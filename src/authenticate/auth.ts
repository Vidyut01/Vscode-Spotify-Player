import { genCodeChallenge, genCodeVerifier } from "./codeGen";
import * as vscode from 'vscode';
import axios from "axios";
import crypto from 'crypto';

const redirect_uri = 'http://localhost:43897/callback';
const scope = 'user-read-playback-state user-modify-playback-state user-library-read playlist-read-private';

export const initAuth = async (context: vscode.ExtensionContext) => {
    const client_id = vscode.workspace.getConfiguration('spotifyControl').get<string>('clientId');
    if (!client_id) {
      vscode.window.showErrorMessage('Spotify Client ID is not set. Please configure it in the extension settings.', 'Open Settings')
            .then(selection => {
                if (selection === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'spotifyControl.clientId');
                }
            });
            return;
    }

    const code_verifier = genCodeVerifier();
    const code_challenge = genCodeChallenge(code_verifier);

    context.secrets.store('code_verifier', code_verifier);

    const state = crypto.randomBytes(16).toString('hex');
    await context.secrets.store('oauth_state', state);

    const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
        client_id,
        response_type: 'code',
        redirect_uri,
        code_challenge_method: 'S256',
        code_challenge,
        scope,
        state,
    }).toString()}`;

    vscode.env.openExternal(vscode.Uri.parse(authUrl));
};

export const exchangeToken = async (code: string, context: vscode.ExtensionContext) => {
    const client_id = vscode.workspace.getConfiguration('spotifyControl').get<string>('clientId');
    if (!client_id) {
        vscode.window.showErrorMessage('Spotify Client ID is not set. Please configure it in the extension settings.', 'Open Settings')
            .then(selection => {
                if (selection === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'spotifyControl.clientId');
                }
            });
            return;
    }

    const code_verifier: string = (await context.secrets.get('code_verifier'))!;

    try {
        const res = await axios.post(
            `https://accounts.spotify.com/api/token`,
            new URLSearchParams({
                client_id,
                grant_type: 'authorization_code',
                code,
                redirect_uri,
                code_verifier,
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );

        const { access_token, refresh_token } = res.data;

        await context.secrets.store('access_token', access_token);
        await context.secrets.store('refresh_token', refresh_token);

        vscode.window.showInformationMessage('Successfully connect to spotify!');
        vscode.commands.executeCommand('spotify-api-vscode.startCallInterval');
    }
    catch (err) {
        console.error('Exchange failed');
        vscode.window.showErrorMessage('Authentification failed');
    }
};

export const refreshAccessToken = async (context: vscode.ExtensionContext) => {
    const client_id = vscode.workspace.getConfiguration('spotifyControl').get<string>('clientId');
    if (!client_id) {
        vscode.window.showErrorMessage('Spotify Client ID is not set. Please configure it in the extension settings.', 'Open Settings')
            .then(selection => {
                if (selection === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'spotifyControl.clientId');
                }
            });
            return;
    }

    const refresh_token: string = (await context.secrets.get('refresh_token'))!;
  
    try {
      const res = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
        client_id,
        grant_type: 'refresh_token',
        refresh_token,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const { access_token, refresh_token: new_refresh_token } = res.data;

      context.secrets.store('access_token', access_token);
      context.secrets.store('refresh_token', new_refresh_token);
  
      console.log('Access token refreshed');
      vscode.commands.executeCommand('spotify-api-vscode.startCallInterval');
      return true;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Failed to refresh access token:', error.response?.data || error.message);
        } else {
            console.error('Failed to refresh access token:', error);
        }
        
      return false;
    }
};

export const disconnect = async (context: vscode.ExtensionContext) => {
    try {
        await context.secrets.delete('access_token');
        await context.secrets.delete('refresh_token');

        vscode.commands.executeCommand('spotify-api-vscode.stopInterval');

        vscode.window.showInformationMessage('You have been disconnect from Spotify.');
    }
    catch (error) {
        console.error('Failed to disconnect:', error);
        vscode.window.showErrorMessage('An error occurred while disconnecting.');
    }
};

export const isAuthenticated = async (context: vscode.ExtensionContext) => {
    const accessToken = await context.secrets.get('access_token');
    return !!accessToken;
};
