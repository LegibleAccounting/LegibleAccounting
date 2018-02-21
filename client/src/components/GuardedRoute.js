/*
 * Adapted from https://reacttraining.com/react-router/web/example/auth-workflow
 */

import React from 'react';
import {Route, Redirect} from 'react-router-dom';

import Auth from '../api/Auth.js';

const GuardedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default GuardedRoute;
