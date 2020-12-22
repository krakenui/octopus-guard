import { createUUID } from '../../common';
import { KeycloakOptions } from './types';

export function createLoginUrl(options: KeycloakOptions) {
  let { redirectUri, url, realm, scope, clientId, maxAge, loginHint } = options;
  const state = createUUID();
  const nonce = createUUID();

  const baseUrl = url + '/realms' + realm + '/protocol/openid-connect/auth';
  if (scope == null) {
    scope = 'openid';
  }

  const loginUrl =
    baseUrl +
    '?client_id=' +
    encodeURIComponent(clientId) +
    '&redirect_uri=' +
    encodeURIComponent(redirectUri) +
    '&state=' +
    encodeURIComponent(state) +
    '&response_mode=fragment' +
    '&response_type=code' +
    '&scope=' +
    encodeURIComponent(scope) +
    '&nonce=' +
    encodeURIComponent(nonce) +
    '&max_age=' +
    encodeURIComponent(maxAge) +
    '&login_hint=' +
    encodeURIComponent(loginHint);

  return loginUrl;
}

export function createLogoutUrl(options: KeycloakOptions) {
  let { redirectUri, url, realm } = options;

  const baseUrl = url + '/realms' + realm + '/protocol/openid-connect/logout';
  const logoutUrl = baseUrl + '?redirect_uri=' + encodeURIComponent(redirectUri);

  return logoutUrl;
}

export function createTokenUrl(options: KeycloakOptions) {
  let { url, realm } = options;
  const tokenUrl = url + '/realms' + realm + '/protocol/openid-connect/token';

  return tokenUrl;
}
