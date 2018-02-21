import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {Grid, Row, Col} from 'react-bootstrap';

import Dashboard from './Dashboard.js';
import ChartOfAccounts from './ChartOfAccounts.js';
import Accounts from './Accounts.js';
import Logs from './Logs.js';
import Sidebar from './Sidebar';
import Auth from '../api/Auth';
import './LegibleAccounting.css';

class LegibleAccounting extends Component {
  constructor(props) {
    super(props);

    this.state = {
        redirectToHome: false,
        isLoadingCurrentUser: true,
        currentUser: null
    };

    this.requestLogout = this.requestLogout.bind(this);
    this.getCurrentUser();
  }

  render() {
    let destination = { pathname: '/login' };
    if (this.state.redirectToHome) {
        return <Redirect to={destination} />;
    }

    return (
      <div className="LegibleAccounting">
        <Grid fluid>
          <Row>
            <Col xs={12} sm={4} md={3}>
              <Sidebar isLoading={this.state.isLoadingCurrentUser} currentUser={this.state.currentUser} onRequestLogout={this.requestLogout}>
              </Sidebar>
            </Col>
            <Col xs={12} sm={8} md={9} className="overflow-container">
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/chart-of-accounts" component={ChartOfAccounts} />
              <Route exact path="/accounts" component={Accounts} />
              <Route exact path="/logs" component={Logs} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

  getCurrentUser() {
    Auth.get()
      .then(currentUser => {
        this.setState({
          isLoadingCurrentUser: false,
          currentUser
        });
      });
  }

  requestLogout(event) {
    event.preventDefault();
    Auth.deAuthenticate()
        .then(() => {
            this.setState({ redirectToHome: true });
        })
        .catch(() => {
            alert('Failed to logout.');
        });
  }
}

export default LegibleAccounting;
