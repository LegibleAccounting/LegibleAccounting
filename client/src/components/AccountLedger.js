import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import AccountsAPI from '../api/AccountsApi.js';
import Spinner from './Spinner.js';

class AccountLedger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        };

        AccountsAPI.getLedger(this.props.match.params.id)
            .then((ledger) => {
                this.setState({
                    ledger
                });
            })
            .finally(() => {
                this.setState({
                    isLoading: false
                });
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div style={{ marginTop: '2rem' }} className="full-height flex-row flex-v-center flex-h-center">
                    <Spinner />
                </div>
            );
        }

        return (
            <div className="accountLedger">
                <div className="titleBar">
                    <h1>{this.state.ledger.account_number} - {this.state.ledger.name}</h1>
                    <div className="filler"></div>
                    <div className="searchContainer btn-group">
                        <form onSubmit={this.search}>
                            <input type="search" className="form-control search" onChange={this.searchTextChanged} onBlur={this.search} placeholder="Search"/>
                        </form>
                        <button className="btn btn-primary" type="submit" onClick={this.search}>Search</button>
                    </div>
                </div>
                <div className="tableWrapper">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Reference No.</th>
                                <th>Description</th>
                                <th className="text-right">Debit</th>
                                <th className="text-right">Credit</th>
                                <th className="text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td align="right">{this.state.ledger.initial_balance}</td>
                            </tr>
                            {!this.state.isLoading && this.state.ledger.balances.length ? (
                                this.state.ledger.balances.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.date}</td>
                                        <td>
                                            <NavLink to={`/general-journal/${item.journal_entry_id}`}>{item.journal_entry_id}</NavLink>
                                        </td>
                                        <td>{item.journal_entry_description}</td>
                                        <td align="right">{item.is_debit ? item.value : ''}</td>
                                        <td align="right">{!item.is_debit ? item.value : ''}</td>
                                        <td align="right">{item.balance}</td>
                                    </tr>
                                ))
                            ) : (
                            <tr>
                                <td colSpan="1000" className="text-center">
                                    <div style={{ marginTop: '4rem' }}>
                                        { this.state.isLoading ? (
                                            <Spinner />
                                        ) : ('No Transactions') }
                                    </div>
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div>
                    <NavLink className="NavLink btn btn-primary backButton" to="/accounts">&lt; Back to Accounts</NavLink>
                </div>
            </div>
        );
    }

    searchTextChanged() {}
    search() {}
}

export default AccountLedger;
