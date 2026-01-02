export declare enum ExtensionRunMode {
    desktop = "desktop",
    basRemote = "bas-remote",
    basWorkspace = "bas-workspace",
    basUi = "bas-ui",
    wsl = "wsl",
    unexpected = "unexpected"
}
export declare function shouldRunCtlServer(): boolean;
export declare function getExtensionRunPlatform(extensionName?: string): ExtensionRunMode;
declare function formatTimeRemaining(seconds: number): string;
declare function askToSessionExtend(): Promise<boolean>;
export declare function startBasKeepAlive(): void;
export declare function cleanKeepAliveInterval(): void;
export declare const internal: {
    askToSessionExtend: typeof askToSessionExtend;
    formatTimeRemaining: typeof formatTimeRemaining;
};
export {};
