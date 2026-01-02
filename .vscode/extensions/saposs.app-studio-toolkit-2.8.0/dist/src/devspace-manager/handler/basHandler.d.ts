import { EventEmitter } from "vscode";
import type { UriHandler } from "vscode";
import { DevSpaceDataProvider } from "../tree/devSpacesProvider";
import { JwtPayload } from "@sap-devx/app-studio-toolkit-types";
export interface LoginEvent extends Partial<JwtPayload> {
}
export declare const eventEmitter: EventEmitter<LoginEvent>;
export declare function getBasUriHandler(devSpacesProvider: DevSpaceDataProvider): UriHandler;
