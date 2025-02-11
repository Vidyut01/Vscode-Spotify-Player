import * as vscode from 'vscode';
import { startServer } from './authenticate/server';
import { disconnect, initAuth, isAuthenticated } from './authenticate/auth';
import { nextSong, playpause, playSong, playSongPlaylist, prevSong, toggleRepeat, toggleShuffle } from './commands/player';
import { displayCurrentSongDetails, stopDisplay } from './commands/display';
import { SidePanelView } from './webviews/sidePanel';
import { getPlaylists, getPlaylistTracks, search } from './commands/search';

const songDataEmitter = new vscode.EventEmitter<any>();

export function activate(context: vscode.ExtensionContext) {
	// Status Bar content
	const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	const prevButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
	const playPauseButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
	const nextButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 97);

	// Public Commands
	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.connect', async () => {
			startServer(context);
			await initAuth(context);
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.playpause', async () => {
			await playpause(context);
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.next', async () => {
			await nextSong(context);
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.previous', async () => {
			await prevSong(context);
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.toggleshuffle', async () => {
			await toggleShuffle(context);
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.setrepeat', async () => {
			await toggleRepeat(context);
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.focus', async () => {
			provider.reveal();
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.disconnect', async () => {
			await disconnect(context);
			songDataEmitter.fire({ command: 'disconnected' });
	}));
	
	// Status bar updates
	prevButton.text = `$(chevron-left)`;
	prevButton.tooltip = 'Previous Track';
	prevButton.command = 'spotify-api-vscode.previous';

	nextButton.text = `$(chevron-right)`;
	nextButton.tooltip = 'Next Track';
	nextButton.command = 'spotify-api-vscode.next';

	playPauseButton.command = 'spotify-api-vscode.playpause';

	statusBar.command = 'spotify-api-vscode.focus';
	
	displayCurrentSongDetails(context, [statusBar, playPauseButton, prevButton, nextButton], songDataEmitter);
	context.subscriptions.push(statusBar);
	context.subscriptions.push(prevButton);
	context.subscriptions.push(playPauseButton);
	context.subscriptions.push(nextButton);

	// Side Panel Webview
	const provider = new SidePanelView(context.extensionUri, songDataEmitter);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			SidePanelView.viewType,
			provider
		)
	);

	// Internal Commands
	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.loadDetails', async () => {
			displayCurrentSongDetails(context, [statusBar, playPauseButton, prevButton, nextButton], songDataEmitter);
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.playSong', async (songId: string, albumId: string) => {
			await playSong(songId, albumId, context);
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.playSongPlaylist', async (songId: string | null, playlistId: string) => {
			await playSongPlaylist(songId, playlistId, context);
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.startCallInterval', async () => {
			songDataEmitter.fire({ command: 'connected' });
			displayCurrentSongDetails(context, [statusBar, playPauseButton, prevButton, nextButton], songDataEmitter);
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.stopInterval', async () => {
			stopDisplay([statusBar, playPauseButton, prevButton, nextButton], songDataEmitter);
			songDataEmitter.fire({ command: 'disconnected' });
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.search', async (searchTerm: string) => {
			const results = await search(searchTerm, context);
			songDataEmitter.fire({
				command: 'search_results',
				results
			});
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.getplaylists', async () => {
			const results = await getPlaylists(context);
			songDataEmitter.fire({
				command: 'playlists',
				results
			});
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.getplaylisttracks', async (playlistId: string) => {
			const results = await getPlaylistTracks(playlistId, context);
			songDataEmitter.fire({
				command: 'playlistTracks',
				results
			});
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('spotify-api-vscode.sendConnectionInfo', async () => {
			if (await isAuthenticated(context)) {
				songDataEmitter.fire({ command: 'connected' });
				vscode.commands.executeCommand('spotify-api-vscode.loadDetails');
			}
			else {
				songDataEmitter.fire({ command: 'disconnected' });
			}
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}
