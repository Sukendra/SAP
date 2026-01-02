"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASTelemetryClient = void 0;
const eventHeader_1 = require("./eventHeader");
const telemetryInit_1 = require("./telemetryInit");
const utils_1 = require("./utils");
const bas_utils_1 = require("../utils/bas-utils");
/**
 * Singelton class to send telemetry events to Azure Application Insights.
 */
class BASTelemetryClient {
    constructor(extensionName, extensionVersion) {
        this.appInsightsClient = (0, telemetryInit_1.getTelemetryClient)();
        this.extensionName = extensionName;
        this.extensionVersion = extensionVersion;
    }
    /**
     * @returns Consumer module name
     */
    getExtensionName() {
        return this.extensionName;
    }
    /**
     * @returns Consumer module version
     */
    getExtensionVersion() {
        return this.extensionVersion;
    }
    /**
     * Send a telemetry event to Azure Application Insights. The telemetry event sending is still non-blocking
     * in this API.
     *
     * @param eventName Categorize the type of the event within the scope of an extension.
     * @param properties A set of string properties to be reported
     * @param measurements  A set of numeric measurements to be reported
     */
    report(eventName, properties = {}, measurements = {}) {
        if ((0, utils_1.isTelemetryEnabled)(this.extensionName)) {
            const telementryEvent = this.prepareEvent(eventName, properties, measurements);
            this.appInsightsClient.trackEvent(telementryEvent);
        }
        return Promise.resolve();
    }
    /**
     * Provide specification of telemetry event to be sent.
     *
     * @param eventName Categorize the type of the event within the scope of an extension.
     * @param properties A set of string properties to be reported
     * @param measurements A set of numeric measurements to be reported
     * @returns telemetry event
     */
    prepareEvent(eventName, properties, measurements) {
        const eventHeader = new eventHeader_1.EventHeader(this.extensionName, eventName);
        // Automatically add additional properties to the event
        properties["iaas"] = (0, utils_1.getIAASParam)();
        properties["landscape"] = (0, utils_1.getDataCenterParam)();
        properties["is_sap_user"] = (0, utils_1.isSAPUser)();
        properties["bas_mode"] = (0, utils_1.getBASMode)();
        properties["extension_run_platform"] = (0, bas_utils_1.getExtensionRunPlatform)(this.extensionName);
        properties["extension_version"] = this.extensionVersion;
        properties["hashed_user"] = (0, utils_1.getHashedUser)();
        const event = {
            name: eventHeader.toString(),
            properties: properties,
            measurements: measurements,
        };
        return event;
    }
}
exports.BASTelemetryClient = BASTelemetryClient;
//# sourceMappingURL=basTelemetryClient.js.map