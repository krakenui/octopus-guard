import axios from 'axios';
import Keycloak from 'keycloak-js';

import {
  AUTH_DISPLAY_NAME,
  AUTH_USER_EMAIL,
  AUTH_USER_NAME,
  AUTH_USER_ROLES,
  SSO_ACCESS_TOKEN,
  SSO_INFO,
  SSO_REFRESH_TOKEN,
} from '../common/config';
import {
  clearSSOReloadFlag,
  clearSSORequestFlag,
  getAccessToken,
  getRefreshToken,
  getSSOReloadFlag,
  getSSORequestFlag,
  setSSOReloadFlag,
  setSSORequestFlag,
} from '../common/helper';
import { parseJwtToken, tokenIsExpired } from './JwtToken';
import { createLoginUrl, createLogoutUrl, createTokenUrl } from './KeycloakAdapter';

const LOAD_CHECK_SSO = 'check-sso';
// refs: https://github.com/keycloak/keycloak-documentation/blob/master/securing_apps/topics/oidc/javascript-adapter.adoc

function checkSSO(): Promise<boolean> {
  let _instance = Keycloak(SSO_INFO);

  return new Promise((resolve, reject) => {
    _instance
      .init({
        onLoad: LOAD_CHECK_SSO,
        silentCheckSsoRedirectUri: SSO_INFO.silentCheckSsoRedirectUri,
      })
      .then((auth) => {
        if (auth) {
          const jwtToken = parseJwtToken(_instance.token);
          let username = jwtToken.userName;
          // Temporarily remove after @ part of email to avoid bug in BE
          if (username.includes('@')) {
            username = username.split('@')[0];
          }

          localStorage.setItem(AUTH_USER_ROLES, jwtToken.roles);
          localStorage.setItem(AUTH_USER_NAME, username);
          localStorage.setItem(AUTH_USER_EMAIL, jwtToken.email);
          localStorage.setItem(AUTH_DISPLAY_NAME, jwtToken.displayName);
          localStorage.setItem(SSO_ACCESS_TOKEN, _instance.token);
          localStorage.setItem(SSO_REFRESH_TOKEN, _instance.refreshToken);

          clearSSORequestFlag();
          setSSOReloadFlag(Date.now());

          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function login(): Promise<boolean> {
  const loginUrl = createLoginUrl(SSO_INFO);
  // marked client wait login redirect
  // from keycloak server
  setSSORequestFlag(Date.now());
  window.location.replace(loginUrl);

  return Promise.resolve(true);
}

function logout() {
  // clean login info
  localStorage.removeItem(AUTH_USER_ROLES);
  localStorage.removeItem(AUTH_DISPLAY_NAME);
  localStorage.removeItem(AUTH_USER_NAME);
  localStorage.removeItem(SSO_ACCESS_TOKEN);
  localStorage.removeItem(SSO_REFRESH_TOKEN);

  const logoutUrl = createLogoutUrl(SSO_INFO);
  clearSSORequestFlag();
  window.location.replace(logoutUrl);
}

function refreshToken() {
  const { clientId } = SSO_INFO;
  const refreshTokenUrl = createTokenUrl(SSO_INFO);
  const rfToken = getRefreshToken();

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('client_id', clientId);
  params.append('refresh_token', rfToken);

  return axios
    .post(refreshTokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((token) => {
      localStorage.setItem(SSO_ACCESS_TOKEN, token.data.access_token);
      localStorage.setItem(SSO_REFRESH_TOKEN, token.data.refresh_token);

      return token.data.access_token;
    });
}

/**
 * Initial basic flow:
 *  * Check if token valid -> return by pass
 *  * If token is expired -> refresh token
 *  * If token not exist -> request login
 *  * If has flag login request -> call resume check sso
 */
function initBasicFlow(): Promise<boolean> {
  const token = getAccessToken();
  if (token != null) {
    const jwtToken = parseJwtToken(token);

    // Check if token valid -> return by pass
    if (!tokenIsExpired(jwtToken)) {
      return Promise.resolve(true);
    }

    // If token is expired -> refresh token
    return refreshToken();
  }

  const requestFlag = getSSORequestFlag();
  if (requestFlag == null) {
    // If token not exist -> request login
    return login();
  }

  // If has flag login request -> call resume check sso
  return checkSSO();
}

/**
 * Initial resume flow:
 *  * Check if token valid -> return by pass
 *  * If token is expired -> refresh token
 *  * If token not exist -> return by pass
 *  * If has flag login request -> call resume check sso
 */
function initResumeFlow(): Promise<boolean> {
  const token = getAccessToken();
  if (token != null) {
    const jwtToken = parseJwtToken(token);

    // Check if token valid -> return by pass
    if (!tokenIsExpired(jwtToken)) {
      return Promise.resolve(true);
    }

    // If token is expired -> refresh token
    return refreshToken();
  }

  const requestFlag = getSSORequestFlag();
  if (requestFlag == null) {
    // If token not exist -> return by pass
    return Promise.resolve(false);
  }

  // If has flag login request -> call resume check sso
  return checkSSO();
}

function enforceReload() {
  if (getSSOReloadFlag() != null) {
    clearSSOReloadFlag();
    window.location.reload();
  }
}

export { login, logout, refreshToken, initBasicFlow, initResumeFlow, enforceReload };
