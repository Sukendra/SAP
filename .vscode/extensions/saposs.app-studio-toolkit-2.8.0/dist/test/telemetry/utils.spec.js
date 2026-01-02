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
const sinon = __importStar(require("sinon"));
const chai_1 = require("chai");
const utils = __importStar(require("../../src/telemetry/utils"));
const constants_1 = require("../../src/telemetry/constants");
const bas_sdk_1 = require("@sap/bas-sdk");
const proxyquire_1 = __importDefault(require("proxyquire"));
const basUtils = __importStar(require("../../src/utils/bas-utils"));
describe("Telemetry Utility Functions", () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });
    describe("getProcessEnv", () => {
        it("should return the environment variable value if it exists", () => {
            process.env.TEST_VAR = "testValue";
            (0, chai_1.expect)(utils.getProcessEnv("TEST_VAR")).to.equal("testValue");
        });
        it("should warn and return an empty string if the environment variable does not exist", () => {
            const warnStub = sandbox.stub(console, "warn");
            const result = utils.getProcessEnv("NON_EXISTENT_VAR");
            (0, chai_1.expect)(warnStub.calledWith("Environment variable NON_EXISTENT_VAR does not exist.")).to.be.true;
            (0, chai_1.expect)(result).to.equal("");
        });
    });
    describe("isSAPUser", () => {
        it("should return true if the user is an SAP user", () => {
            process.env.USER_NAME = "user@sap.com";
            (0, chai_1.expect)(utils.isSAPUser()).to.equal("true");
        });
        it("should return false if the user is not an SAP user", () => {
            process.env.USER_NAME = "user@example.com";
            (0, chai_1.expect)(utils.isSAPUser()).to.equal("false");
        });
        it("should return an empty string if the user name is not defined", () => {
            delete process.env.USER_NAME;
            (0, chai_1.expect)(utils.isSAPUser()).to.equal("");
        });
    });
    describe("getHashedUser", () => {
        let sandbox;
        let utils;
        let mockVscode;
        beforeEach(() => {
            sandbox = sinon.createSandbox();
            mockVscode = {
                env: {
                    machineId: "test-machine-id",
                },
            };
            utils = proxyquire_1.default.noCallThru().load("../../src/telemetry/utils", {
                vscode: mockVscode,
            });
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should return a consistent hash for the same user", () => {
            process.env.USER_NAME = "user@sap.com";
            const hashedResult = "015f94386e6b00a0cb12992d62c0ca452a9f6f962b2f6d3d7b6d7f3ccc824533";
            (0, chai_1.expect)(utils.getHashedUser()).to.equal(hashedResult);
            (0, chai_1.expect)(utils.getHashedUser()).to.equal(hashedResult);
        });
        it("should return machineId when USER_NAME is not set", () => {
            delete process.env.USER_NAME;
            (0, chai_1.expect)(utils.getHashedUser()).to.equal("test-machine-id");
        });
        it("should return an empty string when machineId is undefined", () => {
            delete process.env.USER_NAME;
            mockVscode.env.machineId = undefined;
            utils = proxyquire_1.default.noCallThru().load("../../src/telemetry/utils", {
                vscode: mockVscode,
            });
            (0, chai_1.expect)(utils.getHashedUser()).to.equal("");
        });
    });
    describe("getIAASParam", () => {
        let originalEnv;
        beforeEach(() => {
            originalEnv = Object.assign({}, process.env);
        });
        afterEach(() => {
            process.env = originalEnv;
        });
        it("should return iaas param if exists", () => {
            process.env.LANDSCAPE_INFRASTRUCTURE = "stg10.int";
            (0, chai_1.expect)(utils.getIAASParam()).to.equal("stg10.int");
        });
        it("should return empty string if it doesnt exist", () => {
            (0, chai_1.expect)(utils.getIAASParam()).to.equal("");
        });
    });
    describe("getDataCenterParam", () => {
        let originalEnv;
        beforeEach(() => {
            originalEnv = Object.assign({}, process.env);
        });
        afterEach(() => {
            process.env = originalEnv;
        });
        it("should return iaas param if exists", () => {
            process.env.LANDSCAPE_NAME = "landscape_name";
            (0, chai_1.expect)(utils.getDataCenterParam()).to.equal("landscape_name");
        });
        it("should return empty string if it doesnt exist", () => {
            (0, chai_1.expect)(utils.getDataCenterParam()).to.equal("");
        });
    });
    describe("getBASMode", () => {
        it("should return the current BAS mode", () => {
            sandbox.stub(bas_sdk_1.devspace, "getBasMode").returns("standard");
            (0, chai_1.expect)(utils.getBASMode()).to.equal("standard");
        });
    });
    describe("isTelemetryEnabled", () => {
        let sandbox;
        let utils;
        let mockVscode;
        let getConfigurationStub;
        let getExtensionRunPlatformStub;
        beforeEach(() => {
            sandbox = sinon.createSandbox();
            getConfigurationStub = sandbox.stub().returns({
                get: sandbox.stub().returns(true),
            });
            mockVscode = {
                env: {
                    remoteName: "ssh-remote",
                    machineId: "test-machine-id",
                },
                workspace: {
                    getConfiguration: getConfigurationStub,
                },
            };
            getExtensionRunPlatformStub = sandbox
                .stub(basUtils, "getExtensionRunPlatform")
                .returns(constants_1.ExtensionRunMode.desktop);
            utils = proxyquire_1.default.noCallThru().load("../../src/telemetry/utils", {
                vscode: mockVscode,
                "../../src/utils/bas-utils": {
                    getExtensionRunPlatform: getExtensionRunPlatformStub,
                },
            });
            process.env.LANDSCAPE_ENVIRONMENT = "canary";
            process.env.WS_BASE_URL = "https://bas-url.com";
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should return true when analytics is enabled", () => {
            (0, chai_1.expect)(utils.isTelemetryEnabled("sapse.vscode-extention-name")).to.be
                .true;
        });
        it("should return false when analytics is disabled", () => {
            getConfigurationStub.returns({ get: sandbox.stub().returns(false) });
            (0, chai_1.expect)(utils.isTelemetryEnabled("sapse.vscode-extention-name")).to.be
                .false;
        });
        it("should return false when configuration is undefined", () => {
            getConfigurationStub.returns({ get: sandbox.stub().returns(undefined) });
            (0, chai_1.expect)(utils.isTelemetryEnabled("sapse.vscode-extention-name")).to.be
                .false;
        });
        it("should return false when landscape is dev", () => {
            process.env.LANDSCAPE_ENVIRONMENT = "staging";
            (0, chai_1.expect)(utils.isTelemetryEnabled("sapse.vscode-extention-name")).to.be
                .false;
        });
        it("should return false when run platform is unexpected", () => {
            getExtensionRunPlatformStub.returns(constants_1.ExtensionRunMode.unexpected);
            (0, chai_1.expect)(utils.isTelemetryEnabled("sapse.vscode-extention-name")).to.be
                .false;
        });
        it("should return false on error", () => {
            const consoleErrorStub = sandbox.stub(console, "error");
            getConfigurationStub.returns({
                get: sandbox.stub().throws(new Error("Test error")),
            });
            (0, chai_1.expect)(utils.isTelemetryEnabled("sapse.vscode-extention-name")).to.be
                .false;
            (0, chai_1.expect)(consoleErrorStub.calledWith(sinon.match.string)).to.be.true;
        });
    });
});
//# sourceMappingURL=utils.spec.js.map