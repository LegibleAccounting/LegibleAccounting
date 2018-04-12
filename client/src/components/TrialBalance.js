import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './TrialBalance.css';
import AccountsAPI from '../api/AccountsApi.js';

class TrialBalance extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            data: []
        };

        AccountsAPI.getTrialBalance()
            .then(data => {
                this.setState({
                    isLoading: false,
                    data: data,
                });
            });
    }

    render() {
        if (this.state.isLoading) {
            return (<div>Loading...</div>);
        }

        return (
            <div className="trialBalance">
                <div className="titleBar">
                    <h1>Trial Balance</h1>
                </div>

                <div className="tableWrapper .table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                            <th className="accountName">Account</th>
                            <th className="debitCol text-right">Debit</th>
                            <th className="creditCol text-right">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        { this.state.data.accounts.length ? (
                          this.state.data.accounts.map((item, index) => (
                            <tr key={item.account_id}>
                                <td>
                                    <NavLink to={`/accounts/${item.account_id}/ledger`}>
                                        {item.account_number}
                                    </NavLink>
                                    <span> - {item.account_name}</span>
                                </td>
                                <td className="debit" align="right">{item.is_debit && item.balance}</td>
                                <td className="credit" align="right">{!item.is_debit && item.balance}</td>
                            </tr>
                        ))): (
                            <tr>
                                <td>{ this.state.isLoading ? 'Loading...' : 'No Data' }</td>
                                <td></td>
                                <td></td>
                            </tr>
                        )}
                            <tr>
                                <td><label>Total</label></td>
                                <td align="right"><label className="doubleUnderline">{this.state.data.debit_total}</label></td>
                                <td align="right"><label className="doubleUnderline">{this.state.data.credit_total}</label></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

export default TrialBalance;
