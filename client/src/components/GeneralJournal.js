import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './GeneralJournal.css';
import './CommonChart.css';
import Auth from '../api/Auth.js';
import GeneralJournalAPI from '../api/GeneralJournal.js';
import AccountsAPI from '../api/Accounts.js';

class GeneralJournal extends Component {
    constructor(props) {
        super(props);

        this.state = {
	       entries: [],
	       ogentries: [],
	       searchText: '',
           accounts: [],
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

        AccountsAPI.getAll(true)
            .then((accounts) => {
                this.setState({
                    accounts
                });
            });

        GeneralJournalAPI.getAll(false)
            .then((entries) => {
                this.setState({
                    entries
                });
            });

		this.searchTextChanged = this.searchTextChanged.bind(this);
    	this.search = this.search.bind(this);
        this.addNewTransaction = this.addNewTransaction.bind(this);
    }

    render() {
        return (
        	<div className="generalJournal">
        		<div className="titleBar">
		            <h1>General Journal</h1>
                    {
					   <NavLink className="NavLink btn btn-primary newButton" to="">+ Add</NavLink> 
                    }
					<div className="filler"></div>
					<div className="searchContainer btn-group">
						<form onSubmit={this.search}>
		            		<input type="search" className="form-control search" onChange={this.searchTextChanged} onBlur={this.search} placeholder="Search"/>
		            	</form>
		            	<button className="btn btn-primary" type="submit" onClick={this.search}>Search</button>
		            </div>
	            </div>
                <div className=".container">
                    <div className="row gridHeading">
                        <label className="col-lg-2">Date</label>
                        <label className="col-lg-6">Accounts</label>
                        <label className="col-lg-2">Debit</label>
                        <label className="col-lg-2">Credit</label>
                    </div>
                    <div className="titleLine"></div> 
                    <div className="row topOfEntryWrapper">
                          <div className="col-lg-2 dateEntry">3/15/18</div>
                          <div className="col-lg-6">
                                {
                                   this.state.newDebitTransactions.map((item, index) => (
                                        <div className="accountEntryDropdownWrapper">
                                            <select 
                                            className='form-control accountEntryDropdown debitAccountEntryDropdown'
                                            id={index}
                                            onChange={this.accountNameOnChange.bind(this, index, item.normalSide)}>
                                                <option hidden>Select Account</option>
                                                {
                                                    this.state.accounts.map((account, index) => (
                                                        <option key={account.id} value={index}>{ account.name }</option>
                                                    ))
                                                }
                                            </select>
                                            <button className="textButton" hidden={(index > 0)} value={item.normalSide === "Debit"} onClick={this.addNewTransaction}>+ Add</button>
                                            <button className="textButton" hidden={(index === 0)} value={item.normalSide === "Debit"} onClick={this.removeTransaction.bind(this, index, item.normalSide)}>(Remove)</button>
                                        </div>
                                    ))
                                 }

                                 {
                                    this.state.newCreditTransactions.map((item, index) => (
                                        <div className="accountEntryDropdownWrapper">
                                            <select 
                                            className='form-control accountEntryDropdown creditAccountEntryDropdown'
                                            id={index}
                                            onChange={this.accountNameOnChange.bind(this, index, item.normalSide)}>
                                                <option hidden>Select Account</option>
                                                {
                                                    this.state.accounts.map((account, index) => (
                                                        <option key={account.id} value={index}>{ account.name }</option>
                                                    ))
                                                }
                                            </select>
                                            <button className="textButton" hidden={(index > 0)} value={item.normalSide === "Debit"} onClick={this.addNewTransaction}>+ Add</button>
                                            <button className="textButton" hidden={(index === 0)} value={item.normalSide === "Debit"} onClick={this.removeTransaction.bind(this, index, item.normalSide)}>(Remove)</button>
                                        </div>
                                    ))
                                 }
                          </div>
                          <div className="col-lg-4">
                            <div>
                                {
                                   this.state.newDebitTransactions.map((item, index) => (
                                        <div className="entryAmountWrapper">
                                            <label className="dollarSignDebit" style={{visibility: index != 0 && 'hidden'}}>$</label>
                                            <input type="number" className='form-control entryAmount debitEntryAmount' placeholder="0.00"
                                            onChange={this.accountAmountOnChange.bind(this, index, item.normalSide)}/>
                                        </div>
                                    ))
                                 }

                                 {
                                    this.state.newCreditTransactions.map((item, index) => (
                                        <div className="entryAmountWrapper">
                                            <label className="dollarSignCredit" style={{visibility: index != 0 && 'hidden'}}>$</label>
                                            <input type="number" className='form-control entryAmount creditEntryAmount' placeholder="0.00"
                                            onChange={this.accountAmountOnChange.bind(this, index, item.normalSide)}/>
                                        </div>
                                    ))
                                 }
                            </div>
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
			</div>
        );
    }

    searchTextChanged(event) {
    	this.setState({ searchText: event.target.value });
    	if (event.target.value === '') {
    		this.setState({
    			entries: this.state.ogentries
    		});
    	}
    }

    search(event) {
    	event.preventDefault();
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
    }

    accountNameOnChange(transactionIndex, normalSide, event) {
        let selectedAccountIndex = event.target.value;
        let selectedAccount = this.state.accounts[selectedAccountIndex];
        
        var transactionToEdit = this.state.newDebitTransactions[transactionIndex];
        if (normalSide == "Credit") {
            transactionToEdit = this.state.newCreditTransactions[transactionIndex];
        }
        
        //edit transaction
        transactionToEdit.accountID = selectedAccount.id;

        this.setState({
                newDebitTransactions: this.state.newDebitTransactions,
                newCreditTransactions: this.state.newCreditTransactions
            });
    }

    accountAmountOnChange(transactionIndex, normalSide, event) {
        var transactionToEdit = this.state.newDebitTransactions[transactionIndex];
        if (normalSide == "Credit") {
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

export default GeneralJournal;
