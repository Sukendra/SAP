"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionRunMode = exports.APPINSIGHTS_CONNECTION_STRING = exports.ANALYTICS_ENABLED_SETTING_NAME = void 0;
// Should be identical to the settings name contributed from vscode-bas-extension.
exports.ANALYTICS_ENABLED_SETTING_NAME = "sapbas.telemetryEnabled";
exports.APPINSIGHTS_CONNECTION_STRING = "InstrumentationKey=60284eda-c8cc-4794-bdb7-d35f0abb66f9;IngestionEndpoint=https://germanywestcentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://germanywestcentral.livediagnostics.monitor.azure.com/";
var ExtensionRunMode;
(function (ExtensionRunMode) {
    ExtensionRunMode["desktop"] = "desktop";
    ExtensionRunMode["basRemote"] = "bas-remote";
    ExtensionRunMode["basWorkspace"] = "bas-workspace";
    ExtensionRunMode["basUi"] = "bas-ui";
    ExtensionRunMode["wsl"] = "wsl";
    ExtensionRunMode["unexpected"] = "unexpected";
})(ExtensionRunMode = exports.ExtensionRunMode || (exports.ExtensionRunMode = {}));
//# sourceMappingURL=constants.js.map