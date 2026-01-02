"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const eventHeader_1 = require("../../src/telemetry/eventHeader");
describe("EventHeader", () => {
    const extensionName = "test-extension";
    const eventName = "test-event";
    let eventHeader;
    beforeEach(() => {
        eventHeader = new eventHeader_1.EventHeader(extensionName, eventName);
    });
    it("should correctly store and return the extension name", () => {
        (0, chai_1.expect)(eventHeader.getExtensionName()).to.equal(extensionName);
    });
    it("should correctly store and return the event name", () => {
        (0, chai_1.expect)(eventHeader.getEventName()).to.equal(eventName);
    });
    it("should return a correctly formatted string representation", () => {
        (0, chai_1.expect)(eventHeader.toString()).to.equal(`${extensionName}/${eventName}`);
    });
    it("should handle empty strings for extension and event names", () => {
        const emptyEventHeader = new eventHeader_1.EventHeader("", "");
        (0, chai_1.expect)(emptyEventHeader.getExtensionName()).to.equal("");
        (0, chai_1.expect)(emptyEventHeader.getEventName()).to.equal("");
        (0, chai_1.expect)(emptyEventHeader.toString()).to.equal("/");
    });
    it("should handle special characters in extension and event names", () => {
        const specialEventHeader = new eventHeader_1.EventHeader("ext@name", "event#123");
        (0, chai_1.expect)(specialEventHeader.toString()).to.equal("ext@name/event#123");
    });
});
//# sourceMappingURL=eventHeader.spec.js.map