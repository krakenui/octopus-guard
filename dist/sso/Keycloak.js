"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initResumeFlow = exports.initBasicFlow = exports.logout = void 0;
var keycloak_js_1 = __importDefault(require("keycloak-js"));
var config_1 = require("../common/config");
var helper_1 = require("../common/helper");
var JwtToken_1 = require("./JwtToken");
function init() {
    var _instance = keycloak_js_1.default(config_1.SSO_INFO);
    return new Promise(function (resolve, reject) {
        _instance
            .init({
            onLoad: config_1.SSO_INFO.checkSSO,
            checkLoginIframe: false,
            silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
        })
            .then(function (auth) {
            if (auth) {
                var jwtToken = JwtToken_1.parseJwtToken(_instance.token);
                var username = jwtToken.userName;
                // Temporarily remove after @ part of email to avoid bug in BE
                if (username.includes("@")) {
                    username = username.split("@")[0];
                }
                localStorage.setItem(config_1.AUTH_USER_ROLES, jwtToken.roles);
                localStorage.setItem(config_1.AUTH_USER_NAME, username);
                localStorage.setItem(config_1.AUTH_USER_EMAIL, jwtToken.email);
                localStorage.setItem(config_1.AUTH_DISPLAY_NAME, jwtToken.displayName);
                localStorage.setItem(config_1.SSO_ACCESS_TOKEN, _instance.token);
                localStorage.setItem(config_1.SSO_REFRESH_TOKEN, _instance.refreshToken);
                resolve(true);
            }
            else {
                resolve(false);
            }
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
function login() {
    var _instance = keycloak_js_1.default(config_1.SSO_INFO);
    return new Promise(function (resolve, reject) {
        _instance
            .login({
            redirectUri: window.location.href,
        })
            .then(function () {
            resolve(true);
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
function refreshToken() {
    var _instance = keycloak_js_1.default(config_1.SSO_INFO);
    return new Promise(function (resolve, reject) {
        _instance
            .updateToken(60) // wait 60 seconds
            .then(function (refreshed) {
            if (refreshed) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })
            .catch(function (e) {
            reject(e);
        });
    });
}
function logout() {
    var redirectUri = config_1.SSO_INFO.redirectUri, url = config_1.SSO_INFO.url, realm = config_1.SSO_INFO.realm;
    var pathname = window.location.pathname;
    var currentUrl = redirectUri + "/" + pathname;
    return new Promise(function (resolve, reject) {
        // clear login informations
        localStorage.removeItem(config_1.AUTH_USER_ROLES);
        localStorage.removeItem(config_1.AUTH_DISPLAY_NAME);
        localStorage.removeItem(config_1.AUTH_USER_NAME);
        localStorage.removeItem(config_1.SSO_ACCESS_TOKEN);
        localStorage.removeItem(config_1.SSO_REFRESH_TOKEN);
        var realmUrl = url + "/realms/" + encodeURIComponent(realm);
        if (url.charAt(url.length - 1) === "/") {
            realmUrl = url + "realms/" + encodeURIComponent(realm);
        }
        var logoutUrl = realmUrl + "/protocol/openid-connect/logout?redirect_uri=" + encodeURIComponent(currentUrl);
        // redirect to logout url
        window.location.replace(logoutUrl);
        resolve(true);
    });
}
exports.logout = logout;
/**
 * Initial basic flow:
 *  * Check if token valid -> return by pass
 *  * If token is expired -> refresh token
 *  * If token not exist -> request login
 *  * If has flag login request -> call resume
 */
function initBasicFlow() {
    var token = helper_1.getAccessToken();
    if (token != null) {
        var jwtToken = JwtToken_1.parseJwtToken(token);
        // Check if token valid -> return by pass
        if (!JwtToken_1.tokenIsExpired(jwtToken)) {
            return Promise.resolve(true);
        }
        // If token is expired -> refresh token
        return refreshToken();
    }
    var requestFlag = helper_1.getSSORequestFlag();
    if (requestFlag == null) {
        // If token not exist -> request login
        return login();
    }
    // If has flag login request -> call resume
    return init();
}
exports.initBasicFlow = initBasicFlow;
/**
 * Initial resume flow:
 *  * Check if token valid -> return by pass
 *  * If token is expired -> refresh token
 *  * If token not exist -> return by pass
 *  * If has flag login request -> call resume
 */
function initResumeFlow() {
    var token = helper_1.getAccessToken();
    if (token != null) {
        var jwtToken = JwtToken_1.parseJwtToken(token);
        // Check if token valid -> return by pass
        if (!JwtToken_1.tokenIsExpired(jwtToken)) {
            return Promise.resolve(true);
        }
        // If token is expired -> refresh token
        return refreshToken();
    }
    var requestFlag = helper_1.getSSORequestFlag();
    if (requestFlag == null) {
        // If token not exist -> return by pass
        return Promise.resolve(false);
    }
    // If has flag login request -> call resume
    return init();
}
exports.initResumeFlow = initResumeFlow;
//# sourceMappingURL=Keycloak.js.map