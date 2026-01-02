"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const constants_1 = require("../../src/telemetry/constants");
describe("Constants and Enums", () => {
    it("should have the correct ANALYTICS_ENABLED_SETTING_NAME", () => {
        (0, chai_1.expect)(constants_1.ANALYTICS_ENABLED_SETTING_NAME).to.equal("sapbas.telemetryEnabled");
    });
    it("should have the correct APPINSIGHTS_CONNECTION_STRING", () => {
        (0, chai_1.expect)(constants_1.APPINSIGHTS_CONNECTION_STRING).to.equal("InstrumentationKey=60284eda-c8cc-4794-bdb7-d35f0abb66f9;IngestionEndpoint=https://germanywestcentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://germanywestcentral.livediagnostics.monitor.azure.com/");
    });
    describe("ExtensionRunMode Enum", () => {
        it("should have the correct values for each key", () => {
            (0, chai_1.expect)(constants_1.ExtensionRunMode.desktop).to.equal("desktop");
            (0, chai_1.expect)(constants_1.ExtensionRunMode.basRemote).to.equal("bas-remote");
            (0, chai_1.expect)(constants_1.ExtensionRunMode.basWorkspace).to.equal("bas-workspace");
            (0, chai_1.expect)(constants_1.ExtensionRunMode.basUi).to.equal("bas-ui");
            (0, chai_1.expect)(constants_1.ExtensionRunMode.wsl).to.equal("wsl");
            (0, chai_1.expect)(constants_1.ExtensionRunMode.unexpected).to.equal("unexpected");
        });
        it("should have all expected keys", () => {
            (0, chai_1.expect)(constants_1.ExtensionRunMode).haveOwnPropertyDescriptor("desktop");
            (0, chai_1.expect)(constants_1.ExtensionRunMode).haveOwnPropertyDescriptor("basRemote");
            (0, chai_1.expect)(constants_1.ExtensionRunMode).haveOwnPropertyDescriptor("basWorkspace");
            (0, chai_1.expect)(constants_1.ExtensionRunMode).haveOwnPropertyDescriptor("basUi");
            (0, chai_1.expect)(constants_1.ExtensionRunMode).haveOwnPropertyDescriptor("wsl");
            (0, chai_1.expect)(constants_1.ExtensionRunMode).haveOwnPropertyDescriptor("unexpected");
        });
    });
});
//# sourceMappingURL=constants.spec.js.map