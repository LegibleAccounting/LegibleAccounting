import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import Auth from '../api/Auth.js';
import UsersAPI from '../api/UsersApi.js';
import './UserForm.css';
import GroupsAPI from '../api/GroupsApi.js'

class UserForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToUsersPage: false,
            groupsList: []
        };

        if (this.props.match.params.id) {
            this.state.isLoading = true;
                UsersAPI.getOne(this.props.match.params.id)
                .then((user) => {
                    this.state.userModel = user;
                })
                .catch(() => {
                    alert('Failed to retrieve user information.');
                })
                .finally(() => {
                    this.setState({
                        isLoading: false
                    });
                });
        } else {
            this.state.isLoading = false;
            this.state.userModel = {
                first_name: '',
                last_name: '',
                username: '',
                last_login: '',
                is_active: false
            };
        }
        GroupsAPI.getAll()
            .then(data => {
                this.setState({
                    groupsList: data
                });
            });

        // Bind event handlers to class instance context.
        this.changeInputState = this.changeInputState.bind(this);
        this.submitUser = this.submitUser.bind(this);
    }

    render() {
        if (this.state.isLoading) {
            return <div>Loading...</div>;
        }

        if (this.state.redirectToUsersPage) {
            return <Redirect to="/users" />
        }

        return (
            <form className="userForm" onSubmit={this.submitUser}>
                <div className="titleBar">
                    <h1>{ this.state.userModel.id === undefined ? 'Add' : 'Edit' } User</h1>
                </div>
                <div className="row">
                    <div className="textColumn container">
                        User first_name
                    </div>
                    <div className="fieldColumn container">
                        <input type="text"
                          name="first_name"
                          className="form-control textBox"
                          placeholder="First Name"
                          value={this.state.userModel.first_name}
                          onChange={this.changeInputState} />
                    </div>
                </div>
                <div className="row">
                    <div className="textColumn container">
                        User last_name
                    </div>
                    <div className="fieldColumn container">
                        <input type="text"
                          name="last_name"
                          className="form-control textBox"
                          placeholder="Last Name"
                          value={this.state.userModel.last_name}
                          onChange={this.changeInputState} />
                    </div>
                </div>
                <div className="row">
                    <div className="textColumn container">
                        User username
                    </div>
                    <div className="fieldColumn container">
                        <input type="text"
                          name="username"
                          maxLength="30"
                          className="form-control textBox"
                          placeholder="username"
                          value={this.state.userModel.username}
                          onChange={this.changeInputState} />
                    </div>
                </div>
				<div className="row">
					<div className="textColumn container">
						User is_active
					</div>
					<div className="fieldColumn container">
						<input 	type="checkbox" 
								name="is_active"
								className="userActiveCheckBox"
                                checked={this.state.userModel.is_active}
								value={this.state.userModel.is_active}
                                disabled={ !Auth.currentUser.groups.find(group => group.name === 'Administrator') }
                                onChange={this.changeInputState} />
					</div>
                    <div className="row">
                        <div className="textColumn container">
                            User Group
                        </div>
                        <div className="fieldColumn container">
                            <select name="group" className="form-control textBox" value={this.state.userModel.groups} onChange={this.changeInputState}>
                                <option hidden>-- Select User Group --</option>
                                {
                                    Array.isArray(this.state.groupsList) && 
                                    this.state.groupsList.map((item, index) => (
                                        <option key={item.name} value={item.NAME}>{item.name} - {item.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
				</div>
				<div>
					<input type="submit" value={ this.state.userModel.id === undefined ? 'Create' : 'Update' } className="btn btn-primary createButton"/>
				</div>
        		<div className="fillSpace"></div>
				<div>
					<NavLink className="NavLink btn btn-primary newButton" to="/users">&lt; Back to Users</NavLink>
				</div>
            </form>
		);
    }

    changeInputState(event) {
        this.setState({
            userModel: Object.assign({}, this.state.userModel, {
                [event.target.name]: event.target.type === 'checkbox' ?
                    event.target.checked : event.target.value
            })
        });
    }

    submitUser(event) {
        event.preventDefault();

        let request = this.state.userModel.id === undefined ?
            UsersAPI.create(this.state.userModel) :
            UsersAPI.update(this.state.userModel);

        request
            .then(() => {
                this.props.onNotifySuccess(`Users ${this.state.userModel.id === undefined ? 'created' : 'updated' } successfully.`);

                this.setState({
                    redirectToUsersPage: true
                });
            })
            .catch(() => {
                this.props.onNotifyError(`Failed to ${this.state.userModel.id === undefined ? 'create' : 'update' } users.`);
            });
    }
  }

export default UserForm;
