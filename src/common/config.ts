export const SSO_ACCESS_TOKEN = "access_token";
export const SSO_REFRESH_TOKEN = "refresh_token";
export const SSO_REQUEST_FLAG = "kc_";

export const AUTH_DISPLAY_NAME = "auth_user_name";
export const AUTH_USER_EMAIL = "auth_user_email";
export const AUTH_USER_ROLES = "auth_user_roles";
export const AUTH_USER_NAME = "auth_user_name";

export const SSO_LOGIN_AUTHEN_ACTION = "sso_login_authen_action";
export const SSO_LOGIN_AUTHOR_ACTION = "sso_login_author_action";

export const SSO_INFO = {
  url: process.env.REACT_APP_SSO_URL,
  redirectUri: process.env.REACT_APP_SSO_REDIRECT_URI,
  realm: process.env.REACT_APP_SSO_REALM,
  clientId: process.env.REACT_APP_SSO_CLIENT_ID,
  onLoad: process.env.REACT_APP_SSO_ON_LOAD,
  checkSSO: process.env.REACT_APP_SSO_CHECK_SSO,
  "enable-cors": process.env.REACT_APP_SSO_ENABLE_CORS,
  checkLoginIframeInterval: parseInt(process.env.REACT_APP_SSO_CHECK_LOGIN_INTERVAL, 10),
};
