import React, { Component } from 'react';
import ChartOfAccounts from './ChartOfAccounts.js';
import DashboardAPI from '../api/DashboardApi.js';

class Dashboard extends Component {
    constructor(props) {
    	super(props);

    	this.state = {
            currentRatio: {},
            returnOnAssets: {},
            returnOnEquity: {},
            netProfitMargin: {},
            assetTurnover: {},
            quickRatio: {}
        };

        DashboardAPI.getCurrentRatio()
            .then((ratio_info) => {
        		this.setState({currentRatio: ratio_info});
        	});

        DashboardAPI.getReturnOnAssets()
                .then((ratio_info) => {
                    this.setState({ returnOnAssets: ratio_info});
                });

        DashboardAPI.getReturnOnEquity()
                .then((ratio_info) => {
                    this.setState({ returnOnEquity: ratio_info});
                });

        DashboardAPI.getNetProfitMargin()
                .then((ratio_info) => {
                    this.setState({ netProfitMargin: ratio_info});
                });

        DashboardAPI.getAssetTurnover()
            .then((ratio_info) => {
                this.setState({ assetTurnover: ratio_info});
            });
        
        DashboardAPI.getQuickRatio()
            .then((ratio_info) => {
                this.setState({ quickRatio: ratio_info});
            });
    }

    render() {
        return (
            <div>
            	<div>
            		<h1>{this.state.currentRatio.status}</h1>
            		<h2>{this.state.currentRatio.ratio}</h2>
            	</div>
                <div>
                    <h1>{this.state.returnOnAssets.status}</h1>
                    <h2>{this.state.returnOnAssets.ratio}</h2>
                </div>
                <div>
                    <h1>{this.state.returnOnEquity.status}</h1>
                    <h2>{this.state.returnOnEquity.ratio}</h2>
                </div>
                <div>
                    <h1>{this.state.netProfitMargin.status}</h1>
                    <h2>{this.state.netProfitMargin.ratio}</h2>
                </div>
                <div>
                    <h1>{this.state.assetTurnover.status}</h1>
                    <h2>{this.state.assetTurnover.ratio}</h2>
                </div>
                <div>
                    <h1>{this.state.quickRatio.status}</h1>
                    <h2>{this.state.quickRatio.ratio}</h2>
                </div>
            </div>
            /*<ChartOfAccounts />*/
        );
    }
}

export default Dashboard;
