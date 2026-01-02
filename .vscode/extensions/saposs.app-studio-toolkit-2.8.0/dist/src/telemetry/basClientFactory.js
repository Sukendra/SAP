"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASClientFactory = void 0;
const basTelemetryClient_1 = require("./basTelemetryClient");
class BASClientFactory {
    static getBASTelemetryClient(extensionId, extensionVersion) {
        const key = `${extensionId}-${extensionVersion}`;
        if (!BASClientFactory.basTelemetryClientsMap.has(key)) {
            BASClientFactory.basTelemetryClientsMap.set(key, new basTelemetryClient_1.BASTelemetryClient(extensionId, extensionVersion));
        }
        return BASClientFactory.basTelemetryClientsMap.get(key);
    }
}
exports.BASClientFactory = BASClientFactory;
BASClientFactory.basTelemetryClientsMap = new Map();
//# sourceMappingURL=basClientFactory.js.map