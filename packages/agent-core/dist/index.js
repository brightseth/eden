"use strict";
// Agent Core Types - Canonical domain models for Eden2
Object.defineProperty(exports, "__esModule", { value: true });
exports.CohortStatus = exports.AgentStatus = void 0;
// Status enums for better type safety
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["ACTIVE"] = "active";
    AgentStatus["INACTIVE"] = "inactive";
    AgentStatus["DEVELOPING"] = "developing";
})(AgentStatus || (exports.AgentStatus = AgentStatus = {}));
var CohortStatus;
(function (CohortStatus) {
    CohortStatus["ACTIVE"] = "active";
    CohortStatus["ARCHIVED"] = "archived";
})(CohortStatus || (exports.CohortStatus = CohortStatus = {}));
