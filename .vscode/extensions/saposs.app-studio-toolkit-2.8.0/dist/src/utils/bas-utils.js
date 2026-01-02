"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internal = exports.cleanKeepAliveInterval = exports.startBasKeepAlive = exports.getExtensionRunPlatform = exports.shouldRunCtlServer = exports.ExtensionRunMode = void 0;
const vscode_1 = require("vscode");
const lodash_1 = require("lodash");
const bas_sdk_1 = require("@sap/bas-sdk");
const node_url_1 = require("node:url");
const logger_1 = require("../logger/logger");
const constants_1 = require("../constants");
var ExtensionRunMode;
(function (ExtensionRunMode) {
    ExtensionRunMode["desktop"] = "desktop";
    ExtensionRunMode["basRemote"] = "bas-remote";
    ExtensionRunMode["basWorkspace"] = "bas-workspace";
    ExtensionRunMode["basUi"] = "bas-ui";
    ExtensionRunMode["wsl"] = "wsl";
    ExtensionRunMode["unexpected"] = "unexpected";
})(ExtensionRunMode = exports.ExtensionRunMode || (exports.ExtensionRunMode = {}));
function shouldRunCtlServer() {
    const platform = getExtensionRunPlatform();
    // view panel visibility expects that value is available
    void vscode_1.commands.executeCommand("setContext", `ext.runPlatform`, platform);
    return (platform === ExtensionRunMode.basWorkspace || // BAS
        platform === ExtensionRunMode.basRemote || // hybrid (through ssh-remote)
        bas_sdk_1.devspace.getBasMode() === "personal-edition" // personal edition
    );
}
exports.shouldRunCtlServer = shouldRunCtlServer;
function getExtensionRunPlatform(extensionName) {
    let runPlatform = ExtensionRunMode.unexpected;
    const serverUri = process.env.WS_BASE_URL;
    // see example: https://github.com/microsoft/vscode/issues/74188
    // expected values of env.remoteName: `undefined` (locally), `ssh-remote` (bas-remote) or `landscape.url` (BAS)
    if (serverUri && typeof vscode_1.env.remoteName === "string") {
        const remote = (0, lodash_1.join)((0, lodash_1.tail)((0, lodash_1.split)(vscode_1.env.remoteName, ".")), ".");
        const host = (0, lodash_1.join)((0, lodash_1.tail)((0, lodash_1.split)(new node_url_1.URL(serverUri).hostname, ".")), ".");
        if (host === remote) {
            // see for reference: https://code.visualstudio.com/api/references/vscode-api#Extension
            const ext = vscode_1.extensions.getExtension(extensionName ? extensionName : "SAPOSS.app-studio-toolkit");
            if (ext) {
                switch (ext.extensionKind) {
                    case vscode_1.ExtensionKind.Workspace:
                        runPlatform = ExtensionRunMode.basWorkspace;
                        break;
                    case vscode_1.ExtensionKind.UI:
                        runPlatform = ExtensionRunMode.basUi;
                        break;
                }
            }
        }
        else {
            runPlatform = ExtensionRunMode.basRemote;
        }
    }
    else if (typeof vscode_1.env.remoteName === "string") {
        if (vscode_1.env.remoteName.toLowerCase().includes("wsl")) {
            runPlatform = ExtensionRunMode.wsl;
        }
    }
    else {
        runPlatform = ExtensionRunMode.desktop;
    }
    return runPlatform;
}
exports.getExtensionRunPlatform = getExtensionRunPlatform;
let keepAliveInterval;
async function touchFile(filePath) {
    try {
        await vscode_1.workspace.fs.writeFile(vscode_1.Uri.file(filePath), new Uint8Array(0));
    }
    catch (error) {
        (0, logger_1.getLogger)().error(`Error while touching file: ${error}`);
    }
}
function formatTimeRemaining(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
async function askToSessionExtend() {
    return vscode_1.window.withProgress({
        location: vscode_1.ProgressLocation.Notification,
        title: "Your SAP Business Application Studio remote session is about to expire. To prevent session expiration, click 'Cancel'",
        cancellable: true,
    }, async (progress, token) => {
        const increment = 100 / constants_1.EXTEND_SESSION_TIMEOUT;
        let secondsLeft = constants_1.EXTEND_SESSION_TIMEOUT;
        return new Promise((resolve) => {
            /* istanbul ignore next */
            const interval = setInterval(() => {
                secondsLeft--;
                progress.report({
                    message: `time remaining: ${formatTimeRemaining(secondsLeft)}`,
                    increment,
                });
                if (secondsLeft === 0) {
                    clearInterval(interval);
                    resolve(false); // Close window
                }
            }, 1000);
            token.onCancellationRequested(() => {
                clearInterval(interval);
                resolve(true); // Extend session
            });
        });
    });
}
function startBasKeepAlive() {
    // Only proceed if in hybrid mode
    if (getExtensionRunPlatform() !== ExtensionRunMode.basRemote) {
        return;
    }
    // Clear any existing interval first to prevent duplicates
    cleanKeepAliveInterval();
    async function executeKeepAlive() {
        await touchFile(constants_1.BAS_KEEP_ALIVE_FILE);
    }
    let shouldExtendPromise;
    let sessionStartTime = Date.now();
    // Execute immediately once
    void executeKeepAlive();
    /* istanbul ignore next */
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- no need to handle promise rejection
    keepAliveInterval = setInterval(async () => {
        void executeKeepAlive();
        const timeSinceStart = Date.now() - sessionStartTime;
        if (timeSinceStart > constants_1.MAX_SESSION_TIME - constants_1.KEEP_ALIVE_TIMEOUT) {
            if (shouldExtendPromise === undefined) {
                // Only ask once
                shouldExtendPromise = askToSessionExtend();
                if (!(await shouldExtendPromise)) {
                    // Stop keep alive interval before closing VS Code altrough it will be executed on extension deactivation
                    // because 'closeWindow' not sure closing VS Code (e.g. there are unsaved changes)
                    cleanKeepAliveInterval();
                    void vscode_1.commands.executeCommand("workbench.action.closeWindow");
                }
                else {
                    // Extend session for another MAX_SESSION_TIME cycle
                    sessionStartTime = Date.now();
                }
                shouldExtendPromise = undefined;
            }
        }
    }, constants_1.KEEP_ALIVE_TIMEOUT);
}
exports.startBasKeepAlive = startBasKeepAlive;
function cleanKeepAliveInterval() {
    if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = undefined;
    }
}
exports.cleanKeepAliveInterval = cleanKeepAliveInterval;
// fot testing
exports.internal = {
    askToSessionExtend,
    formatTimeRemaining,
};
//# sourceMappingURL=bas-utils.js.map