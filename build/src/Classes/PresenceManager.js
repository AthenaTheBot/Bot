"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PrecenceManager {
    constructor(client, intervalAmount) {
        this.client = client;
        if (intervalAmount) {
            this.intervalAmount = intervalAmount;
        }
        else {
            this.intervalAmount = 5 * 60 * 1000;
        }
    }
    setPresence(activities) {
        var _a;
        (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
            status: "online",
            afk: false,
            activities: activities,
        });
        setInterval(() => {
            var _a;
            (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
                status: "online",
                afk: false,
                activities: activities,
            });
        }, this.intervalAmount);
    }
}
exports.default = PrecenceManager;
