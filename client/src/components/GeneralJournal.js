import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './GeneralJournal.css';
import './CommonChart.css';
import Auth from '../api/Auth.js';
import GeneralJournalAPI from '../api/GeneralJournal.js';
import GeneralJournalEntry from './GeneralJournalEntry.js';

class GeneralJournal extends Component {
    constructor(props) {
        super(props);

        this.state = {
	       entrys: [],
	       ogEntrys: [],
	       searchText: '',
            newTransactions: [
                {
                accountName: "",
                accountID: "",
                amount: 0,
                normalSide: "Debit"
                },
                {
                accountName: "",
                accountID: "",
                amount: 0,
                normalSide: "Credit"
                }
            ],
            newAttachments: []

	    };

		this.searchTextChanged = this.searchTextChanged.bind(this);
    	this.search = this.search.bind(this);
        this.accountNameOnChange = this.accountNameOnChange.bind(this);
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
                                   this.state.newTransactions.map((item, index) => (
                                        <div className="accountEntryDropdownWrapper">
                                            <select 
                                            className={(item.normalSide === "Debit" && 'form-control accountEntryDropdown debitAccountEntryDropdown') || (item.normalSide === "Credit" && 'form-control accountEntryDropdown creditAccountEntryDropdown')} 
                                            id={index}
                                            onChange={this.accountNameOnChange}>
                                                <option hidden>Select Account</option>
                                                <option value="1">Account 1</option>
                                            </select>
                                            <button className="textButton" hidden={(index > 1)} value={item.normalSide === "Debit"} onClick={this.addNewTransaction}>+ Add</button>
                                        </div>
                                    ))
                                 }
                          </div>
                          <div className="col-lg-4">
                            <div>
                                {
                                   this.state.newTransactions.map((item, index) => (
                                        <input type="number" className={(item.normalSide === "Debit" && 'form-control entryAmount debitEntryAmount') || (item.normalSide === "Credit" && 'form-control entryAmount creditEntryAmount')} placeholder="0.00"/>
                                    ))
                                 }
                            </div>
                          </div>
                    </div>
                    <div className="line"></div> 
                    <div className="row bottomOfEntryWrapper">
                        <div className="col-lg-5 descriptionWrapper">
                            <label>Description</label>
                            <textarea type="text" className="form-control description" cols="40" rows="4" placeholder="Description"/>
                        </div>
                        <div className="col-lg-4 attachmentsWrapper">
                            <div className="attachmentsTitleWrapper">
                                <label className="attachmentsTitle">Attachments</label>
                                <button className="textButton">+ Add</button>
                            </div>
                            <div className="attachmentsContentWrapper">
                                <div>
                                    <button className="textButton attachmentButton">Attachment1.pdf</button>
                                    <button className="textButton removeAttachmentButton">(Remove)</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 actionButtonsWrapper">
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
    			entrys: this.state.ogEntrys
    		});
    	}
    }

    search(event) {
    	event.preventDefault();
    }

    addNewTransaction(event) {
        var isDebit = (event.target.value === "true");
        var newTransaction = 
        {
            accountName: "",
            accountID: "",
            amount: 0,
            normalSide: "Debit"
        }

        if (!isDebit) {
            newTransaction.normalSide = "Credit";
        }

        var transactions = this.state.newTransactions;
        transactions.push(newTransaction);

        this.setState({
            newTransactions: transactions
        });
        
    }

    accountNameOnChange(event) {
        //todo
        // var index = parseInt(event.target.id);
        // console.log(index);
        // var changedTransaction = this.state.newTransactions[index];
        // changedTransaction.accountName = "Test";

        // newTransactions: this.state.newTransactions.splice(index, 1, changedTransaction);
    }

    accountAmountOnChange(event, index) {
        //todo
        // var changedTransaction = this.state.newTransactions[index];
        // changedTransaction.amount = 1000;

        // newTransactions: this.state.newTransactions.splice(index, 1, changedTransaction);
    }
}

export default GeneralJournal;
