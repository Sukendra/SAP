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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTelemetryEnabled = exports.getBASMode = exports.getHashedUser = exports.getDataCenterParam = exports.getIAASParam = exports.isSAPUser = exports.getProcessEnv = void 0;
const bas_sdk_1 = require("@sap/bas-sdk");
const constants_1 = require("./constants");
const lodash_1 = require("lodash");
const crypto = __importStar(require("crypto"));
const basUtils = __importStar(require("../../src/utils/bas-utils"));
let vscode;
try {
    vscode = require("vscode");
}
catch (e) {
    /* istanbul ignore next */
    console.error(`vscode is not available ${e}`);
}
/**
 * Helper function to detect if env var is provided before returning it.
 *
 * @param name Environment variable name
 * @returns Environment variable value
 */
function getProcessEnv(name) {
    const value = process.env[name];
    if (!value) {
        console.warn(`Environment variable ${name} does not exist.`);
    }
    return value !== null && value !== void 0 ? value : "";
}
exports.getProcessEnv = getProcessEnv;
function isSAPUser() {
    const userName = getProcessEnv("USER_NAME");
    if ((0, lodash_1.isEmpty)(userName)) {
        return "";
    }
    return userName.endsWith("@sap.com").toString();
}
exports.isSAPUser = isSAPUser;
function getIAASParam() {
    return getProcessEnv("LANDSCAPE_INFRASTRUCTURE");
}
exports.getIAASParam = getIAASParam;
function getDataCenterParam() {
    return getProcessEnv("LANDSCAPE_NAME");
}
exports.getDataCenterParam = getDataCenterParam;
function getHashedUser() {
    var _a;
    const userName = getProcessEnv("USER_NAME");
    if (!(0, lodash_1.isEmpty)(userName)) {
        return crypto.createHash("sha256").update(userName).digest("hex");
    }
    else {
        // For local VSCode
        return (_a = vscode.env.machineId) !== null && _a !== void 0 ? _a : "";
    }
}
exports.getHashedUser = getHashedUser;
function getBASMode() {
    return bas_sdk_1.devspace.getBasMode();
}
exports.getBASMode = getBASMode;
function isTelemetryEnabled(extensionName) {
    var _a;
    try {
        if (basUtils.getExtensionRunPlatform(extensionName) ===
            constants_1.ExtensionRunMode.unexpected) {
            // When running from non vscode extension context (e.g. tests, etc.)
            return false;
        }
        else if (/^(staging|ci|dev)$/.test(getProcessEnv("LANDSCAPE_ENVIRONMENT"))) {
            // test environments - always don't report
            return false;
        }
        else {
            // non local & non dev environments - verify if setting is enabled
            // For local VSCode also return the setting value
            return ((_a = vscode.workspace
                .getConfiguration()
                .get(constants_1.ANALYTICS_ENABLED_SETTING_NAME)) !== null && _a !== void 0 ? _a : false);
        }
    }
    catch (e) {
        console.error(`Error while reading analytics setting: ${e}`);
        return false;
    }
}
exports.isTelemetryEnabled = isTelemetryEnabled;
//# sourceMappingURL=utils.js.map