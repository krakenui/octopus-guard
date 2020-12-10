export interface JwtToken {
    exp: number;
    azp: string;
    roles: string;
    displayName: string;
    email?: string;
    userName: string;
}
export declare function parseJwtToken(token: string): JwtToken;
export declare function tokenIsExpired(token: JwtToken): boolean;
