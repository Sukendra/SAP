import { SshClientSession } from "@microsoft/dev-tunnels-ssh";
export declare function closeSessions(sessions?: string[]): void;
export declare function ssh(opts: {
    host: {
        url: string;
        port: string;
    };
    client: {
        port: string;
    };
    username: string;
    jwt: string;
}): Promise<void>;
export declare const internal: {
    sessionMap: Map<string, SshClientSession>;
};
