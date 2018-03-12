import React, { Component } from 'react';
import './JournalEntryCreate.css';

class JournalEntryCreate extends Component {
    constructor(props) {
        super(props);

        this.lastKey = null; // Used to uniquely identify transactions for React

        this.state = {
            isLoading: false,
            date: '',
            description: '',
            transactions: [
                {
                    key: this.keygen(),
                    accountID: "",
                    amount: 0,
                    is_debit: true,
                    initial_display: true,
                    receipts: []
                },
                {
                    key: this.keygen(),
                    accountID: "",
                    amount: 0,
                    is_debit: false,
                    initial_display: true,
                    receipts: []
                }
            ],
        };

        if (!this.props.accounts) {
            this.state.isLoading = true;
        }

        this.addNewTransaction = this.addNewTransaction.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.accounts !== nextProps.accounts) && Array.isArray(nextProps.accounts)) {
            this.setState({
                isLoading: false
            });
        }
    }

    render() {
        if (this.state.isLoading) {
            return (<div>Loading...</div>);
        }

        return (
            <div>
                <div className="row topOfEntryWrapper">
                    <div className="col-xs-12 col-sm-1 dateEntry">
                        <input type="date" className="dateWidth" />
                    </div>
                    <div className="col-xs-12 col-sm-11">
                        {
                            this.state.transactions.map((item, index) => (
                                <div className="row auto-height" key={item.key}>
                                    <div className="col-xs-12 col-sm-7">
                                        <div className="accountEntryDropdownWrapper">
                                            <select
                                              className={ 'form-control accountEntryDropdown ' + (item.is_debit ? '' : 'creditAccountEntryDropdown') }
                                              id={index}
                                              value={item.accountID}
                                              onChange={this.accountNameOnChange.bind(this, index)}>
                                                <option hidden>Select Account</option>
                                                {
                                                    this.props.accounts.map((account, index) => (
                                                        <option key={account.id} value={account.id}>{ account.name }</option>
                                                    ))
                                                }
                                            </select>
                                            <button className="textButton" hidden={(!item.initial_display)} value={item.is_debit === true } onClick={this.addNewTransaction}>+ Add</button>
                                            <button className="textButton" hidden={(item.initial_display)} value={item.is_debit === true } onClick={this.removeTransaction.bind(this, index)}>Remove</button>
                                        </div>
                                        <div className={ "pad-file-input " + (item.is_debit ? '' : 'creditAccountEntryDropdown') }>
                                            <input type="file" multiple />
                                        </div>
                                    </div>
                                    <div className={ 'col-xs-12 ' + (item.is_debit ? 'col-sm-5' : 'col-sm-3 col-sm-offset-2') }>
                                        <div className="entryAmountWrapper">
                                            <label className={ item.is_debit ? 'dollarSignDebit' : 'dollarSignCredit' } style={{visibility: !item.initial_display && 'hidden'}}>$</label>
                                            <input type="number" className={ 'form-control entryAmount ' + (item.is_debit ? 'debitEntryAmount' : 'creditEntryAmount') } placeholder="0.00"
                                              onChange={this.accountAmountOnChange.bind(this, index)}/>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                      </div>
                </div>
                <div className="line"></div> 
                <div className="row bottomOfEntryWrapper">
                    <div className="col-md-8 descriptionWrapper">
                        <textarea type="text" className="form-control description" cols="1" rows="1" placeholder="Description" value={this.state.description} onChange={this.changeDescription.bind(this)}/>
                    </div>
                    <div className="col-md-4 actionButtonsWrapper">
                        <button className="btn cancelButton submitButton" onClick={this.props.onCancel}>Cancel</button>
                        <button className="btn btn-primary submitButton" onClick={this.delegateJournalEntrySubmission.bind(this)}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }

    addNewTransaction(event) {
        var isDebit = (event.target.value === "true");

        var newTransaction = 
        {
            key: this.keygen(),
            accountID: "",
            amount: 0,
            receipts: []
        }

        if (isDebit) {
            //is debit; have to insert after the last debit
            newTransaction.is_debit = true;

            let spliceLocation;
            for (let i = 0; i < this.state.transactions.length; i++) {
                if (this.state.transactions[i].is_debit === false) {
                    spliceLocation = i;
                    break;
                }
            }

            this.state.transactions.splice(spliceLocation, 0, newTransaction);
        } else {
            //is credit; can just push to the end of the list
            newTransaction.is_debit = false;
            this.state.transactions.push(newTransaction);
        }

        this.setState({
            transactions: this.state.transactions
        });
    }

    removeTransaction(index) {
        this.state.transactions.splice(index, 1);

        this.setState({
            transactions: this.state.transactions
        });
    }

    accountNameOnChange(transactionIndex, event) {
        var transactionToEdit = this.state.transactions[transactionIndex];
        
        //edit transaction
        transactionToEdit.accountID = event.target.value;

        this.setState({
            transactions: this.state.transactions
        });
    }

    accountAmountOnChange(transactionIndex, event) {
        var transactionToEdit = this.state.transactions[transactionIndex];

        //edit transaction
        transactionToEdit.amount = event.target.value;

        this.setState({
            transactions: this.state.transactions
        });
    }

    changeDescription(event) {
        this.setState({
            description: event.target.value
        });
    }

    keygen() {
        if (this.lastKey === null) {
            this.lastKey = 0;
            return this.lastKey;
        }

        return ++this.lastKey;
    }

    delegateJournalEntrySubmission() {
        this.props.onSubmit({
            date: this.state.date,
            description: this.state.description,
            transactions: this.state.transactions
        });
    }
}

export default JournalEntryCreate;
