"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const appInsights = __importStar(require("applicationinsights"));
const basTelemetryClient_1 = require("../../src/telemetry/basTelemetryClient");
const utils = __importStar(require("../../src/telemetry/utils"));
const telemetryInit = __importStar(require("../../src/telemetry/telemetryInit"));
const constants_1 = require("../../src/telemetry/constants");
const basUtils = __importStar(require("../../src/utils/bas-utils"));
describe("BASTelemetryClient", function () {
    let telemetryClient, mockAppInsightsClient, isTelemetryEnabledStub;
    beforeEach(function () {
        mockAppInsightsClient = {
            trackEvent: sinon_1.default.spy(),
        };
        sinon_1.default.stub(appInsights, "TelemetryClient").returns(mockAppInsightsClient);
        isTelemetryEnabledStub = sinon_1.default
            .stub(utils, "isTelemetryEnabled")
            .returns(true);
        sinon_1.default.stub(utils, "getIAASParam").returns("mockIAAS");
        sinon_1.default.stub(utils, "getDataCenterParam").returns("mockDataCenter");
        sinon_1.default.stub(utils, "isSAPUser").returns("true");
        sinon_1.default.stub(utils, "getBASMode").returns("standard");
        sinon_1.default.stub(utils, "getHashedUser").returns("mockHashedUser");
        sinon_1.default
            .stub(telemetryInit, "getTelemetryClient")
            .returns(mockAppInsightsClient);
        sinon_1.default
            .stub(basUtils, "getExtensionRunPlatform")
            .returns(constants_1.ExtensionRunMode.desktop);
        telemetryClient = new basTelemetryClient_1.BASTelemetryClient("TestExtension", "1.0.0");
    });
    afterEach(function () {
        sinon_1.default.restore();
    });
    it("should return the correct extension name", function () {
        (0, chai_1.expect)(telemetryClient.getExtensionName()).to.equal("TestExtension");
    });
    it("should return the correct extension version", function () {
        (0, chai_1.expect)(telemetryClient.getExtensionVersion()).to.equal("1.0.0");
    });
    it("should call trackEvent when telemetry is enabled", async function () {
        await telemetryClient.report("testEvent", { key: "value" }, { metric: 1 });
        (0, chai_1.expect)(mockAppInsightsClient.trackEvent.calledOnce).to.be.true;
    });
    it("should not call trackEvent when telemetry is disabled", async function () {
        isTelemetryEnabledStub.returns(false);
        await telemetryClient.report("testEvent", { key: "value" }, { metric: 1 });
        (0, chai_1.expect)(mockAppInsightsClient.trackEvent.called).to.be.false;
    });
    it("should include additional properties in the telemetry event", async function () {
        await telemetryClient.report("testEvent");
        const eventArgs = mockAppInsightsClient.trackEvent.getCall(0).args[0];
        (0, chai_1.expect)(eventArgs.properties).to.include({
            iaas: "mockIAAS",
            landscape: "mockDataCenter",
            is_sap_user: "true",
            bas_mode: "standard",
            extension_run_platform: constants_1.ExtensionRunMode.desktop,
            extension_version: "1.0.0",
            hashed_user: "mockHashedUser",
        });
        // expect also measurements
        (0, chai_1.expect)(eventArgs.measurements).to.be.empty;
    });
    it("should include additional properties and measurements in the telemetry event", async function () {
        await telemetryClient.report("testEvent", { key: "value" }, { metric: 1 });
        const eventArgs = mockAppInsightsClient.trackEvent.getCall(0).args[0];
        (0, chai_1.expect)(eventArgs.properties).to.include({
            iaas: "mockIAAS",
            landscape: "mockDataCenter",
            is_sap_user: "true",
            bas_mode: "standard",
            extension_run_platform: constants_1.ExtensionRunMode.desktop,
            extension_version: "1.0.0",
            hashed_user: "mockHashedUser",
            key: "value",
        });
        (0, chai_1.expect)(eventArgs.measurements).to.include({ metric: 1 });
    });
});
//# sourceMappingURL=basTelemetryClient.spec.js.map