import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import "./Login.css";
import Auth from '../api/Auth.js';
import logo from '../Ledgible_Accounting_Icon.png'
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        inputUsername: '',
        inputPassword: '',
        redirectToReferrer: Auth.isAuthenticated
    };

    this.updateUsernameState = this.updateUsernameState.bind(this);
    this.updatePasswordState = this.updatePasswordState.bind(this);
    this.requestLogin = this.requestLogin.bind(this);
  }

  render() {
    let referrer = this.props.location.state ? this.props.location.state.from : { pathname: '/' };
    if (this.state.redirectToReferrer) {
      return <Redirect to={referrer} />;
    }

    return (
      <div class="Login">
        <div class="login">
          <img src={logo} class="legible-accounting-logo"/>
          <form onSubmit={this.requestLogin}>
          <input class="username username-text-field background-color" type="text" value={this.inputUsername} onChange={this.updateUsernameState} placeholder="Username" />
          <input class="password password-text-field background-color" type="password" value={this.inputPassword} onChange={this.updatePasswordState} placeholder="Password" />
          <button class="login-button login-meta" type="submit">Log In</button>
          </form>
        </div> 
      </div>
    );
  }
  updateUsernameState(event) {
    this.setState({ inputUsername: event.target.value });
  }

  updatePasswordState(event) {
    this.setState({ inputPassword: event.target.value });
  }

  requestLogin(event) {
    event.preventDefault();
    Auth.authenticate(this.state.inputUsername, this.state.inputPassword)
      .then(() => {
        this.setState({ redirectToReferrer: true });
      })
      .catch(() => {
        alert('Failed to login.');
      });
  }
}

export default Login;
