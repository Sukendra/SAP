"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockUtil_1 = require("../mockUtil");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const bas_sdk_1 = require("@sap/bas-sdk");
var proxyExtensionKind;
(function (proxyExtensionKind) {
    proxyExtensionKind[proxyExtensionKind["UI"] = 1] = "UI";
    proxyExtensionKind[proxyExtensionKind["Workspace"] = 2] = "Workspace";
})(proxyExtensionKind || (proxyExtensionKind = {}));
const proxyEnv = {
    remoteName: undefined,
};
const proxyExtension = {
    getExtension: () => {
        throw new Error(`not implemented`);
    },
};
const proxyCommands = {
    executeCommand: () => {
        throw new Error(`not implemented`);
    },
};
const workspaceConfigurationMock = {
    update: () => "",
};
const proxyWorkspaceFs = {
    writeFile: () => Promise.resolve(),
};
const testVscode = {
    extensions: proxyExtension,
    env: proxyEnv,
    ExtensionKind: proxyExtensionKind,
    commands: proxyCommands,
    ConfigurationTarget: {
        Global: 1,
    },
    workspace: {
        getConfiguration: () => workspaceConfigurationMock,
        fs: proxyWorkspaceFs,
    },
    Uri: {
        file: () => "",
    },
    window: {
        withProgress: () => "",
    },
    ProgressLocation: { Notification: 15 },
};
(0, mockUtil_1.mockVscode)(testVscode, "dist/src/utils/bas-utils.js");
const bas_utils_1 = require("../../src/utils/bas-utils");
describe("bas-utils unit test", function () {
    let sandbox;
    let mockExtension;
    let mockCommands;
    let mockWorkspaceFs;
    before(() => {
        sandbox = (0, sinon_1.createSandbox)();
    });
    afterEach(() => {
        sandbox.restore();
    });
    beforeEach(() => {
        mockExtension = sandbox.mock(proxyExtension);
        mockCommands = sandbox.mock(proxyCommands);
        mockWorkspaceFs = sandbox.mock(proxyWorkspaceFs);
    });
    afterEach(() => {
        mockExtension.verify();
        mockCommands.verify();
        mockWorkspaceFs.verify();
    });
    const landscape = `https://my-landscape.test.com`;
    describe("shouldRunCtlServer scope", () => {
        it("shouldRunCtlServer, running locally, process.env.WS_BASE_URL is undefined", () => {
            sandbox.stub(process, `env`).value({});
            mockCommands
                .expects(`executeCommand`)
                .withExactArgs(`setContext`, `ext.runPlatform`, bas_utils_1.ExtensionRunMode.desktop)
                .resolves();
            (0, chai_1.expect)((0, bas_utils_1.shouldRunCtlServer)()).to.be.false;
        });
        it("shouldRunCtlServer, running through ssh-remote, process.env.WS_BASE_URL is defined", () => {
            sandbox.stub(process, `env`).value({ WS_BASE_URL: landscape });
            sandbox.stub(proxyEnv, `remoteName`).value(`ssh-remote`);
            mockCommands
                .expects(`executeCommand`)
                .withExactArgs(`setContext`, `ext.runPlatform`, bas_utils_1.ExtensionRunMode.basRemote)
                .resolves();
            (0, chai_1.expect)((0, bas_utils_1.shouldRunCtlServer)()).to.be.true;
        });
        it("shouldRunCtlServer, running personal-edition", () => {
            const devspaceMock = sandbox.mock(bas_sdk_1.devspace);
            devspaceMock.expects(`getBasMode`).returns(`personal-edition`);
            sandbox.stub(process, `env`).value({ WS_BASE_URL: landscape });
            sandbox.stub(proxyEnv, `remoteName`).value(undefined);
            mockCommands
                .expects(`executeCommand`)
                .withExactArgs(`setContext`, `ext.runPlatform`, bas_utils_1.ExtensionRunMode.desktop)
                .resolves();
            (0, chai_1.expect)((0, bas_utils_1.shouldRunCtlServer)()).to.be.true;
            devspaceMock.verify();
        });
        it("shouldRunCtlServer, running in BAS, extensionKind === 'Workspace'", () => {
            sandbox.stub(process, `env`).value({ WS_BASE_URL: landscape });
            sandbox.stub(proxyEnv, `remoteName`).value(landscape);
            mockExtension
                .expects(`getExtension`)
                .returns({ extensionKind: proxyExtensionKind.Workspace });
            mockCommands
                .expects(`executeCommand`)
                .withExactArgs(`setContext`, `ext.runPlatform`, bas_utils_1.ExtensionRunMode.basWorkspace)
                .resolves();
            (0, chai_1.expect)((0, bas_utils_1.shouldRunCtlServer)()).to.be.true;
        });
        it("shouldRunCtlServer, running in BAS, extensionKind === 'UI'", () => {
            sandbox.stub(process, `env`).value({ WS_BASE_URL: landscape });
            sandbox.stub(proxyEnv, `remoteName`).value(landscape);
            mockExtension
                .expects(`getExtension`)
                .returns({ extensionKind: proxyExtensionKind.UI });
            mockCommands
                .expects(`executeCommand`)
                .withExactArgs(`setContext`, `ext.runPlatform`, bas_utils_1.ExtensionRunMode.basUi)
                .resolves();
            (0, chai_1.expect)((0, bas_utils_1.shouldRunCtlServer)()).to.be.false;
        });
        it("shouldRunCtlServer, running in BAS, extension undefined", () => {
            sandbox.stub(process, `env`).value({ WS_BASE_URL: landscape });
            sandbox.stub(proxyEnv, `remoteName`).value(landscape);
            mockExtension.expects(`getExtension`).returns(undefined);
            mockCommands
                .expects(`executeCommand`)
                .withExactArgs(`setContext`, `ext.runPlatform`, bas_utils_1.ExtensionRunMode.unexpected)
                .resolves();
            (0, chai_1.expect)((0, bas_utils_1.shouldRunCtlServer)()).to.be.false;
        });
        it("shouldRunCtlServer, running locally through WSL, extension undefined", () => {
            sandbox.stub(process, `env`).value({});
            sandbox.stub(proxyEnv, `remoteName`).value("wsl");
            mockCommands
                .expects(`executeCommand`)
                .withExactArgs(`setContext`, `ext.runPlatform`, bas_utils_1.ExtensionRunMode.wsl)
                .resolves();
            (0, chai_1.expect)((0, bas_utils_1.shouldRunCtlServer)()).to.be.false;
        });
        it("shouldRunCtlServer, running locally through SSH, extension undefined", () => {
            sandbox.stub(process, `env`).value({});
            sandbox.stub(proxyEnv, `remoteName`).value("ssh-remote");
            mockCommands
                .expects(`executeCommand`)
                .withExactArgs(`setContext`, `ext.runPlatform`, bas_utils_1.ExtensionRunMode.unexpected)
                .resolves();
            (0, chai_1.expect)((0, bas_utils_1.shouldRunCtlServer)()).to.be.false;
        });
    });
    describe("getExtensionRunPlatform scope", () => {
        it("getExtensionRunPlatform, extensionId provided", () => {
            const extensionId = `testExtensionId`;
            sandbox.stub(process, `env`).value({ WS_BASE_URL: landscape });
            sandbox.stub(proxyEnv, `remoteName`).value(landscape);
            mockExtension
                .expects(`getExtension`)
                .returns({ extensionKind: proxyExtensionKind.UI })
                .calledWith(extensionId);
            (0, chai_1.expect)((0, bas_utils_1.getExtensionRunPlatform)(extensionId)).to.equal(bas_utils_1.ExtensionRunMode.basUi);
        });
        it("getExtensionRunPlatform, running in WSL", () => {
            sandbox.stub(process, `env`).value({});
            sandbox.stub(proxyEnv, `remoteName`).value("wsl");
            (0, chai_1.expect)((0, bas_utils_1.getExtensionRunPlatform)()).to.equal(bas_utils_1.ExtensionRunMode.wsl);
        });
        it("getExtensionRunPlatform, running locally", () => {
            sandbox.stub(process, `env`).value({});
            sandbox.stub(proxyEnv, `remoteName`).value(undefined);
            (0, chai_1.expect)((0, bas_utils_1.getExtensionRunPlatform)()).to.equal(bas_utils_1.ExtensionRunMode.desktop);
        });
    });
    describe("startBasKeepAlive", () => {
        beforeEach(() => {
            sandbox.stub(testVscode.Uri, `file`).resolves("test");
            sandbox.stub(process, "env").value({ WS_BASE_URL: landscape });
        });
        afterEach(() => {
            (0, bas_utils_1.cleanKeepAliveInterval)();
        });
        it("should not start if not in basRemote mode", () => {
            sandbox.stub(testVscode.env, "remoteName").value(undefined);
            mockWorkspaceFs.expects(`writeFile`).never();
            (0, bas_utils_1.startBasKeepAlive)();
        });
        it("should start if in basRemote mode", () => {
            sandbox.stub(testVscode.env, "remoteName").value("ssh-remote");
            mockWorkspaceFs.expects(`writeFile`).once().resolves();
            (0, bas_utils_1.startBasKeepAlive)();
        });
        it("should clear existing interval before starting a new one", () => {
            sandbox.stub(testVscode.env, "remoteName").value("ssh-remote");
            const clearIntervalSpy = sandbox.spy(global, "clearInterval");
            mockWorkspaceFs.expects(`writeFile`).twice().resolves();
            (0, bas_utils_1.startBasKeepAlive)();
            (0, bas_utils_1.startBasKeepAlive)();
            (0, chai_1.expect)(clearIntervalSpy.called).to.be.true;
        });
        it("should handle errors in touchFile", () => {
            sandbox.stub(testVscode.env, "remoteName").value("ssh-remote");
            mockWorkspaceFs
                .expects(`writeFile`)
                .once()
                .rejects(new Error("Test error"));
            (0, bas_utils_1.startBasKeepAlive)();
        });
    });
    describe("internal functions", () => {
        let clock;
        beforeEach(() => {
            clock = (0, sinon_1.useFakeTimers)();
        });
        afterEach(() => {
            clock.restore();
        });
        it("formatTimeRemaining should format time correctly", () => {
            (0, chai_1.expect)(bas_utils_1.internal.formatTimeRemaining(90)).to.equal("1:30");
            (0, chai_1.expect)(bas_utils_1.internal.formatTimeRemaining(60)).to.equal("1:00");
            (0, chai_1.expect)(bas_utils_1.internal.formatTimeRemaining(59)).to.equal("0:59");
        });
        it("askToSessionExtend should resolve true on cancellation", async () => {
            const progressStub = sandbox
                .stub(testVscode.window, "withProgress")
                .callsFake(((options, task) => {
                const token = {
                    onCancellationRequested: (callback) => callback(),
                };
                return task({ report: () => { } }, token);
            }));
            const result = await bas_utils_1.internal.askToSessionExtend();
            (0, chai_1.expect)(result).to.be.true;
            (0, chai_1.expect)(progressStub.calledOnce).to.be.true;
        });
    });
});
//# sourceMappingURL=bas-utils.spec.js.map