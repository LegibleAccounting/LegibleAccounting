import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import SortWidget from './SortWidget.js';
import './Users.css';
import './CommonChart.css';
import UsersAPI from '../api/UsersApi.js';

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            ogUsers: [],
            searchText: '',
            sortState: {}
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
                    <NavLink className="NavLink btn btn-primary newButton" to="/users/add">New +</NavLink>
                    <div className="filler"></div>
                    <div className="searchContainer btn-group">
                        <form onSubmit={this.search}>
                            <input type="search" className="form-control search" onChange={this.searchTextChanged} onBlur={this.search} placeholder="Search"/>
                        </form>
                        <button className="btn btn-primary" type="submit" onClick={this.search}>Search</button>
                    </div>
                </div>

                <div className="tableWrapper">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                            <th className="username">Username <SortWidget
                              state={this.state.sortState.username}
                              onClick={this.sortByUsername.bind(this)} />
                            </th>
                            <th className="type">Type <SortWidget
                              state={this.state.sortState.groups__name}
                              onClick={this.sortByGroupsName.bind(this)} />
                            </th>
                            <th className="is_active">Active? <SortWidget
                              state={this.state.sortState.is_active}
                              onClick={this.sortByIsActive.bind(this)} />
                            </th>
                            <th className="edits"></th>
                        </tr>
                      </thead>
                       <tbody>
                        {
                          	this.state.users.map((item, index) => (
                          		<tr key={index}>
	                          		<td>{item.username}</td>

			                        <td>
		                          	{
		                          		item.groups.map((group, index) => group.name + (index !== item.groups.length - 1 ? ', ': ''))
		                          	}
                                    </td>

			                        <td>{item.is_active ? "Yes" : "No"}</td>
                                    <td>
                                        <NavLink className="NavLink btn btn-primary newButton" to={`/users/${item.id}`}>Edit</NavLink>
                                    </td>
		                    	</tr>
                          	))

                   		}
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
        UsersAPI.search(this.state.searchText)
            .then(data => {
                this.setState({
                    users: data
                });
            });
    }

    _sort(fieldName) {
        let promise, nextSortState;
        if (!this.state.sortState[fieldName]) {
            promise = UsersAPI.search(this.state.searchText, `${fieldName}`);
            nextSortState = 'desc';
        } else if (this.state.sortState[fieldName] === 'desc') {
            promise = UsersAPI.search(this.state.searchText, `-${fieldName}`);
            nextSortState = 'asc';
        } else {
            promise = UsersAPI.search(this.state.searchText);
            nextSortState = null;
        }

        promise.then((users) => {
            this.setState({
                users,
                sortState: {
                    [fieldName]: nextSortState
                }
            })
        });
    }

    sortByUsername() {
        this._sort('username');
    }

    sortByGroupsName() {
        this._sort('groups__name');
    }

    sortByIsActive() {
        this._sort('is_active');
    }
}

export default Users;
