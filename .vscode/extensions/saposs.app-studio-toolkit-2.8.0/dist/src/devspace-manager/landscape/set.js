"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLandscape = exports.cmdLandscapeSet = void 0;
const vscode_1 = require("vscode");
const node_url_1 = require("node:url");
const landscape_1 = require("./landscape");
async function cmdLandscapeSet() {
    /* istanbul ignore next */
    const landscape = await vscode_1.window.showInputBox({
        prompt: "Landscape url",
        ignoreFocusOut: true,
        validateInput: (value) => {
            try {
                const url = new node_url_1.URL(value);
                if (url.pathname.length > 1 || url.search || url.hash) {
                    return "Enter the URL origin without any paths or parameters";
                }
            }
            catch (e) {
                return e.toString();
            }
        },
    });
    if (landscape) {
        return addLandscape(landscape).finally(() => void vscode_1.commands.executeCommand("local-extension.tree.refresh"));
    }
}
exports.cmdLandscapeSet = cmdLandscapeSet;
async function addLandscape(landscapeName) {
    const toAdd = new node_url_1.URL(landscapeName).toString();
    const landscapes = (0, landscape_1.getLanscapesConfig)();
    if (!landscapes.find((landscape) => new node_url_1.URL(landscape.url).toString() === toAdd)) {
        landscapes.push({ url: toAdd });
        return (0, landscape_1.updateLandscapesConfig)(landscapes);
    }
}
exports.addLandscape = addLandscape;
//# sourceMappingURL=set.js.map