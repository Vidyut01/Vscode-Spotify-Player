import * as vscode from 'vscode';
import { displayCurrentSongDetails } from '../commands/display';

export class SidePanelView implements vscode.WebviewViewProvider {
    public static readonly viewType = 'spotify-api-vscode.sidePanelView';
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri, private songDataEmitter: vscode.EventEmitter<any>) {
        this.songDataEmitter.event(this.handleSongDataEvent, this);
    }

    public reveal() {
        if (this._view) {
            this._view.show(true);
        }
    }

    private handleSongDataEvent(message: any) {
        if (this._view) {
            this._view.webview.postMessage(message);
        } else {
            console.error('No webview available to post message');
        }
    }

    public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): Thenable<void> | void {
        this._view = webviewView;
        console.log('Resolving Spoticode side panel view.');
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'media')]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        vscode.commands.executeCommand('spotify-api-vscode.sendConnectionInfo');

        webviewView.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'play_pause':
                    vscode.commands.executeCommand('spotify-api-vscode.playpause');
                    break;
                case 'next':
                    vscode.commands.executeCommand('spotify-api-vscode.next');
                    break;
                case 'prev':
                    vscode.commands.executeCommand('spotify-api-vscode.previous');
                    break;
                case 'search':
                    vscode.commands.executeCommand('spotify-api-vscode.search', message.searchTerm);
                    break;
                case 'getPlaylists':
                    vscode.commands.executeCommand('spotify-api-vscode.getplaylists');
                    break;
                case 'getPlaylistTracks':
                    vscode.commands.executeCommand('spotify-api-vscode.getplaylisttracks', message.playlistId);
                    break;
                case 'playSong':
                    vscode.commands.executeCommand('spotify-api-vscode.playSong', message.songId, message.albumId);
                    break;
                case 'playSongPlaylist':
                    vscode.commands.executeCommand('spotify-api-vscode.playSongPlaylist', message.songId, message.playlistId);
                    break;
                case 'connectAccount':
                    vscode.commands.executeCommand('spotify-api-vscode.connect');
                    break;
                case 'sendConnectStatus':
                    vscode.commands.executeCommand('spotify-api-vscode.sendConnectionInfo');
                    break;
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const nonce = getNonce();

        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'build', 'main.js')
        );

        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'build', 'main.css')
        );

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta
                http-equiv="Content-Security-Policy"
                content="default-src 'none'; 
                script-src 'nonce-${nonce}' ${webview.cspSource}; 
                style-src ${webview.cspSource}; 
                img-src ${webview.cspSource} blob: data: https://i.scdn.co https://mosaic.scdn.co https://p.scdn.co https://new.scdn.co https://lexicon-assets.spotifycdn.com https://wrapped-images.spotifycdn.com;">
            <title>Spoticode Panel</title>
            <link nonce="${nonce}" rel="stylesheet" href="${styleUri}">
        </head>
        <body>
            <div id="root"></div>
            <script nonce="${nonce}">
                const vscode = acquireVsCodeApi();
            </script>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>
        `;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
