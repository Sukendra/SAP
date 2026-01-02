import { JwtPayload } from "@sap-devx/app-studio-toolkit-types";
export declare const JWT_TIMEOUT: number;
export declare function retrieveJwt(landscapeUrl: string): Promise<JwtPayload | void>;
export declare function getJwt(landscapeUrl: string, isIasjwt?: boolean): Promise<string>;
export declare function hasJwt(landscapeUrl: string, isIasjwt?: boolean): Promise<boolean>;
