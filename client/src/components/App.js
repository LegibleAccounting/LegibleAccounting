import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';


import GuardedAuthRoute from './GuardedAuthRoute.js';
import Login from './Login.js';
import Registration from './Registration.js';
import LegibleAccounting from './LegibleAccounting.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Registration} />
            <GuardedAuthRoute path="/" component={LegibleAccounting} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
