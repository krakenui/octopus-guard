import axios from 'axios';
import Keycloak, { KeycloakOnLoad } from 'keycloak-js';

import {
  AUTH_DISPLAY_NAME,
  AUTH_USER_EMAIL,
  AUTH_USER_NAME,
  AUTH_USER_ROLES,
  SSO_ACCESS_TOKEN,
  SSO_INFO,
  SSO_REFRESH_TOKEN,
} from '../common/config';
import { getAccessToken, getRefreshToken, getSSORequestFlag } from '../common/helper';
import { parseJwtToken, tokenIsExpired } from './JwtToken';

function init(): Promise<boolean> {
  let _instance = Keycloak(SSO_INFO);

  return new Promise((resolve, reject) => {
    _instance
      .init({
        onLoad: SSO_INFO.checkSSO as KeycloakOnLoad,
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
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
  let _instance = Keycloak(SSO_INFO);

  return new Promise((resolve, reject) => {
    _instance
      .login({
        redirectUri: window.location.href,
      })
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function refreshToken() {
  const { url, realm, clientId } = SSO_INFO;
  const requestUrl = `${url}/realms/${realm}/protocol/openid-connect/token`;
  const rfToken = getRefreshToken();
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('client_id', clientId);
  params.append('refresh_token', rfToken);

  return axios
    .post(requestUrl, params, {
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

export function logout(): Promise<boolean> {
  const { redirectUri, url, realm } = SSO_INFO;
  const pathname = window.location.pathname;
  const currentUrl = redirectUri + '/' + pathname;

  return new Promise((resolve, reject) => {
    // clear login informations
    localStorage.removeItem(AUTH_USER_ROLES);
    localStorage.removeItem(AUTH_DISPLAY_NAME);
    localStorage.removeItem(AUTH_USER_NAME);
    localStorage.removeItem(SSO_ACCESS_TOKEN);
    localStorage.removeItem(SSO_REFRESH_TOKEN);

    let realmUrl = url + '/realms/' + encodeURIComponent(realm);
    if (url.charAt(url.length - 1) === '/') {
      realmUrl = url + 'realms/' + encodeURIComponent(realm);
    }

    const logoutUrl = realmUrl + '/protocol/openid-connect/logout?redirect_uri=' + encodeURIComponent(currentUrl);

    // redirect to logout url
    window.location.replace(logoutUrl);
    resolve(true);
  });
}

/**
 * Initial basic flow:
 *  * Check if token valid -> return by pass
 *  * If token is expired -> refresh token
 *  * If token not exist -> request login
 *  * If has flag login request -> call resume
 */
export function initBasicFlow(): Promise<boolean> {
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

  // If has flag login request -> call resume
  return init();
}

/**
 * Initial resume flow:
 *  * Check if token valid -> return by pass
 *  * If token is expired -> refresh token
 *  * If token not exist -> return by pass
 *  * If has flag login request -> call resume
 */
export function initResumeFlow(): Promise<boolean> {
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

  // If has flag login request -> call resume
  return init();
}
