
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Auth from '../api/Auth.js';
import './Sidebar.css';

class Sidebar extends Component {
    render() {
        if (this.props.isLoading) {
            return (<div>Loading...</div>);
        }

        return (
            <div className="Sidebar">
                <div className="sidebar-heading">
                    <h4 className="user-heading">Logged in as {this.props.currentUser.username}</h4>
                    <button type="button" className="btn btn-default" onClick={this.props.onRequestLogout}>Log Out</button>
                </div>
                <ul className="nav nav-stacked">
                    <li>
                        <NavLink to="/">Dashboard</NavLink>
                    </li>
                    <li>
                        <NavLink to="/chart-of-accounts">Chart of Accounts</NavLink>
                    </li>
                    <li>
                        <NavLink to="/accounts">Accounts</NavLink>
                    </li>
                    {
                        Auth.currentUser.groups.find(group => group.name === 'Administrator') ? (
                            <li>
                                <NavLink to="/logs">Event Log</NavLink>
                            </li>
                        ) : (
                            <span></span>
                        )
                    }
                </ul>
            </div>
        );
    }
}

export default Sidebar;
