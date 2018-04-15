import React, { Component } from 'react';
import ChartOfAccounts from './ChartOfAccounts.js';
import DashboardAPI from '../api/DashboardApi.js';

class Dashboard extends Component {
    constructor(props) {
    	super(props);

    	this.state = {
            currentRatio: []
        };

        this.state.currentRatio = DashboardAPI.getCurrentRatio().then(
        	(ratio_info) => {
        		this.setState({currentRatio: ratio_info});
        	});
    }

    render() {
        return (
        	<div>
        		<h1>{this.state.currentRatio.status}</h1>
        		<h2>{this.state.currentRatio.ratio}</h2>
        	</div>
            /*<ChartOfAccounts />*/
        );
    }
}

export default Dashboard;
