"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTelemetryClient = exports.getTelemetryClient = void 0;
const applicationinsights_1 = require("applicationinsights");
const constants_1 = require("./constants");
let telemetryClient = null;
function getTelemetryClient() {
    if (!telemetryClient) {
        (0, applicationinsights_1.setup)(constants_1.APPINSIGHTS_CONNECTION_STRING);
        // Configure sample rate. 100 is the default and means all collected data will be sent to the Application Insights service
        // If you want to enable sampling to reduce the amount of data, set the samplingPercentage. 0 means nothing will be sent.
        applicationinsights_1.defaultClient.config.samplingPercentage = 100;
        // Disable GDPR private data that are collected by Azure AppInsight client.
        applicationinsights_1.defaultClient.addTelemetryProcessor((envelope) => {
            envelope.tags["ai.location.ip"] = "0.0.0.0";
            envelope.tags["ai.cloud.roleInstance"] = "masked";
            envelope.tags["ai.cloud.role"] = "masked";
            envelope.tags["ai.cloud.roleVer"] = "masked";
            envelope.tags["ai.device.type"] = "masked";
            return true;
        });
        telemetryClient = applicationinsights_1.defaultClient;
    }
    return telemetryClient;
}
exports.getTelemetryClient = getTelemetryClient;
// For testing purpose
function setTelemetryClient(client) {
    telemetryClient = client;
}
exports.setTelemetryClient = setTelemetryClient;
//# sourceMappingURL=telemetryInit.js.map