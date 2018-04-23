import React, { Component } from 'react';
import moment from 'moment';
import './RetainedEarningsStatement.css';
import AccountsAPI from '../api/AccountsApi.js';
import Spinner from './Spinner.js';

class RetainedEarningsStatement extends Component {
    constructor() {
        super();

         this.state = {
            isLoading: true,
            data: []
        };

        AccountsAPI.getRetainedEarningsStatement()
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
            <div className="retained-earnings-statement">
                <div className="text-center title-heading">
                    <div className="business-name">Addams & Family Inc.</div>
                    <div className="income-statement-main-heading">Statement of Retained Earnings</div>
                    <div className="as-of-date ">For the period ending {moment(this.state.data.as_of_date).format('MMMM Do, YYYY')}</div>
                </div>
                <div className="tableWrapper">
                    <table className="table balance-sheet-table">
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
                <div className="tableWrapper">
                    <table className="retained-earnings-statement-table">
                      <tbody>
                            <tr>
                                <td className="subjectTitle">Beginning Balance</td>
                                <td className="amount" align="right"><label>{this.state.data.retained_earnings_beginning}</label></td>
                            </tr>
                            <tr>
                                <td className="subjectTitle">Net Income</td>
                                <td className="amount" align="right"><label>{this.state.data.net_profit}</label></td>
                            </tr>
                            <tr>
                                <td className="subjectTitle">Less Drawings</td>
                                <td className="amount" align="right"><label>{this.state.data.dividends_paid}</label></td>
                            </tr>
                            <tr>
                                <td className="subjectTitle">Ending Balance</td>
                                <td className="amount" align="right"><label className="total">{this.state.data.retained_earnings_ending}</label></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default RetainedEarningsStatement;
