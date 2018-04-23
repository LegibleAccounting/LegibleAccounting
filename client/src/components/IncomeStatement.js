import React, { Component } from 'react';
import moment from 'moment';
import './IncomeStatement.css';
import AccountsAPI from '../api/AccountsApi.js';
import Spinner from './Spinner.js';

class IncomeStatement extends Component {
    constructor() {
        super();

         this.state = {
            isLoading: true,
            data: [
            ]
        };

        AccountsAPI.getIncomeStatement()
            .then(data => {
                this.setState({
                    isLoading: false,
                    data: data,
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
            <div className="income-statement">
                <div className="text-center title-heading">
                    <div className="business-name">Addams & Family Inc.</div>
                    <div className="income-statement-main-heading">Income Statement</div>
                    <div className="as-of-date ">For the period ending {moment(this.state.data.as_of_date).format('MMMM Do, YYYY')}</div>
                </div>
                <div className="tableWrapper">
                    <table className="table income-statement-table">
                        <thead>
                            <tr>
                                <th className="accountNameCol"></th>
                                <th className="debitCol"></th>
                                <th className="creditCol">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr></tr>
                        </tbody>
                    </table>
                </div>
                <div className="income-statement-heading">Revenue</div>
                <div className="tableWrapper">
                    <table className="income-statement-table">
                      <tbody>
                        { this.state.data.revenues.length ? (
                          this.state.data.revenues.map((item, index) => (
                            <tr key={item.account_id}>
                                <td className="accountNameCol">{item.account_name}</td>
                                <td className="debitCol" align="right">{item.balance}</td>
                                <td className="creditCol" align="right"></td>
                            </tr>
                        ))): (
                            <tr>
                                <td>{ this.state.isLoading ? 'Loading...' : 'No Revenue' }</td>
                                <td></td>
                                <td></td>
                            </tr>
                        )}
                            <tr>
                                <td className="accountNameCol"><label>Revenue Total</label></td>
                                <td className="debitCol" align="right"></td>
                                <td className="creditCol" align="right"><label className="subtotal">{this.state.data.revenues_total}</label></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="income-statement-heading">Expenses</div>
                <div className="tableWrapper">
                    <table className="income-statement-table">
                      <thead>
                      </thead>
                      <tbody>
                        { this.state.data.expenses.length ? (
                          this.state.data.expenses.map((item, index) => (
                            <tr key={item.account_id}>
                                <td className="accountNameCol">{item.account_name}</td>
                                <td className="debitCol" align="right">{item.balance}</td>
                                <td className="creditCol" align="right"></td>
                            </tr>
                        ))): (
                            <tr>
                                <td>{ this.state.isLoading ? 'Loading...' : 'No Expenses' }</td>
                                <td></td>
                                <td></td>
                            </tr>
                        )}
                            <tr>
                                <td className="accountNameCol"><label>Expenses Total</label></td>
                                <td className="debitCol" align="right"></td>
                                <td className="creditCol" align="right"><label className="subtotal">{this.state.data.expenses_total}</label></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="income-statement-heading">Net Income</div>
                <div className="tableWrapper">
                    <table className="income-statement-table">
                      <tbody>
                            <tr>
                                <td className="accountNameCol"><label>Net Income Total</label></td>
                                <td className="debitCol" align="right"></td>
                                <td className="creditCol" align="right"><label className="total">{this.state.data.net_profit}</label></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default IncomeStatement;
