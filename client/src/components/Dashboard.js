import React, { Component } from 'react';
import ChartOfAccounts from './ChartOfAccounts.js';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ChartOfAccounts />
        );
    }
}

export default Dashboard;
