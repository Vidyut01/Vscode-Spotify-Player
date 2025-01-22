interface VscodeAPI {
    postMessage(message: any): void;
    setState: (state: any) => void;
    getState: () => any;
}

declare const vscode: VscodeAPI;
