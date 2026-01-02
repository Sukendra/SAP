import { devspace } from "@sap/bas-sdk";
/**
 * Helper function to detect if env var is provided before returning it.
 *
 * @param name Environment variable name
 * @returns Environment variable value
 */
export declare function getProcessEnv(name: string): string;
export declare function isSAPUser(): string;
export declare function getIAASParam(): string;
export declare function getDataCenterParam(): string;
export declare function getHashedUser(): string;
export declare function getBASMode(): devspace.BasMode;
export declare function isTelemetryEnabled(extensionName: string): boolean;
