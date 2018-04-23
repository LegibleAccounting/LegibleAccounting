import React, { Component } from 'react';
import moment from 'moment';
import './BalanceSheet.css';
import AccountsAPI from '../api/AccountsApi.js';
import Spinner from './Spinner.js';

class BalanceSheet extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            data: [
            ]
        };

        AccountsAPI.getBalanceSheet()
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
            <div className="balance-sheet">
                <div className="text-center title-heading">
                    <div className="business-name">Addams & Family Inc.</div>
                    <div className="main-heading">Balance Sheet</div>
                    <div className="as-of-date ">As of {moment(this.state.data.as_of_date).format('MMMM Do YYYY')}</div>
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
                <div className="data-heading">Assets</div>
                <div className="tableWrapper">
                    <table className="balance-sheet-table">
                      <tbody>
                        {
                            this.state.data.noncurrent_assets_total ? (
                                <tr>
                                    <td className="data-subheading accountNameCol"><label>Non-current Assets</label></td>
                                    <td className="debitCol" align="right"></td>
                                    <td className="creditCol" align="right">{this.state.data.noncurrent_assets_total}</td>
                                </tr>
                            ) : (
                                <tr></tr>
                            )
                        }
                        { this.state.data.noncurrent_assets.length ? (
                          this.state.data.noncurrent_assets.map((item, index) => (
                            <tr key={item.account_id}>
                                <td className="data-row accountNameCol">{item.account_name}</td>
                                <td className="debitCol" align="right">{item.balance}</td>
                                <td className="creditCol" align="right"></td>
                            </tr>
                        ))): (
                            <tr>
                            </tr>
                        )}

                        {
                            this.state.data.current_assets_total ? (
                                <tr>
                                    <td className="data-subheading accountNameCol"><label>Current Assets</label></td>
                                    <td className="debitCol" align="right"></td>
                                    <td className="creditCol" align="right">{this.state.data.current_assets_total}</td>
                                </tr>
                            ) : (
                                <tr></tr>
                            )
                        }
                        { this.state.data.current_assets.length ? (
                          this.state.data.current_assets.map((item, index) => (
                            <tr key={item.account_id}>
                                <td className="data-row accountNameCol">{item.account_name}</td>
                                <td className="debitCol" align="right">{item.balance}</td>
                                <td className="creditCol" align="right"></td>
                            </tr>
                        ))): (
                            <tr>
                            </tr>
                        )}
                        <tr>
                            <td className="data-subheading accountNameCol"><label>Total Assets</label></td>
                            <td className="debitCol" align="right"></td>
                            <td className="data-total creditCol" align="right">{this.state.data.asset_total}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="data-heading">Equity & Liabilities</div>
                <div className="tableWrapper">
                    <table className="balance-sheet-table">
                      <tbody>
                        {
                            this.state.data.equity_total ? (
                                <tr>
                                    <td className="data-subheading accountNameCol"><label>Owners Equity</label></td>
                                    <td className="debitCol" align="right"></td>
                                    <td className="creditCol" align="right">{this.state.data.equity_total}</td>
                                </tr>
                            ) : (
                                <tr></tr>
                            )
                        }
                        { this.state.data.equity.length ? (
                          this.state.data.equity.map((item, index) => (
                            <tr key={item.account_id}>
                                <td className="data-row accountNameCol">{item.account_name}</td>
                                <td className="debitCol" align="right">{item.balance}</td>
                                <td className="creditCol" align="right"></td>
                            </tr>
                        ))): (
                            <tr>
                            </tr>
                        )}

                        {
                            this.state.data.noncurrent_liabilities_total ? (
                                <tr>
                                    <td className="data-subheading accountNameCol"><label>Non-current Liabilities</label></td>
                                    <td className="debitCol" align="right"></td>
                                    <td className="creditCol" align="right">{this.state.data.noncurrent_liabilities_total}</td>
                                </tr>
                            ) : (
                                <tr></tr>
                            )
                        }
                        { this.state.data.noncurrent_liabilities.length ? (
                          this.state.data.noncurrent_liabilities.map((item, index) => (
                            <tr key={item.account_id}>
                                <td className="data-row accountNameCol">{item.account_name}</td>
                                <td className="debitCol" align="right">{item.balance}</td>
                                <td className="creditCol" align="right"></td>
                            </tr>
                        ))): (
                            <tr>
                            </tr>
                        )}
                        {
                            this.state.data.current_liabilities_total ? (
                                <tr>
                                    <td className="data-subheading accountNameCol"><label>Current Liabilities</label></td>
                                    <td className="debitCol" align="right"></td>
                                    <td className="creditCol" align="right">{this.state.data.current_liabilities_total}</td>
                                </tr>
                            ) : (
                                <tr></tr>
                            )
                        }
                        { this.state.data.current_liabilities.length ? (
                          this.state.data.current_liabilities.map((item, index) => (
                            <tr key={item.account_id}>
                                <td className="data-row accountNameCol">{item.account_name}</td>
                                <td className="debitCol" align="right">{item.balance}</td>
                                <td className="creditCol" align="right"></td>
                            </tr>
                        ))): (
                            <tr>
                            </tr>
                        )}
                         <tr>
                            <td className="data-subheading accountNameCol"><label>Total Equity & Liabilities</label></td>
                            <td className="debitCol" align="right"></td>
                            <td className="data-total creditCol" align="right">{this.state.data.liability_total}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default BalanceSheet;
