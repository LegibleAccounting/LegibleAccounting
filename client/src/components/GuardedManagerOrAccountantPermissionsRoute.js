/*
 * Adapted from https://reacttraining.com/react-router/web/example/auth-workflow
 */

import React from 'react';
import {Route, Redirect} from 'react-router-dom';

import Auth from '../api/Auth.js';

const GuardedManagerOrAccountantPermissionRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (Auth.currentUserIsManager() || Auth.currentUserIsAccountant()) ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default GuardedManagerOrAccountantPermissionRoute;
