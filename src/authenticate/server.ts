import http from 'http';
import * as vscode from 'vscode';
import { exchangeToken } from './auth';

export const startServer = (context: vscode.ExtensionContext) => {
    const server = http.createServer(async (req, res) => {
        if (req.url?.startsWith('/callback')) {
            const urlParams = new URLSearchParams(req.url.split('?')[1]);
            const code = urlParams.get('code');
            const gotstate = urlParams.get('state');

            const storedState = await context.secrets.get('oauth_state');
            if (gotstate !== storedState) {
                vscode.window.showErrorMessage("Authentification Failed");
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end('<h1>Authentication failed: State mismatch. You can close this window.</h1>');
                server.close();
                return;
            }

            await exchangeToken(code!, context);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
            <html>
            <head>
                <title>Authentication Successful</title>
            </head>
            <body>
                <p>You can close this window now</p>
                <script>
                    window.location.href = 'vscode://';
                </script>
            </body>
            </html>`);

            server.close();
        }
    });

    server.listen(43897, () => {
        console.log('Listening on port 43897');
    });
};
