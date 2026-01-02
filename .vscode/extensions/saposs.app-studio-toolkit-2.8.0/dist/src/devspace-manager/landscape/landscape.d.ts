/// <reference types="node" />
import { LandscapeNode } from "../tree/treeItems";
export declare function clearAutoRefreshTimers(): void;
export declare function autoRefresh(refreshRate?: number, timeOut?: number): void;
export interface LandscapeInfo {
    name: string;
    url: string;
    isLoggedIn: boolean;
    default?: boolean;
}
export declare type LandscapeConfig = {
    url: string;
    default?: boolean;
};
export declare function getLanscapesConfig(): LandscapeConfig[];
export declare function updateLandscapesConfig(values: LandscapeConfig[]): Promise<void>;
export declare function getLandscapes(): Promise<LandscapeInfo[]>;
export declare function removeLandscape(landscapeName: string): Promise<void>;
export declare function cmdLoginToLandscape(node: LandscapeNode): Promise<void>;
export declare function getDefaultLandscape(): string;
export declare function clearDefaultLandscape(updateLandsConfig?: boolean): Promise<LandscapeConfig[]>;
export declare function setDefaultLandscape(landscape?: string): Promise<boolean>;
export declare const internal: {
    autoRefreshTimerArray: NodeJS.Timer[];
};
