import React, { Component } from 'react';
import moment from 'moment';
import './IncomeStatement.css';

class IncomeStatement extends Component {
    constructor() {
        super();
        this.state = {
            data: {}
        };
    }

    render() {
        return (
            <div className="income-statement">
                <div className="text-center">
                    <h1 className="income-statement-main-heading">Income Statement</h1>
                    <h2 className="business-name">Addams & Family Inc.</h2>
                    <h3>As of {moment(this.state.data.as_of_date).format('MMMM Do YYYY')}</h3>
                </div>
            </div>
        );
    }
}

export default IncomeStatement;
