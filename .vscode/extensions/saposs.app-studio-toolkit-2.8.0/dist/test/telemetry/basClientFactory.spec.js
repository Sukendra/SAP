"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const basTelemetryClient_1 = require("../../src/telemetry/basTelemetryClient");
const base_bas_api_1 = require("../../src/public-api/base-bas-api");
describe("BASClientFactory", function () {
    let createStubInstance;
    beforeEach(function () {
        createStubInstance = sinon_1.default.stub(basTelemetryClient_1.BASTelemetryClient.prototype);
    });
    afterEach(function () {
        sinon_1.default.restore();
    });
    it("should return the same instance for the same extensionId and extensionVersion", function () {
        const client1 = base_bas_api_1.baseBasToolkitAPI.getTelemetryReporter("testExtension", "1.0.0");
        const client2 = base_bas_api_1.baseBasToolkitAPI.getTelemetryReporter("testExtension", "1.0.0");
        (0, chai_1.expect)(client1).to.equal(client2);
    });
    it("should create a new instance for a different extensionId or extensionVersion", function () {
        const client1 = base_bas_api_1.baseBasToolkitAPI.getTelemetryReporter("testExtension", "1.0.0");
        const client2 = base_bas_api_1.baseBasToolkitAPI.getTelemetryReporter("testExtension", "2.0.0");
        (0, chai_1.expect)(client1).to.not.equal(client2);
    });
});
//# sourceMappingURL=basClientFactory.spec.js.map