import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import GuardedRoute from './GuardedRoute.js'
import Login from './Login.js';
import LegibleAccounting from './LegibleAccounting.js';

import logo from '../logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Login} />
          <GuardedRoute exact path="/home" component={LegibleAccounting} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
