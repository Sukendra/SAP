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
const telemetryInit_1 = require("../../src/telemetry/telemetryInit");
describe("getTelemetryClient", function () {
    let addTelemetryProcessorStub;
    let configStub;
    beforeEach(function () {
        configStub = { samplingPercentage: 50 };
        addTelemetryProcessorStub = sinon_1.default.stub();
        // @ts-expect-error - test only
        appInsights.defaultClient.config = configStub;
        appInsights.defaultClient.addTelemetryProcessor = addTelemetryProcessorStub;
    });
    afterEach(function () {
        sinon_1.default.restore();
    });
    it("should set sampling percentage to 50 (existing telemetry default client settings)", function () {
        const client = (0, telemetryInit_1.getTelemetryClient)();
        (0, chai_1.expect)(client.config.samplingPercentage).to.equal(50);
    });
    it("should add a telemetry processor that masks sensitive data (new telemetry default client settings)", function () {
        (0, telemetryInit_1.setTelemetryClient)(null);
        (0, telemetryInit_1.getTelemetryClient)();
        (0, chai_1.expect)(addTelemetryProcessorStub.calledOnce).to.be.true;
        // Simulate processing an envelope
        const telemetryProcessor = addTelemetryProcessorStub.firstCall.args[0];
        const envelope = { tags: {} };
        telemetryProcessor(envelope);
        (0, chai_1.expect)(envelope.tags).to.deep.equal({
            "ai.location.ip": "0.0.0.0",
            "ai.cloud.roleInstance": "masked",
            "ai.cloud.roleVer": "masked",
            "ai.cloud.role": "masked",
            "ai.device.type": "masked",
        });
    });
});
//# sourceMappingURL=telemetryInit.spec.js.map