"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var prop_types_1 = __importDefault(require("prop-types"));
var react_1 = __importDefault(require("react"));
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var common_1 = require("./common");
var SafeRoute = function (_a) {
    var exact = _a.exact, path = _a.path, render = _a.render, Component = _a.component, roles = _a.roles;
    var userRoles = react_redux_1.useSelector(function (state) { return state.user; }).roles;
    var dispatch = react_redux_1.useDispatch();
    if (userRoles == null) {
        // user not logged in
        return dispatch({ type: common_1.SSO_LOGIN_AUTHEN_ACTION, payload: { path: path } });
    }
    if (!common_1.allowMatching(roles, userRoles || "")) {
        // user not have required role
        return dispatch({ type: common_1.SSO_LOGIN_AUTHOR_ACTION, payload: { path: path, roles: roles } });
    }
    var routeRender = function (matchProps) { return (render ? render(matchProps) : <Component {...matchProps}/>); };
    if (exact) {
        return <react_router_dom_1.Route exact path={path} render={routeRender}/>;
    }
    return <react_router_dom_1.Route path={path} render={routeRender}/>;
};
SafeRoute.propTypes = {
    exact: prop_types_1.default.bool,
    path: prop_types_1.default.string,
    render: function (props) { return react_1.default.ReactNode; },
    component: react_1.default.Component,
    roles: prop_types_1.default.string
};
exports.default = SafeRoute;
//# sourceMappingURL=SafeRoute.js.map