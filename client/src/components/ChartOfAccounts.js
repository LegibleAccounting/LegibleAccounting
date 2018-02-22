import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class ChartOfAccounts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Chart of Accounts</h1>
                <NavLink to="/chart-of-accounts/add">Add Account</NavLink>
            </div>
        );
    }
}

export default ChartOfAccounts;
