# octopus-guard

[![NPM version][npm-image]][npm-url] [![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/octopus-guard.svg?style=flat-square
[npm-url]: http://npmjs.org/package/octopus-guard
[download-image]: https://img.shields.io/npm/dm/octopus-guard.svg?style=flat-square
[download-url]: https://npmjs.org/package/octopus-guard

## Install

[![octopus-guard](https://nodei.co/npm/octopus-guard.png)](https://npmjs.org/package/octopus-guard)

```
npm install --save octopus-guard
```

## Features

```
- Define interface wrap for entity
- Define common dbcontext
- Define db connect hub
- Define base repository with repository pattern
```

## Install

- Before install require packages:

```
npm install react@^16.12.0
npm install react-dom@^16.12.0
npm install react-redux@^7.1.3
npm install react-router-dom@^5.1.2
npm install redux@^4.0.5"
```

- Install octopus-guard

```
npm install octopus-guard
```

## How it work

#### Safe router

- Require Redux reducers:

Authentication reducer: `sso_login_authen_action`, payload: `{path: string}`
Authorization reducer: `sso_login_author_action`, payload: `{path: string, roles: string}`

- Using:

```
import { SafeRoute } from "octopus-guard";

 <SafeRoute roles={"admin"} path={`/admin/credit-management`} component={() => import("./Admin/CreditManagement")} />
```

#### Keycloak SSO integrate

- Basic flow:

```
Initial basic flow:
 * Check if token valid -> return by pass
 * If token is expired -> refresh token
 * If token not exist -> request login
 * If has flag login request -> call resume check sso
```

Using:

```
import { initBasicFlow, enforceReload } from "octopus-guard";

initBasicFlow().then(() => {enforceReload();}).catch();
```

- Resume flow:

```
Initial resume flow:
 * Check if token valid -> return by pass
 * If token is expired -> refresh token
 * If token not exist -> return by pass
 * If has flag login request -> call resume check sso
```

Using:

```
import { initResumeFlow, enforceReload } from "octopus-guard";

initResumeFlow().then(() => {enforceReload();}).catch();
```

- Request login

```
import { login } from "octopus-guard";

login().then().catch();
```

- Request logout

```
import { logout } from "octopus-guard";

logout().then().catch();
```

- Request refresh token

```
import { refreshToken } from "octopus-guard";

refreshToken().then().catch();
```
