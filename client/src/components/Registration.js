import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Auth from '../api/Auth.js';

class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registered: false,
            userModel: {
                username: '',
                password: '',
                password2: ''
            }
        };

        // Bind event handlers to class instance context.
        this.changeInputState = this.changeInputState.bind(this);
        this.requestRegistration = this.requestRegistration.bind(this);
    }

    render() {
        if (this.state.registered) {
            return (
                <div className="Login">
                    <h1>Your registration request has been processed successfully.</h1>
                    <p>A system administrator will have to review your request before you may use the system.</p>
                    <NavLink style={{ 'color': 'white' }} to="/">Back to Homepage</NavLink>
                </div>
            );
        }
        return (
           <form className="Login" onSubmit={this.requestRegistration}>
              <h1 style={{ color: 'white' }}>Request Access</h1>
              <div className = "Spacer"> 
                  <input className = "input"
                  name="username"
                  placeholder = 'Username'
                  value={this.state.userModel.username} 
                  onChange={this.changeInputState} />
              </div>
              <div className = "Spacer"> 
                  <input className = "input"
                  name="password"
                  type="password" 
                  placeholder = 'Password'
                  value={this.state.userModel.password}
                  onChange={this.changeInputState} />
              </div>
              <div className = "Spacer"> 
                  <input className = "input"
                  name="password2"
                  type="password" 
                  placeholder = 'Repeat Password'
                  value={this.state.userModel.password2}
                  onChange={this.changeInputState} />
              </div>
              <div className = "Spacer">
                <button className ="button btn-primary" type = "submit">
                  Request Access
                </button>
              </div>
          </form>
        );
    }

    changeInputState(event) {
        let value;
        if (event.target.type === 'checkbox') {
            value = event.target.checked;
        } else if (event.target.type === 'select-multiple') {
            value = [...event.target.options]
                .filter(opt => opt.selected)
                .map(opt => opt.value);
        } else {
            value = event.target.value;
        }

        this.setState({
            userModel: Object.assign({}, this.state.userModel, {
                [event.target.name]: value
            })
        });
    }

    requestRegistration(event) {
        event.preventDefault();

        Auth.register(this.state.userModel)
            .then(() => {
                alert('Account Request submitted successfully.');
                this.setState({
                    registered: true
                });
            })
            .catch((response) => {
                let errorFields = Object.keys(response);
                if (!errorFields.length) {
                    alert('Failed to submit Account Request.');
                    return;
                }

                if (response.username && response.username.length) {
                  alert('Username: ' + response.username[0]);
                } else if (response.password && response.password.length) {
                  alert('Password: ' + response.password[0]);
                } else {
                  alert('Failed to submit Account Request.');
                }
            });
    }
}

export default Registration;
