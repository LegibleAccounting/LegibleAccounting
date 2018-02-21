import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';


import GuardedRoute from './GuardedRoute.js'
import Login from './Login.js';
import LegibleAccounting from './LegibleAccounting.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/login" component={Login} />
            <GuardedRoute path="/" component={LegibleAccounting} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
