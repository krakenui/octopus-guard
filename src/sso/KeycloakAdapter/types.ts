export interface KeycloakOptions {
  scope?: string;

  redirectUri?: string;

  url?: string;

  realm: string;

  clientId: string;

  maxAge?: number;

  loginHint?: string;
}
