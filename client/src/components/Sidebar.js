
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Auth from '../api/Auth.js';
import './Sidebar.css';
import logo from '../book.png';
import profilePicture from '../profilePicture.png'

class Sidebar extends Component {
    render() {
        if (this.props.isLoading) {
            return (<div>Loading...</div>);
        }

        return (
            <div className="Sidebar">
                <div className="sidebar-heading">
                    <div className = "Spacer">
                        <img className ="sidebar-logo" alt="" src={logo} />
                    </div>
                </div>
                <ul className="nav nav-stacked nav-pills stack">
                    <li>
                        <NavLink exact to="/">Dashboard</NavLink>
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
                <div className = "sidebar-footing">
                    <div className = "user-heading">
                        <img className ="user-logo" alt="" src={profilePicture} />
                        <div className ="userText"> {this.props.currentUser.username} </div>
                    </div>
                    <button type="button" className="btn btn-primary logoutButton" onClick={this.props.onRequestLogout}>Log Out</button>
                </div>
            </div>
        );
    }
}

export default Sidebar;
