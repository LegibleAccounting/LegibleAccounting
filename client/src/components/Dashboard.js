import React, { Component } from 'react';
import AccountsAPI from '../api/AccountsApi.js';
import './Dashboard.css';

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

        AccountsAPI.getCurrentRatio()
            .then((ratio_info) => {
        		this.setState({currentRatio: ratio_info});
        	});

        AccountsAPI.getReturnOnAssets()
                .then((ratio_info) => {
                    this.setState({ returnOnAssets: ratio_info});
                });

        AccountsAPI.getReturnOnEquity()
                .then((ratio_info) => {
                    this.setState({ returnOnEquity: ratio_info});
                });

        AccountsAPI.getNetProfitMargin()
                .then((ratio_info) => {
                    this.setState({ netProfitMargin: ratio_info});
                });

        AccountsAPI.getAssetTurnover()
            .then((ratio_info) => {
                this.setState({ assetTurnover: ratio_info});
            });

        AccountsAPI.getQuickRatio()
            .then((ratio_info) => {
                this.setState({ quickRatio: ratio_info});
            });
    }

    render() {
        return (
            <div className="dashboard">
                <h1 className="dashboard-heading">Dashboard</h1>
                <div className="row">
                    <div className="col-xs-12 col-md-4">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h2>Current Ratio</h2>
                            </div>
                            <div className="panel-body">
                                <h3 className="ratio-value">{this.state.currentRatio.ratio}</h3>
                                {(this.state.currentRatio.status === 'yellow' &&
                                    (<div className="ratio warning"></div>)
                                )}
                                {(this.state.currentRatio.status === 'red' &&
                                    (<div className="ratio bad"></div>)
                                )}
                                {(this.state.currentRatio.status === 'green' &&
                                    (<div className="ratio good"></div>)
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-4">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h2>Return on Assets</h2>
                            </div>
                            <div className="panel-body">
                                <h3 className="ratio-value">{this.state.returnOnAssets.ratio}</h3>
                                {(this.state.returnOnAssets.status === 'yellow' &&
                                    (<div className="ratio warning"></div>)
                                )}
                                {(this.state.returnOnAssets.status === 'red' &&
                                    (<div className="ratio bad"></div>)
                                )}
                                {(this.state.returnOnAssets.status === 'green' &&
                                    (<div className="ratio good"></div>)
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-4">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h2>Return on Equity</h2>
                            </div>
                            <div className="panel-body">
                                <h3 className="ratio-value">{this.state.returnOnEquity.ratio}</h3>
                                {(this.state.returnOnEquity.status === 'yellow' &&
                                    (<div className="ratio warning"></div>)
                                )}
                                {(this.state.returnOnEquity.status === 'red' &&
                                    (<div className="ratio bad"></div>)
                                )}
                                {(this.state.returnOnEquity.status === 'green' &&
                                    (<div className="ratio good"></div>)
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-4">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h2>Net Profit Margin</h2>
                            </div>
                            <div className="panel-body">
                                <h3 className="ratio-value">{this.state.netProfitMargin.ratio}</h3>
                                {(this.state.netProfitMargin.status === 'yellow' &&
                                    (<div className="ratio warning"></div>)
                                )}
                                {(this.state.netProfitMargin.status === 'red' &&
                                    (<div className="ratio bad"></div>)
                                )}
                                {(this.state.netProfitMargin.status === 'green' &&
                                    (<div className="ratio good"></div>)
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-4">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h2>Asset Turnover</h2>
                            </div>
                            <div className="panel-body">
                                <h3 className="ratio-value">{this.state.assetTurnover.ratio}</h3>
                                {(this.state.assetTurnover.status === 'yellow' &&
                                    (<div className="ratio warning"></div>)
                                )}
                                {(this.state.assetTurnover.status === 'red' &&
                                    (<div className="ratio bad"></div>)
                                )}
                                {(this.state.assetTurnover.status === 'green' &&
                                    (<div className="ratio good"></div>)
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-4">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h2>Quick Ratio</h2>
                            </div>
                            <div className="panel-body">
                                <h3 className="ratio-value">{this.state.quickRatio.ratio}</h3>
                                {(this.state.quickRatio.status === 'yellow' &&
                                    (<div className="ratio warning"></div>)
                                )}
                                {(this.state.quickRatio.status === 'red' &&
                                    (<div className="ratio bad"></div>)
                                )}
                                {(this.state.quickRatio.status === 'green' &&
                                    (<div className="ratio good"></div>)
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
