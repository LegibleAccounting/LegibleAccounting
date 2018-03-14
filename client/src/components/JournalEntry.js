import React, { Component } from 'react';
import DateTime from 'react-datetime';
import moment from 'moment';
import './JournalEntry.css';

class JournalEntry extends Component {
    constructor(props) {
        super(props);

        this.lastKey = null; // Used to uniquely identify transactions for React

        this.state = {
            entry_type: 'type',
            description: '',
            date: moment().format('YYYY-MM-DD'),
            transactions: [
                {
                    accountID: "Petty Cash",
                    amount: 0,
                    is_debit: true,
                    initial_display: true,
                    filePicker: null
                },
                {
                    accountID: "Cash",
                    amount: 0,
                    is_debit: false,
                    initial_display: true,
                    filePicker: null
                }
            ],
        };
    }


render() {
        return (
            <div className="journalEntry">
                <div className="row topOfEntryWrapper">
                    <div className="col-xs-12 col-sm-2 dateEntry">
                        {this.props.entry.date}
                    </div>
                    <div className="col-xs-12 col-sm-2">
                        {this.props.entry.entry_type}
                    </div>
                    <div className="col-xs-12 col-sm-8">
                        {
                            this.props.entry.transactions.map((item, index) => (
                                <div className="row auto-height" key={item.key}>
                                    <div className="col-xs-12 col-sm-6">
                                        <div className={ 'accountEntry ' + (item.is_debit ? '' : 'creditAccountEntry')}>
                                           {item.affected_account.name}
                                        </div>
                                    </div>
                                    <div className={ 'amountEntry col-xs-12 ' + (item.is_debit ? 'col-sm-6' : 'col-sm-3 col-sm-offset-3') }>
                                        <label className={ item.is_debit ? 'dollarSignDebit' : 'dollarSignCredit' }>$</label>
                                        <div className="amountEntryValue">{item.value}</div>
                                    </div>
                                </div>
                            ))
                        }
                      </div>
                </div>
                
                <div className="row bottomOfEntryWrapper">
                    <div className="col-md-8 descriptionWrapper" style={{visibility: this.props.entry.description =="" && 'hidden'}}>
                        <label className="descriptionTitle">Description:</label>
                        {this.props.entry.description}
                    </div>
                    <div className="col-md-4 actionButtonsWrapper">
                       
                    </div>
                </div>
                <div className="line"></div> 
            </div>
        );
    }
}

export default JournalEntry;