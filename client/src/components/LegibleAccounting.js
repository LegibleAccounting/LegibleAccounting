import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Auth from '../api/Auth';

class LegibleAccounting extends Component {
  constructor(props) {
    super(props);

    this.state = {
        redirectToHome: false
    };

    this.requestLogout = this.requestLogout.bind(this);
  }

  render() {
    let destination = { pathname: '/' };
    if (this.state.redirectToHome) {
        return <Redirect to={destination} />;
    }

    return (
      <div>
        Welcome to LegibleAccounting!
        <button type="button" onClick={this.requestLogout}>Log Out</button>
      </div>
    );
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
