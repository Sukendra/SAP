"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const proxyquire_1 = __importDefault(require("proxyquire"));
const lodash_1 = require("lodash");
const node_url_1 = require("node:url");
describe("Landscape Module Tests", function () {
    let vscodeMocks;
    let landscapeModule;
    let loggerStub;
    let mockGetConfiguration;
    const getConfigurationProxy = {
        get: (v) => {
            throw new Error("not implemented");
        },
        update: () => {
            throw new Error("not implemented");
        },
    };
    before(function () {
        // Mock the VS Code API
        let QuickPickItemKindMock;
        (function (QuickPickItemKindMock) {
            QuickPickItemKindMock[QuickPickItemKindMock["Default"] = 0] = "Default";
            QuickPickItemKindMock[QuickPickItemKindMock["Separator"] = 1] = "Separator";
        })(QuickPickItemKindMock || (QuickPickItemKindMock = {}));
        vscodeMocks = {
            workspace: {
                getConfiguration: () => getConfigurationProxy,
            },
            commands: {
                executeCommand: () => {
                    throw new Error("not implemented");
                },
            },
            window: {
                showQuickPick: () => {
                    throw new Error("not implemented");
                },
                showInformationMessage: () => {
                    throw new Error("not implemented");
                },
            },
            authentication: {
                getSession: () => {
                    throw new Error("not implemented");
                },
            },
            ConfigurationTarget: { Global: 1 },
            QuickPickItemKind: QuickPickItemKindMock,
            AuthenticationGetSessionOptions: {
                create: () => {
                    throw new Error("not implemented");
                },
            },
        };
        // Mock logger
        loggerStub = {
            info: sinon_1.default.stub(),
            error: sinon_1.default.stub(),
            debug: sinon_1.default.stub(),
        };
        // Proxyquire to inject mocks
        landscapeModule = (0, proxyquire_1.default)("../../../src/devspace-manager/landscape/landscape", {
            vscode: Object.assign(Object.assign({}, vscodeMocks), { "@noCallThru": true }),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- stubbing the logger
            "../../../src/logger/logger": { getLogger: () => loggerStub },
            "@sap/bas-sdk": {
                helpers: { timeUntilJwtExpires: sinon_1.default.stub().returns(60000) },
            },
            "../tree/treeItems": { LandscapeNode: sinon_1.default.stub() },
            "../../authentication/authProvider": {
                BasRemoteAuthenticationProvider: sinon_1.default.stub(),
            },
        });
    });
    beforeEach(function () {
        mockGetConfiguration = sinon_1.default.mock(getConfigurationProxy);
    });
    afterEach(function () {
        mockGetConfiguration.verify();
        sinon_1.default.restore();
    });
    const config = [
        { url: "https://example.com/", default: true },
        { url: "https://other.com/" },
    ];
    const mockConfig = (v = config) => v.map((con) => JSON.stringify(con)).join("|");
    describe("getLandscapes", function () {
        it("should parse landscapes correctly when configured", async function () {
            mockGetConfiguration
                .expects("get")
                .withExactArgs("sap-remote.landscape-name")
                .returns(mockConfig());
            const landscapes = await landscapeModule.getLandscapes();
            (0, chai_1.expect)(landscapes).to.have.lengthOf(2);
            (0, chai_1.expect)(landscapes[0].url).be.equal("https://example.com/");
            (0, chai_1.expect)(landscapes[0].isLoggedIn).be.false;
            (0, chai_1.expect)(landscapes[0].default).be.true;
        });
    });
    describe("getDefaultLandscape", function () {
        it("should return when configured", async function () {
            mockGetConfiguration
                .expects("get")
                .withExactArgs("sap-remote.landscape-name")
                .returns(mockConfig());
            (0, chai_1.expect)(await landscapeModule.getDefaultLandscape()).to.be.equal("https://example.com/");
        });
        it("should return empty when not configured", async function () {
            const copyConfig = (0, lodash_1.cloneDeep)(config);
            copyConfig.shift();
            mockGetConfiguration
                .expects("get")
                .withExactArgs("sap-remote.landscape-name")
                .returns(mockConfig(copyConfig));
            (0, chai_1.expect)(await landscapeModule.getDefaultLandscape()).to.be.empty;
        });
    });
    describe("clearDefaultLandscape", function () {
        const localConfig = config.map((con) => (Object.assign(Object.assign({}, con), { default: true })));
        it("should reset 'default' flag for all entries but not update the configuration", async function () {
            mockGetConfiguration
                .expects("get")
                .withExactArgs("sap-remote.landscape-name")
                .returns(mockConfig(localConfig));
            (0, chai_1.expect)(await landscapeModule.clearDefaultLandscape(false)).be.deep.equal(localConfig.map((con) => {
                delete con.default;
                return con;
            }));
        });
        it("should reset 'default' flag and update the configuration", async function () {
            mockGetConfiguration
                .expects("get")
                .withExactArgs("sap-remote.landscape-name")
                .returns(mockConfig(localConfig));
            const expectedConfig = localConfig.map((con) => {
                delete con.default;
                return con;
            });
            const value = expectedConfig
                .map((item) => JSON.stringify(item))
                .join("|");
            mockGetConfiguration
                .expects("update")
                .withExactArgs("sap-remote.landscape-name", value, vscodeMocks.ConfigurationTarget.Global)
                .resolves();
            (0, chai_1.expect)(await landscapeModule.clearDefaultLandscape()).be.deep.equal(expectedConfig);
        });
    });
    describe("setDefaultLandscape", function () {
        const placeHolderText = "Select the landscape you want to use as default";
        let mockCommands;
        let mockWindow;
        beforeEach(() => {
            mockCommands = sinon_1.default.mock(vscodeMocks.commands);
            mockWindow = sinon_1.default.mock(vscodeMocks.window);
        });
        this.afterEach(() => {
            mockCommands.verify();
            mockWindow.verify();
        });
        it("should set a new default landscape", async function () {
            mockGetConfiguration
                .expects("get")
                .withExactArgs("sap-remote.landscape-name")
                .thrice()
                .returns(mockConfig());
            const l = new node_url_1.URL(config[1].url);
            const items = [
                { label: l.hostname, url: l.toString() },
            ];
            items.unshift({
                label: "",
                kind: vscodeMocks.QuickPickItemKind.Separator,
            });
            items.push({ label: "", kind: vscodeMocks.QuickPickItemKind.Separator });
            items.push({ label: "Add another landscape" });
            mockWindow
                .expects("showQuickPick")
                .withExactArgs(items, {
                placeHolder: placeHolderText,
                ignoreFocusOut: true,
            })
                .resolves(items[1]);
            const modified = (0, lodash_1.cloneDeep)(config)
                .map((con) => {
                delete con.default;
                return con;
            })
                .map((con) => {
                if (con.url === items[1].url) {
                    con.default = true;
                }
                return con;
            });
            const value = modified.map((item) => JSON.stringify(item)).join("|");
            mockGetConfiguration
                .expects("update")
                .withExactArgs("sap-remote.landscape-name", value, vscodeMocks.ConfigurationTarget.Global)
                .resolves();
            mockCommands
                .expects("executeCommand")
                .withExactArgs("local-extension.tree.refresh")
                .once();
            (0, chai_1.expect)(await landscapeModule.setDefaultLandscape()).to.be.true;
        });
        it("should not set a new default landscape when user cancel selection", async function () {
            mockGetConfiguration
                .expects("get")
                .withExactArgs("sap-remote.landscape-name")
                .twice()
                .returns(mockConfig());
            const l = new node_url_1.URL(config[1].url);
            const items = [
                { label: l.hostname, url: l.toString() },
            ];
            items.unshift({
                label: "",
                kind: vscodeMocks.QuickPickItemKind.Separator,
            });
            items.push({ label: "", kind: vscodeMocks.QuickPickItemKind.Separator }); // action section separator
            items.push({ label: "Add another landscape" });
            mockWindow
                .expects("showQuickPick")
                .withExactArgs(items, {
                placeHolder: placeHolderText,
                ignoreFocusOut: true,
            })
                .resolves(undefined);
            mockGetConfiguration.expects("update").never();
            mockCommands.expects("executeCommand").never();
            (0, chai_1.expect)(await landscapeModule.setDefaultLandscape()).to.be.false;
        });
        it("should set a new default landscape when landscape name provided", async function () {
            mockGetConfiguration
                .expects("get")
                .withExactArgs("sap-remote.landscape-name")
                .twice()
                .returns(mockConfig());
            const c = { url: "https://new.com/" };
            const added = (0, lodash_1.cloneDeep)(config);
            added.push(c);
            const modified = (0, lodash_1.cloneDeep)(added)
                .map((con) => {
                delete con.default;
                return con;
            })
                .map((con) => {
                if (con.url === c.url) {
                    con.default = true;
                }
                return con;
            });
            const value = modified.map((item) => JSON.stringify(item)).join("|");
            mockWindow.expects("showInformationMessage").resolves("Yes");
            mockGetConfiguration
                .expects("update")
                .withExactArgs("sap-remote.landscape-name", value, vscodeMocks.ConfigurationTarget.Global)
                .resolves();
            mockCommands
                .expects("executeCommand")
                .withExactArgs("local-extension.tree.refresh")
                .once();
            (0, chai_1.expect)(await landscapeModule.setDefaultLandscape(c.url)).to.be.true;
        });
        it("should set a new default landscape when landscape name provided, no default was defined", async function () {
            const copyConfig = (0, lodash_1.cloneDeep)(config).map((con) => {
                delete con.default;
                return con;
            });
            mockGetConfiguration
                .expects("get")
                .withExactArgs("sap-remote.landscape-name")
                .twice()
                .returns(mockConfig(copyConfig));
            const c = { url: "https://new.com/" };
            copyConfig.push(c);
            const modified = (0, lodash_1.cloneDeep)(copyConfig).map((con) => {
                if (con.url === c.url) {
                    con.default = true;
                }
                return con;
            });
            const value = modified.map((item) => JSON.stringify(item)).join("|");
            mockGetConfiguration
                .expects("update")
                .withExactArgs("sap-remote.landscape-name", value, vscodeMocks.ConfigurationTarget.Global)
                .resolves();
            mockCommands
                .expects("executeCommand")
                .withExactArgs("local-extension.tree.refresh")
                .once();
            (0, chai_1.expect)(await landscapeModule.setDefaultLandscape(c.url)).to.be.true;
        });
        it("should set a new default landscape when landscape name provided, operation canceled", async function () {
            mockGetConfiguration
                .expects("get")
                .withExactArgs("sap-remote.landscape-name")
                .once()
                .returns(mockConfig());
            const c = { url: "https://new.com/" };
            mockWindow.expects("showInformationMessage").resolves(undefined);
            (0, chai_1.expect)(await landscapeModule.setDefaultLandscape(c.url)).to.be.false;
        });
        it("should set a new default landscape when user added a not existed item", async function () {
            mockGetConfiguration
                .expects("get")
                .withExactArgs("sap-remote.landscape-name")
                .twice()
                .returns(mockConfig());
            const l = new node_url_1.URL(config[1].url);
            const items = [
                { label: l.hostname, url: l.toString() },
            ];
            items.unshift({
                label: "",
                kind: vscodeMocks.QuickPickItemKind.Separator,
            });
            items.push({ label: "", kind: vscodeMocks.QuickPickItemKind.Separator });
            items.push({ label: "Add another landscape" });
            mockWindow
                .expects("showQuickPick")
                .withExactArgs(items, {
                placeHolder: placeHolderText,
                ignoreFocusOut: true,
            })
                .resolves(items[items.length - 1]);
            mockCommands
                .expects("executeCommand")
                .withExactArgs("local-extension.landscape.add")
                .resolves();
            const a = new node_url_1.URL("https://new.com/");
            const modifiedItems = [
                { label: l.hostname, url: l.toString() },
                { label: a.hostname, url: a.toString() },
            ];
            modifiedItems.unshift({
                label: "",
                kind: vscodeMocks.QuickPickItemKind.Separator,
            });
            modifiedItems.push({
                label: "",
                kind: vscodeMocks.QuickPickItemKind.Separator,
            });
            modifiedItems.push({ label: "Add another landscape" });
            mockWindow
                .expects("showQuickPick")
                .withExactArgs(modifiedItems, {
                placeHolder: placeHolderText,
                ignoreFocusOut: true,
            })
                .resolves(modifiedItems[2]);
            const newConfig = (0, lodash_1.cloneDeep)(config);
            newConfig.push({ url: a.toString(), default: true });
            mockGetConfiguration
                .expects("get")
                .withExactArgs("sap-remote.landscape-name")
                .twice()
                .returns(mockConfig(newConfig));
            const modified = newConfig
                .map((con) => {
                delete con.default;
                return con;
            })
                .map((con) => {
                if (con.url === a.toString()) {
                    con.default = true;
                }
                return con;
            });
            const value = modified.map((item) => JSON.stringify(item)).join("|");
            mockGetConfiguration
                .expects("update")
                .withExactArgs("sap-remote.landscape-name", value, vscodeMocks.ConfigurationTarget.Global)
                .resolves();
            mockCommands
                .expects("executeCommand")
                .withExactArgs("local-extension.tree.refresh")
                .once();
            (0, chai_1.expect)(await landscapeModule.setDefaultLandscape()).to.be.true;
        });
    });
});
//# sourceMappingURL=landscape.cont.spec.js.map