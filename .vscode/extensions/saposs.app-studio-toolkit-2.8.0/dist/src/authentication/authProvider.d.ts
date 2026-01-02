import { Disposable } from "vscode";
import type { AuthenticationProvider, AuthenticationProviderAuthenticationSessionsChangeEvent, AuthenticationSession, Event, SecretStorage } from "vscode";
import { JwtPayload } from "@sap-devx/app-studio-toolkit-types";
export declare class BasRemoteAuthenticationProvider implements AuthenticationProvider, Disposable {
    private readonly secretStorage;
    static id: string;
    private secretKey;
    private currentToken;
    private initializedDisposable;
    private _onDidChangeSessions;
    get onDidChangeSessions(): Event<AuthenticationProviderAuthenticationSessionsChangeEvent>;
    constructor(secretStorage: SecretStorage);
    dispose(): void;
    private ensureInitialized;
    private checkForUpdates;
    private cacheTokenFromStorage;
    private getTokenByScope;
    getSessions(_scopes?: string[]): Promise<readonly AuthenticationSession[]>;
    createSession(_scopes: string[]): Promise<AuthenticationSession>;
    removeSession(_sessionId: string): Promise<void>;
}
export declare class BasRemoteSession implements AuthenticationSession {
    readonly scopes: string[];
    readonly account: {
        id: string;
        label: string;
    };
    readonly id: string;
    readonly iasToken: string;
    readonly accessToken: string;
    /**
     * @param accessToken The personal access token to use for authentication
     */
    constructor(scopes: string[], accessToken: JwtPayload);
}
