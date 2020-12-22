import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router-dom';

import { allowMatching, SSO_LOGIN_AUTHEN_ACTION, SSO_LOGIN_AUTHOR_ACTION } from '../common';

const SafeRoute = ({ exact, path, render, component: Component, roles }) => {
    const { roles: userRoles } = useSelector(state => state.user);
    const dispatch = useDispatch();

    if (userRoles == null) {
        // user not logged in
        return dispatch({ type: SSO_LOGIN_AUTHEN_ACTION, payload: { path } });
    }

    if (!allowMatching(roles, userRoles || "")) {
        // user not have required role
        return dispatch({ type: SSO_LOGIN_AUTHOR_ACTION, payload: { path, roles } });
    }

    const routeRender = (matchProps) => (render ? render(matchProps) : <Component {...matchProps} />);

    if (exact) {
        return <Route exact path={path} render={routeRender} />;
    }

    return <Route path={path} render={routeRender} />;
};

SafeRoute.propTypes = {
    exact?: PropTypes.bool,
    path: PropTypes.string,
    render?: (props) => React.ReactNode,
    component?: React.Component,
    roles?: PropTypes.string
};

export default SafeRoute;
