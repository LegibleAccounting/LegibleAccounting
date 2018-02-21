import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Accounts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Accounts</h1>
                <NavLink to="/accounts/add">Add Account</NavLink>
            </div>
        );
    }
}

export default Accounts;
