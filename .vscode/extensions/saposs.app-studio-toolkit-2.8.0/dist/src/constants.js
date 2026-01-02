"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BAS_KEEP_ALIVE_FILE = exports.MAX_SESSION_TIME = exports.EXTEND_SESSION_TIMEOUT = exports.KEEP_ALIVE_TIMEOUT = exports.URI = exports.EXECUTE = exports.FILE = exports.SNIPPET = exports.COMMAND = void 0;
/* istanbul ignore next - coverage bug */
exports.COMMAND = "COMMAND";
/* istanbul ignore next - coverage bug */
exports.SNIPPET = "SNIPPET";
/* istanbul ignore next - coverage bug */
exports.FILE = "FILE";
/* istanbul ignore next - coverage bug */
exports.EXECUTE = "EXECUTE";
/* istanbul ignore next - coverage bug */
exports.URI = "URI";
// Constants for keep alive
/* istanbul ignore next - coverage bug */
exports.KEEP_ALIVE_TIMEOUT = 16 * 60 * 1000; // 16 minutes (in milliseconds)
/* istanbul ignore next - coverage bug */
exports.EXTEND_SESSION_TIMEOUT = 15 * 60; // 15 minutes (in seconds)
/* istanbul ignore next - coverage bug */
exports.MAX_SESSION_TIME = 2 * 60 * 60 * 1000; // 2 hours (in milliseconds)
/* istanbul ignore next - coverage bug */
exports.BAS_KEEP_ALIVE_FILE = "/home/user/.webide/keep-alive";
//# sourceMappingURL=constants.js.map