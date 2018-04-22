import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastr';
import {Grid, Row, Col} from 'react-bootstrap';

import DecorateRoute from './DecorateRoute.js';
import GuardedAdministratorPermissionsRoute from './GuardedAdministratorPermissionsRoute.js';
import GuardedManagerPermissionsRoute from './GuardedManagerPermissionsRoute.js';
import GuardedManagerOrAccountantPermissionsRoute from './GuardedManagerOrAccountantPermissionsRoute.js';
import Dashboard from './Dashboard.js';
import ChartOfAccounts from './ChartOfAccounts.js';
import AccountForm from './AccountForm.js';
import UserForm from './UserForm.js';
import AddToChartOfAccounts from './AddToChartOfAccounts.js';
import Accounts from './Accounts.js';
import Users from './Users.js'
import AccountLedger from './AccountLedger.js';
import Logs from './Logs.js';
import GeneralJournal from './GeneralJournal.js';
import Sidebar from './Sidebar';
import Auth from '../api/Auth';
import './LegibleAccounting.css';
import GeneralJournalEntry from './GeneralJournalEntry.js';
import TrialBalance from './TrialBalance.js';
import IncomeStatement from './IncomeStatement.js';
import BalanceSheet from './BalanceSheet.js';
import RetainedEarningsStatement from './RetainedEarningsStatement.js';

class LegibleAccounting extends Component {
  constructor(props) {
    super(props);

    this.state = {
        redirectToHome: false,
        isLoadingCurrentUser: true,
        currentUser: null
    };

    this.toastr = null;

    this.requestLogout = this.requestLogout.bind(this);
    this.notifyProps = {
      onNotifySuccess: this.notifySuccess.bind(this),
      onNotifyError: this.notifyError.bind(this)
    };

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
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/chart-of-accounts" component={ChartOfAccounts} />
                <GuardedAdministratorPermissionsRoute exact path="/chart-of-accounts/add" component={DecorateRoute(AddToChartOfAccounts, this.notifyProps)} />
                <Route exact path="/accounts" component={Accounts} />
                <GuardedAdministratorPermissionsRoute exact path="/accounts/add" component={DecorateRoute(AccountForm, this.notifyProps)} />
                <Route path="/accounts/:id/ledger" component={AccountLedger} />
                <GuardedManagerPermissionsRoute path="/accounts/:id" component={DecorateRoute(AccountForm, this.notifyProps)} />
                <GuardedAdministratorPermissionsRoute exact path="/users" component={Users} />
                <GuardedAdministratorPermissionsRoute exact path="/users/add" component={DecorateRoute(UserForm, this.notifyProps)} />
                <GuardedAdministratorPermissionsRoute path="/users/:id" component={DecorateRoute(UserForm, this.notifyProps)} />
                <GuardedAdministratorPermissionsRoute exact path="/logs" component={Logs} />
                <GuardedManagerOrAccountantPermissionsRoute exact path="/general-journal" component={DecorateRoute(GeneralJournal, this.notifyProps)} />
                <GuardedManagerOrAccountantPermissionsRoute path="/general-journal/:id" component={DecorateRoute(GeneralJournalEntry, this.notifyProps)}/>
                <GuardedManagerOrAccountantPermissionsRoute exact path="/trial-balance" component={TrialBalance} />
                <GuardedManagerOrAccountantPermissionsRoute exact path="/income-statement" component={IncomeStatement} />
                <GuardedManagerOrAccountantPermissionsRoute eaact path="/balance-sheet" component={BalanceSheet} />
                <GuardedManagerOrAccountantPermissionsRoute exact path="/retained-earnings-statement" component={RetainedEarningsStatement} />
              </Switch>
            </Col>
          </Row>
        </Grid>
        <ToastContainer ref={ ref => this.toastr = ref } className="toast-bottom-right" />
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

  notifySuccess(message) {
    this.toastr.success(message, null, {
      closeButton: true,
      showAnimation: 'animated fadeIn',
      hideAnimation: 'animated fadeOut'
    });
  }

  notifyError(message) {
    this.toastr.error(message, null, {
      closeButton: true,
      showAnimation: 'animated fadeIn',
      hideAnimation: 'animated fadeOut'
    });
  }
}

export default LegibleAccounting;
