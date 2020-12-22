import { SSO_ACCESS_TOKEN, SSO_REFRESH_TOKEN, SSO_RELOAD_FLAG, SSO_REQUEST_FLAG } from './config';

export const allowMatching = (expectAllows, provide) => {
  const expectAllowArr = expectAllows.split(',');
  const provideArr = provide.split(',');
  const hasProvide = provideArr.some((r) => expectAllowArr.indexOf(r) >= 0);

  return hasProvide || expectAllowArr.some((r) => r === '*');
};

export function getAccessToken() {
  return localStorage.getItem(SSO_ACCESS_TOKEN);
}

export function getRefreshToken() {
  return localStorage.getItem(SSO_REFRESH_TOKEN);
}

export function getSSORequestFlag() {
  return localStorage.getItem(SSO_REQUEST_FLAG);
}

export function setSSORequestFlag(text) {
  return localStorage.setItem(SSO_REQUEST_FLAG, text);
}

export function clearSSORequestFlag() {
  return localStorage.removeItem(SSO_REQUEST_FLAG);
}

export function setSSOReloadFlag(text) {
  return localStorage.setItem(SSO_RELOAD_FLAG, text);
}

export function getSSOReloadFlag() {
  return localStorage.getItem(SSO_RELOAD_FLAG);
}

export function clearSSOReloadFlag() {
  return localStorage.removeItem(SSO_RELOAD_FLAG);
}
