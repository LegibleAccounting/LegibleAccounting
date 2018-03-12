import React, { Component } from 'react';
import './JournalEntryCreate.css';

class JournalEntryCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            newDebitTransactions: [
                {
                accountID: "",
                amount: 0,
                normalSide: "Debit"
                }
            ],
            newCreditTransactions: [
                {
                accountID: "",
                amount: 0,
                normalSide: "Credit"
                }
            ],
            newAttachments: []
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
                    <div className="col-xs-12 col-sm-2 dateEntry">3/15/18</div>
                    <div className="col-xs-12 col-sm-10">
                        {
                            this.state.newDebitTransactions.map((item, index) => (
                                <div className="row auto-height" key={index}>
                                    <div className="col-xs-12 col-sm-7">
                                        <div className="accountEntryDropdownWrapper">
                                            <select
                                              className="form-control accountEntryDropdown"
                                              id={index}
                                              value={item.accountID}
                                              onChange={this.accountNameOnChange.bind(this, index, item.normalSide)}>
                                                <option hidden>Select Account</option>
                                                {
                                                    this.props.accounts.map((account, index) => (
                                                        <option key={account.id} value={account.id}>{ account.name }</option>
                                                    ))
                                                }
                                            </select>
                                            <button className="textButton" hidden={(index > 0)} value={item.normalSide === "Debit"} onClick={this.addNewTransaction}>+ Add</button>
                                            <button className="textButton" hidden={(index === 0)} value={item.normalSide === "Debit"} onClick={this.removeTransaction.bind(this, index, item.normalSide)}>Remove</button>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-5">
                                        <div className="entryAmountWrapper">
                                            <label className="dollarSignDebit" style={{visibility: index !== 0 && 'hidden'}}>$</label>
                                            <input type="number" className='form-control entryAmount debitEntryAmount' placeholder="0.00"
                                            onChange={this.accountAmountOnChange.bind(this, index, item.normalSide)}/>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            this.state.newCreditTransactions.map((item, index) => (
                                <div className="row auto-height" key={index}>
                                    <div className="col-xs-12 col-sm-7">
                                        <div className="accountEntryDropdownWrapper">
                                            <select
                                              className="form-control accountEntryDropdown creditAccountEntryDropdown"
                                              id={index}
                                              value={item.accountID}
                                              onChange={this.accountNameOnChange.bind(this, index, item.normalSide)}>
                                                <option hidden>Select Account</option>
                                                {
                                                    this.props.accounts.map((account, index) => (
                                                        <option key={account.id} value={account.id}>{ account.name }</option>
                                                    ))
                                                }
                                            </select>
                                            <button className="textButton" hidden={(index > 0)} value={item.normalSide === "Debit"} onClick={this.addNewTransaction}>+ Add</button>
                                            <button className="textButton" hidden={(index === 0)} value={item.normalSide === "Debit"} onClick={this.removeTransaction.bind(this, index, item.normalSide)}>Remove</button>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-offset-2 col-sm-3">
                                        <div className="entryAmountWrapper">
                                            <label className="dollarSignCredit" style={{visibility: index !== 0 && 'hidden'}}>$</label>
                                            <input type="number" className='form-control entryAmount creditEntryAmount' placeholder="0.00"
                                            onChange={this.accountAmountOnChange.bind(this, index, item.normalSide)}/>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                      </div>
                </div>
                <div className="line"></div> 
                <div className="row bottomOfEntryWrapper">
                    <div className="col-lg-8 descriptionWrapper">
                        <textarea type="text" className="form-control description" cols="1" rows="1" placeholder="Description"/>
                    </div>
                    <div className="col-lg-4 actionButtonsWrapper">
                            <button className="btn cancelButton submitButton">Cancel</button>
                            <button className="btn btn-primary submitButton">Submit</button>
                    </div>
                </div>
            </div>
        );
    }

    addNewTransaction(event) {
        var isDebit = (event.target.value === "true");

        var currentDebitTransactions = this.state.newDebitTransactions;
        var currentCreditTransactions = this.state.newCreditTransactions;

        var newTransaction = 
        {
            accountID: "",
            amount: 0,
            normalSide: "Debit"
        }

        if (isDebit) {
            //is debit
            currentDebitTransactions.push(newTransaction);
        } else {
            //is credit
            newTransaction.normalSide = "Credit";
            currentCreditTransactions.push(newTransaction);
        }

        this.setState({
            newDebitTransactions: currentDebitTransactions,
            newCreditTransactions: currentCreditTransactions
        });
    }

    removeTransaction(index, normalSide) {
        var isDebit = normalSide;

        var currentDebitTransactions = this.state.newDebitTransactions;
        var currentCreditTransactions = this.state.newCreditTransactions;

        if (isDebit === "Debit") {
            //is debit
            currentDebitTransactions.splice(index, 1);
        } else {
            //is credit
            currentCreditTransactions.splice(index, 1);
        }

        this.setState({
            newDebitTransactions: currentDebitTransactions,
            newCreditTransactions: currentCreditTransactions 
        });

        console.log(this.state.newDebitTransactions);
    }

    accountNameOnChange(transactionIndex, normalSide, event) {
        var transactionToEdit = this.state.newDebitTransactions[transactionIndex];
        if (normalSide === "Credit") {
            transactionToEdit = this.state.newCreditTransactions[transactionIndex];
        }
        
        //edit transaction
        transactionToEdit.accountID = event.target.value;

        this.setState({
            newDebitTransactions: this.state.newDebitTransactions,
            newCreditTransactions: this.state.newCreditTransactions
        });
    }

    accountAmountOnChange(transactionIndex, normalSide, event) {
        var transactionToEdit = this.state.newDebitTransactions[transactionIndex];
        if (normalSide === "Credit") {
            transactionToEdit = this.state.newCreditTransactions[transactionIndex];
        }
        
        //edit transaction
        let newAmount = event.target.value;
        transactionToEdit.amount = newAmount;

        this.setState({
                newDebitTransactions: this.state.newDebitTransactions,
                newCreditTransactions: this.state.newCreditTransactions
            });
    }
}

export default JournalEntryCreate;
