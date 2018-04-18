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
                    <div className="business-name">Addams & Family Inc.</div>
                    <div className="income-statement-main-heading">Statement of Retained Earnings</div>
                    <div className="as-of-date ">For the period ending {moment(this.state.data.as_of_date).format('MMMM Do, YYYY')}</div>
                </div>

                <div className="tableWrapper .table-responsive">
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
