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
const chai_1 = require("chai");
const sshModule = __importStar(require("../../src/tunnel/ssh"));
describe("ssh unit test", () => {
    describe("closeSessions", () => {
        const ssh = sshModule;
        beforeEach(() => {
            ssh.internal.sessionMap.clear();
        });
        it("closeSession, empty sessions", () => {
            ssh.closeSessions();
            (0, chai_1.expect)(ssh.internal.sessionMap.size).to.equal(0);
        });
        it("closeSession, without args", () => {
            ssh.internal.sessionMap.set("server-1", {
                close: () => { },
            });
            ssh.internal.sessionMap.set("server-2", {
                close: () => { },
            });
            ssh.closeSessions();
            (0, chai_1.expect)(ssh.internal.sessionMap.size).to.equal(0);
        });
        it("closeSession, specific sessions provided", () => {
            ssh.internal.sessionMap.set("server-1", {
                close: () => { },
            });
            ssh.internal.sessionMap.set("server-2", {
                close: () => { },
            });
            ssh.internal.sessionMap.set("server-3", {
                close: () => { },
            });
            ssh.closeSessions(["server-1", "server-3"]);
            (0, chai_1.expect)(ssh.internal.sessionMap.size).to.equal(1);
            (0, chai_1.expect)(ssh.internal.sessionMap.has("server-2")).to.be.true;
        });
    });
});
//# sourceMappingURL=ssh.spec.js.map