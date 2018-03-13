import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import "./Login.css";
import Auth from '../api/Auth.js';
import logo from '../logo.png'
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
    let referrer = this.props.location.state ? this.props.location.state.from : { pathname: '/chart-of-accounts' };
    if (this.state.redirectToReferrer) {
      return <Redirect to={referrer} />;
    }

    return (
       <form className="Login" onSubmit={this.requestLogin}>
          <div className = "Spacer">
            <img className ="Login-logo" alt="" src={logo} />
          </div>
          <div className = "Spacer"> 
              <input className = "input"
              placeholder = 'Username'
              value={this.inputUsername} 
              onChange={this.updateUsernameState} />
          </div>
          <div className = "Spacer"> 
              <input className = "input"
              type="password" 
              placeholder = 'Password'
              value={this.inputPassword}
              onChange={this.updatePasswordState} />
          </div>
          <div className = "Spacer">
            <button className ="button btn-primary" type = "submit">
              Login
            </button>
          </div>
      </form>
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
