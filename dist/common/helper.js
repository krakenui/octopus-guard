"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSSORequestFlag = exports.getAccessToken = exports.allowMatching = void 0;
var config_1 = require("./config");
exports.allowMatching = function (expectAllows, provide) {
    var expectAllowArr = expectAllows.split(",");
    var provideArr = provide.split(",");
    var hasProvide = provideArr.some(function (r) { return expectAllowArr.indexOf(r) >= 0; });
    return hasProvide || expectAllowArr.some(function (r) { return r === "*"; });
};
function getAccessToken() {
    return localStorage.getItem(config_1.SSO_ACCESS_TOKEN);
}
exports.getAccessToken = getAccessToken;
function getSSORequestFlag() {
    return localStorage.getItem(config_1.SSO_REQUEST_FLAG);
}
exports.getSSORequestFlag = getSSORequestFlag;
//# sourceMappingURL=helper.js.map