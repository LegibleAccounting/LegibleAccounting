import React, { Component } from 'react';
import moment from 'moment';
import './RetainedEarningsStatement.css';
import AccountsAPI from '../api/AccountsApi.js';

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
            return (<div>Loading...</div>);
        }

        return (
            <div className="retained-earnings-statement">
                <div className="text-center title-heading">
                    <div className="income-statement-main-heading">Statement of Retained Earnings</div>
                    <div className="business-name">Addams & Family Inc.</div>
                    <div className="as-of-date ">As of {moment(this.state.data.as_of_date).format('MMMM Do YYYY')}</div>
                </div>

                <div className="tableWrapper .table-responsive">
                    <table className="retained-earnings-statement-table">
                      <tbody>
                            <tr>
                                <td className="subjectTitle">Balance at the beginning of the year</td>
                                <td className="amount" align="right"><label>{this.state.data.retained_earnings_beginning}</label></td>
                            </tr>
                            <tr>
                                <td className="subjectTitle">Capital contributed during the year</td>
                                <td className="amount" align="right"><label>{this.state.data.capital}</label></td>
                            </tr>
                            <tr>
                                <td className="subjectTitle">Profit for the year</td>
                                <td className="amount" align="right"><label>{this.state.data.net_profit}</label></td>
                            </tr>
                            <tr>
                                <td className="subjectTitle">Drawings</td>
                                <td className="amount" align="right"><label>{this.state.data.dividends_total}</label></td>
                            </tr>
                            <tr>
                                <td className="subjectTitle">Balance at the end of the year</td>
                                <td className="amount" align="right"><label>{this.state.data.retained_earnings_ending}</label></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default RetainedEarningsStatement;
