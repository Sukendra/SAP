"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasHanacalcviewCapabilities = exports.HANA_CALC_VIEW_EXTENSION_ID = void 0;
const artifact_management_1 = require("@sap/artifact-management");
const vscode_1 = require("vscode");
exports.HANA_CALC_VIEW_EXTENSION_ID = "sapse.webide-hdi-feature-vscode"; //calculation view extension
// eslint-disable-next-line @typescript-eslint/require-await -- the new implementation does not require await.
async function hasHanacalcviewCapabilities() {
    const logger = (0, artifact_management_1.getLogger)().getChildLogger({
        label: "hasHanacalcviewCapabilities",
    });
    // Cap mode is determined by the existence of the Cap extension
    const hasHanacalcviewCapabilities = !!vscode_1.extensions.getExtension(exports.HANA_CALC_VIEW_EXTENSION_ID);
    logger.trace("Has Hana Capabilities", { hasHanacalcviewCapabilities });
    return hasHanacalcviewCapabilities;
}
exports.hasHanacalcviewCapabilities = hasHanacalcviewCapabilities;
//# sourceMappingURL=validateHanacalcviewCapabilities.js.map