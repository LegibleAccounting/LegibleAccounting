import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import AccountsAPI from '../api/AccountsApi.js';

class AddToChartOfAccounts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToChartOfAccountsPage: false,
            accounts: [],
            accountID: '',
            initialBalance: ''
        };

        AccountsAPI.getAll(false)
            .then((accounts) => {
                this.setState({
                    accounts
                });
            });

        // Bind event handlers to class instance context.
        this.changeAccount = this.changeAccount.bind(this);
        this.changeInitialBalance = this.changeInitialBalance.bind(this);
        this.submitAccount = this.submitAccount.bind(this);
    }

    render() {
        if (this.state.redirectToChartOfAccountsPage) {
            return <Redirect to="/chart-of-accounts" />
        }

        return (
            <form className="form-horizontal" onSubmit={this.submitAccount}>
                <div className="titleBar">
                    <h1>Add to Chart of Accounts</h1>
                </div>
                <div className="form-group">
                    <label className="col-xs-12 col-sm-2 control-label">Account</label>
                    <div className="col-xs-12 col-sm-10">
                        <select className="form-control" value={this.state.accountID} onChange={this.changeAccount}>
                            <option hidden>-- Select Account --</option>
                            {
                                this.state.accounts.map((account) => (
                                    <option key={account.id} value={account.id}>{ account.name }</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="form-group">
                	<label className="col-xs-12 col-sm-2 control-label">Initial Balance</label>
                	<div className="col-xs-6 col-sm-6 col-md-2">
                		<input type="number" className="form-control text-right" placeholder="0.00" onChange={this.changeInitialBalance} />
                	</div>
                </div>
                <div className="form-group">
                    <div className="col-xs-12 col-sm-10 col-xs-offset-0 col-sm-offset-2">
                        <input type="submit" value="Add" className="btn btn-primary" />
                    </div>
                </div>
                <div style={{ paddingTop: '2em' }}>
                    <NavLink className="NavLink btn btn-primary backButton" to="/chart-of-accounts">&lt; Back to Chart of Accounts</NavLink>
                </div>
            </form>
        );
    }

    changeAccount(event) {
        this.setState({
            accountID: event.target.value
        });
    }

    changeInitialBalance(event) {
    	this.setState({
    		initialBalance: event.target.value
    	});
    }

    submitAccount(event) {
        event.preventDefault();

        let account = this.state.accounts.find(account => account.id === Number(this.state.accountID));
        account.account_type = account.account_type.id;
        AccountsAPI.update(Object.assign({}, account, {
            is_active: true,
            initial_balance: Number(this.state.initialBalance)
        }))
            .then(() => {
                this.props.onNotifySuccess('Account successfully added to the chart of accounts.');
                this.setState({
                    redirectToChartOfAccountsPage: true
                });
            })
            .catch(() => {
                this.props.onNotifyError('Failed to add account to the chart of accounts.');
            });
    }
}

export default AddToChartOfAccounts;
