import React, { Component } from 'react';
import './BalanceSheet.css';

class BalanceSheet extends Component {
    constructor() {
        super();
        this.state = {
            data: {}
        };
    }

    render() {
        return (
            <div className="balance-sheet">
                <div className="text-center">
                    <h1 className="balance-sheet-main-heading">Balance Sheet</h1>
                    <h2 className="business-name">Addams & Family Inc.</h2>
                    <h3>For the Period Ending ---</h3>
                </div>
            </div>
        );
    }
}

export default BalanceSheet;
