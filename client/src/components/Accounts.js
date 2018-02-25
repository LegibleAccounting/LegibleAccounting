import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Accounts.css';
import './CommonChart.css';
import AccountsAPI from '../api/Accounts.js';

class Accounts extends Component {
    constructor(props) {
        super(props);

        this.state = {
          accounts: [],
          ogAccounts: [],
          searchText: ''
        };

        this.searchTextChanged = this.searchTextChanged.bind(this);
        this.search = this.search.bind(this);

        AccountsAPI.getAll(false)
            .then(data => {
                this.setState({
                    accounts: data,
                    ogAccounts: data
                });
            });
    }

    render() {
        return (
            <div className="accounts">
                <div className="titleBar">
                    <h1>Accounts</h1>
                    <NavLink className="NavLink btn btn-primary newButton" to="/accounts/add">New +</NavLink> 
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
                            <th className="accountNumber">#</th>
                            <th className="name">Name</th>
                            <th className="type">Type</th>
                            <th className="edits"></th>
                        </tr>
                      </thead>
                      <tbody>
                        { this.state.accounts.length ? (
                          this.state.accounts.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.account_number}</td>
                                <td>{item.name}</td>
                                <td>{item.account_type.category}</td>
                                <td><NavLink className="NavLink btn btn-primary newButton" to={`/chart-of-accounts/${item.id}`}>Edit</NavLink> </td>
                            </tr>
                          ))
                        ) : (
                            <tr>
                                <td></td>
                                <td>No Accounts</td>
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
        if (event.target.value == '') {
            this.setState({
                accounts: this.state.ogAccounts
            });
        }
    }

    search(event) {
        event.preventDefault();
         AccountsAPI.search(false, this.state.searchText)
        .then(data => {
            this.setState({
                accounts: data
            });
        });
    }
}

export default Accounts;
