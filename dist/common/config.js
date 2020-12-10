"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSO_INFO = exports.SSO_LOGIN_AUTHOR_ACTION = exports.SSO_LOGIN_AUTHEN_ACTION = exports.AUTH_USER_NAME = exports.AUTH_USER_ROLES = exports.AUTH_USER_EMAIL = exports.AUTH_DISPLAY_NAME = exports.SSO_REQUEST_FLAG = exports.SSO_REFRESH_TOKEN = exports.SSO_ACCESS_TOKEN = void 0;
exports.SSO_ACCESS_TOKEN = "access_token";
exports.SSO_REFRESH_TOKEN = "refresh_token";
exports.SSO_REQUEST_FLAG = "kc_";
exports.AUTH_DISPLAY_NAME = "auth_user_name";
exports.AUTH_USER_EMAIL = "auth_user_email";
exports.AUTH_USER_ROLES = "auth_user_roles";
exports.AUTH_USER_NAME = "auth_user_name";
exports.SSO_LOGIN_AUTHEN_ACTION = "sso_login_authen_action";
exports.SSO_LOGIN_AUTHOR_ACTION = "sso_login_author_action";
exports.SSO_INFO = {
    url: process.env.REACT_APP_SSO_URL,
    redirectUri: process.env.REACT_APP_SSO_REDIRECT_URI,
    realm: process.env.REACT_APP_SSO_REALM,
    clientId: process.env.REACT_APP_SSO_CLIENT_ID,
    onLoad: process.env.REACT_APP_SSO_ON_LOAD,
    checkSSO: process.env.REACT_APP_SSO_CHECK_SSO,
    "enable-cors": process.env.REACT_APP_SSO_ENABLE_CORS,
    checkLoginIframeInterval: parseInt(process.env.REACT_APP_SSO_CHECK_LOGIN_INTERVAL, 10),
};
//# sourceMappingURL=config.js.map