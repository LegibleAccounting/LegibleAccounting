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
                        user.groups = user.groups.map(group => group.id);
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
                username: '',
                is_active: false,
                groups: []
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
            <form className="form-horizontal" onSubmit={this.submitUser}>
                <div className="titleBar">
                    <h1>{ this.state.userModel.id === undefined ? 'Add' : 'Edit' } User</h1>
                </div>
                <div className="form-group">
                    <label className="col-xs-12 col-sm-2 control-label">
                        Username
                    </label>
                    <div className="col-xs-12 col-sm-10">
                        <input type="text"
                          name="username"
                          maxLength="30"
                          className="form-control"
                          placeholder="Enter Username"
                          value={this.state.userModel.username}
                          onChange={this.changeInputState} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-xs-12 col-sm-2 control-label">
                        Role
                    </label>
                    <div className="col-xs-12 col-sm-10">
                        <select multiple={true} name="groups" className="form-control" value={this.state.userModel.groups} onChange={this.changeInputState}>
                            <option hidden>-- Select Role --</option>
                            {
                                Array.isArray(this.state.groupsList) && 
                                this.state.groupsList.map((item, index) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-xs-12 col-sm-2 control-label">
                        Active?
                    </label>
                    <div className="col-xs-12 col-sm-10">
                        <input type="checkbox" 
                                name="is_active"
                                className="userActiveCheckBox"
                                checked={this.state.userModel.is_active}
                                value={this.state.userModel.is_active}
                                disabled={ !Auth.currentUser.groups.find(group => group.name === 'Administrator') }
                                onChange={this.changeInputState} />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-xs-12 col-sm-10 col-xs-offset-0 col-sm-offset-2">
                        <input type="submit" value={ this.state.userModel.id === undefined ? 'Create' : 'Update' } className="btn btn-primary createButton" />
                    </div>
                </div>
                <div style={{ paddingTop: '2em' }}>
                    <NavLink className="NavLink btn btn-primary newButton" to="/users">&lt; Back to Users</NavLink>
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

    submitUser(event) {
        event.preventDefault();

        let request = this.state.userModel.id === undefined ?
            UsersAPI.create(this.state.userModel) :
            UsersAPI.update(this.state.userModel);

        request
            .then(() => {
                this.props.onNotifySuccess(`User ${this.state.userModel.id === undefined ? 'created' : 'updated' } successfully.`);

                this.setState({
                    redirectToUsersPage: true
                });
            })
            .catch(() => {
                this.props.onNotifyError(`Failed to ${this.state.userModel.id === undefined ? 'create' : 'update' } user.`);
            });
    }
  }

export default UserForm;
