import { ITelemetryReporter } from "@sap-devx/app-studio-toolkit-types";
export declare class BASClientFactory {
    private static basTelemetryClientsMap;
    static getBASTelemetryClient(extensionId: string, extensionVersion: string): ITelemetryReporter;
}
