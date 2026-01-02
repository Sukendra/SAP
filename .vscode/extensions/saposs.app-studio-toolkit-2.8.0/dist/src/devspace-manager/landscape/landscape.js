"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internal = exports.setDefaultLandscape = exports.clearDefaultLandscape = exports.getDefaultLandscape = exports.cmdLoginToLandscape = exports.removeLandscape = exports.getLandscapes = exports.updateLandscapesConfig = exports.getLanscapesConfig = exports.autoRefresh = exports.clearAutoRefreshTimers = void 0;
const vscode_1 = require("vscode");
const bas_sdk_1 = require("@sap/bas-sdk");
const lodash_1 = require("lodash");
const auth_utils_1 = require("../../authentication/auth-utils");
const node_url_1 = require("node:url");
const logger_1 = require("../../logger/logger");
const authProvider_1 = require("../../authentication/authProvider");
const LBL_ADD_LANDSCAPE = "Add another landscape";
const DEFAULT_REFRESH_RATE = 10 * 1000; // 10 sec default
const DEFAULT_TIMEOUT = 2 * 60 * 1000; // 2 min default
const autoRefreshTimerArray = [];
function clearAutoRefreshTimers() {
    autoRefreshTimerArray.forEach((interval) => {
        clearInterval(interval);
    });
    autoRefreshTimerArray.splice(0, autoRefreshTimerArray.length);
}
exports.clearAutoRefreshTimers = clearAutoRefreshTimers;
function autoRefresh(refreshRate = DEFAULT_REFRESH_RATE, timeOut = DEFAULT_TIMEOUT) {
    let refreshedTime = 0;
    const refreshInterval = setInterval(() => {
        getLandscapes()
            .then((landscapes) => {
            if (refreshedTime < timeOut && !(0, lodash_1.isEmpty)(landscapes)) {
                refreshedTime += refreshRate;
                (0, logger_1.getLogger)().info(`Auto refresh ${refreshedTime} out of ${timeOut}`);
                void vscode_1.commands.executeCommand("local-extension.tree.refresh");
            }
            else {
                (0, logger_1.getLogger)().info(`Auto refresh completed`);
                clearInterval(refreshInterval);
                const index = autoRefreshTimerArray.indexOf(refreshInterval);
                /* istanbul ignore else */
                if (index !== -1) {
                    autoRefreshTimerArray.splice(index, 1); // Remove one item at the found index
                }
            }
        })
            .catch((e) => {
            (0, logger_1.getLogger)().error(`getLandscapes error: ${e.toString()}`);
        });
    }, refreshRate);
    autoRefreshTimerArray.push(refreshInterval);
}
exports.autoRefresh = autoRefresh;
function isLandscapeLoggedIn(url) {
    return (0, auth_utils_1.hasJwt)(url);
}
function getLanscapesConfig() {
    var _a;
    // example:
    //  - new format:  {"url":"https://example.com","default":true}|{"url":"https://example2.com"}
    //  - old format:  https://example.com,https://example2.com
    let config = (_a = vscode_1.workspace.getConfiguration().get("sap-remote.landscape-name")) !== null && _a !== void 0 ? _a : "";
    // check if it is an old format - replace `,` with `|` - TODO: remove this in future (backward compatibility)
    if (!/.*\{.+\}.*/.test(config)) {
        config = config.replace(/,/g, "|");
    }
    // split by | and parse each landscape
    return (0, lodash_1.uniqBy)((0, lodash_1.compact)(config.split("|").map((landscape) => {
        try {
            const item = JSON.parse(landscape);
            return Object.assign({ url: new node_url_1.URL(item.url).toString() }, item.default ? { default: item.default } : {});
        }
        catch (e) {
            // if not a valid JSON - consider it as a URL - TODO: remove this in future (backward compatibility)
            if ((0, lodash_1.trim)(landscape).length > 0) {
                return { url: landscape };
            }
        }
    })), "url");
}
exports.getLanscapesConfig = getLanscapesConfig;
async function updateLandscapesConfig(values) {
    const value = values.map((item) => JSON.stringify(item)).join("|");
    return vscode_1.workspace
        .getConfiguration()
        .update("sap-remote.landscape-name", value, vscode_1.ConfigurationTarget.Global)
        .then(() => {
        (0, logger_1.getLogger)().debug(`Landscapes config updated: ${value}`);
    });
}
exports.updateLandscapesConfig = updateLandscapesConfig;
async function getLandscapes() {
    const lands = [];
    for (const landscape of getLanscapesConfig()) {
        const url = new node_url_1.URL(landscape.url);
        lands.push(Object.assign({
            name: url.hostname,
            url: url.toString(),
            isLoggedIn: await isLandscapeLoggedIn(landscape.url),
        }, landscape.default ? { default: landscape.default } : {}));
    }
    return lands;
}
exports.getLandscapes = getLandscapes;
async function removeLandscape(landscapeName) {
    const config = getLanscapesConfig();
    if ((0, lodash_1.size)(config) > 0) {
        const toRemove = new node_url_1.URL(landscapeName).toString();
        const updated = config.filter((landscape) => new node_url_1.URL(landscape.url).toString() !== toRemove);
        if ((0, lodash_1.size)(updated) !== (0, lodash_1.size)(config)) {
            return updateLandscapesConfig(updated);
        }
    }
}
exports.removeLandscape = removeLandscape;
async function cmdLoginToLandscape(node) {
    try {
        const session = await vscode_1.authentication.getSession(authProvider_1.BasRemoteAuthenticationProvider.id, [node.url], { forceNewSession: true });
        if (session === null || session === void 0 ? void 0 : session.accessToken) {
            // auto refresh util jwt expired
            autoRefresh(30 * 1000, bas_sdk_1.core.timeUntilJwtExpires(session.accessToken));
        }
    }
    finally {
        void vscode_1.commands.executeCommand("local-extension.tree.refresh");
    }
}
exports.cmdLoginToLandscape = cmdLoginToLandscape;
function getDefaultLandscape() {
    var _a, _b;
    return (_b = (_a = getLanscapesConfig().find((landscape) => landscape.default)) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : "";
}
exports.getDefaultLandscape = getDefaultLandscape;
async function clearDefaultLandscape(updateLandsConfig = true) {
    const configs = getLanscapesConfig();
    // reset 'default' flag for all landscapes if exists
    configs.forEach((landscape) => {
        delete landscape.default;
    });
    updateLandsConfig && (await updateLandscapesConfig(configs));
    return configs;
}
exports.clearDefaultLandscape = clearDefaultLandscape;
async function markDefaultLandscape(landscapeUrl) {
    const configs = await clearDefaultLandscape(false);
    // update landscape if it exists in the list or add it
    const index = configs.findIndex((landscape) => landscape.url === landscapeUrl);
    if (index != -1) {
        // exists
        configs[index].default = true;
    }
    else {
        // not exists : add the landscape to the list
        configs.push({ url: landscapeUrl, default: true });
    }
    await updateLandscapesConfig(configs);
    void vscode_1.commands.executeCommand("local-extension.tree.refresh");
    (0, logger_1.getLogger)().info(`Default landscape set to: ${landscapeUrl}`);
}
function selectLandscape(landscapes) {
    const items = landscapes.map((landscape) => ({
        url: landscape.url,
        label: landscape.name,
    }));
    items.unshift({ label: "", kind: vscode_1.QuickPickItemKind.Separator }); // existing items section separator
    items.push({ label: "", kind: vscode_1.QuickPickItemKind.Separator }); // action section separator
    items.push({ label: LBL_ADD_LANDSCAPE });
    return vscode_1.window.showQuickPick(items, {
        placeHolder: "Select the landscape you want to use as default",
        ignoreFocusOut: true,
    });
}
async function setDefaultLandscape(landscape) {
    // select landscape as the 'default' one
    let selectedLandscape;
    const defaultLandscape = getDefaultLandscape();
    if (landscape) {
        if (defaultLandscape) {
            const isContinue = await vscode_1.window.showInformationMessage(`The ${defaultLandscape} landscape is currently defined as the default landscape.\nDo you want to make the ${landscape} landscape the default instead?`, { modal: true }, "Yes");
            if (!isContinue) {
                return false;
            }
        }
        selectedLandscape = { url: landscape };
    }
    else {
        do {
            // remove selected default landscape from the list
            const landscapes = (await getLandscapes()).filter((item) => item.url !== defaultLandscape);
            selectedLandscape = await selectLandscape(landscapes);
            if ((selectedLandscape === null || selectedLandscape === void 0 ? void 0 : selectedLandscape.label) === LBL_ADD_LANDSCAPE) {
                await vscode_1.commands.executeCommand("local-extension.landscape.add");
            }
        } while ((selectedLandscape === null || selectedLandscape === void 0 ? void 0 : selectedLandscape.label) === LBL_ADD_LANDSCAPE);
    }
    if (selectedLandscape === null || selectedLandscape === void 0 ? void 0 : selectedLandscape.url) {
        await markDefaultLandscape(selectedLandscape.url);
    }
    return !!selectedLandscape;
}
exports.setDefaultLandscape = setDefaultLandscape;
// for testing
exports.internal = {
    autoRefreshTimerArray,
};
//# sourceMappingURL=landscape.js.map