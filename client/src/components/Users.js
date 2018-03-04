import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Users.css';
import './CommonChart.css';
import Auth from '../api/Auth.js';
import UsersAPI from '../api/UsersApi.js';

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
          users: [],
          ogUsers: [],
          searchText: ''
        };

        this.searchTextChanged = this.searchTextChanged.bind(this);
        this.search = this.search.bind(this);

        UsersAPI.getAll()
            .then(data => {
                this.setState({
                    users: data,
                    ogUsers: data
                });
            });
    }

    render() {
        return (
            <div className="users">
                <div className="titleBar">
                    <h1>Users</h1>
                    {
                        Auth.currentUser.groups.find(group => group.name === 'Administrator') ? (
                            <NavLink className="NavLink btn btn-primary newButton" to="/users/add">New +</NavLink> 
                        ) : (
                            <span></span>
                        )
                    }
                    <div className="filler"></div>
                    <div className="searchContainer btn-group">
                        <form onSubmit={this.search}>
                            <input type="search" className="form-control search" onChange={this.searchTextChanged} onBlur={this.search} placeholder="Search"/>
                        </form>
                        <button className="btn btn-primary" type="submit" onClick={this.search}>Search</button>
                    </div>
                </div>

                <div className="tableWrapper .table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                            <th className="usersNumber">#</th>
                            <th className="name">Name</th>
                            <th className="type">Type</th>
                            <th className="edits"></th>
                        </tr>
                      </thead>
                      <tbody>
                        { this.state.users.length ? (
                          this.state.users.map((item, index) => (
                            <tr key={item.username}>
                                <td>{item.first_name}</td>
                                <td>{item.last_name}</td>
                                <td>
                                {
                                    Auth.currentUser.groups.find(group => group.name === 'Administrator' || group.name === 'Manager') ? (
                                        <NavLink className="NavLink btn btn-primary newButton" to={`/users/${item.id}`}>Edit</NavLink>
                                    ) : (
                                        <span></span>
                                    )
                                }
                                </td>
                            </tr>
                          ))
                        ) : (
                            <tr>
                                <td></td>
                                <td>No Users</td>
                                <td></td>
                                <td></td>
                            </tr>
                        )}
                       </tbody>
                    </table>
                </div>
            </div>
        );
    }

    searchTextChanged(event) {
        this.setState({ searchText: event.target.value });
        if (event.target.value === '') {
            this.setState({
                users: this.state.ogUsers
            });
        }
    }

    search(event) {
        event.preventDefault();
         UsersAPI.search(false, this.state.searchText)
        .then(data => {
            this.setState({
                users: data
            });
        });
    }
}

export default Users;
