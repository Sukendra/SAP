import { TelemetryProperties, TelemetryMeasurements } from "@sap-devx/app-studio-toolkit-types";
/**
 * Singelton class to send telemetry events to Azure Application Insights.
 */
export declare class BASTelemetryClient {
    private extensionName;
    private extensionVersion;
    private appInsightsClient;
    constructor(extensionName: string, extensionVersion: string);
    /**
     * @returns Consumer module name
     */
    getExtensionName(): string;
    /**
     * @returns Consumer module version
     */
    getExtensionVersion(): string;
    /**
     * Send a telemetry event to Azure Application Insights. The telemetry event sending is still non-blocking
     * in this API.
     *
     * @param eventName Categorize the type of the event within the scope of an extension.
     * @param properties A set of string properties to be reported
     * @param measurements  A set of numeric measurements to be reported
     */
    report(eventName: string, properties?: TelemetryProperties, measurements?: TelemetryMeasurements): Promise<void>;
    /**
     * Provide specification of telemetry event to be sent.
     *
     * @param eventName Categorize the type of the event within the scope of an extension.
     * @param properties A set of string properties to be reported
     * @param measurements A set of numeric measurements to be reported
     * @returns telemetry event
     */
    private prepareEvent;
}
