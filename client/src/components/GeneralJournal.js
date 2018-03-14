import React, { Component } from 'react';
import './GeneralJournal.css';
import './CommonChart.css';
import GeneralJournalAPI from '../api/GeneralJournal.js';
import AccountsAPI from '../api/Accounts.js';

import JournalEntryCreate from './JournalEntryCreate.js';
import JournalEntry from './JournalEntry.js';

class GeneralJournal extends Component {
    constructor(props) {
        super(props);

        this.state = {
           isCreatingJournalEntry: false,
	       entries: [],
	       ogentries: [],
           entryTypes: [],
	       searchText: '',
           accounts: null
	    };

        AccountsAPI.getAll(true)
            .then((accounts) => {
                this.setState({
                    accounts
                });
            });

        GeneralJournalAPI.getEntryTypeOptions()
            .then((entryTypes) => {
                this.setState({
                    entryTypes
                });
            });

        GeneralJournalAPI.getAll()
            .then((entries) => {
                this.setState({
                    entries: entries.map((entry) => {
                        let offset = null;
                        entry.transactions = entry.transactions
                            .map((transaction, index) => {
                                if (transaction.is_debit) {
                                    transaction.typeIndex = index;
                                } else {
                                    if (offset === null) {
                                        offset = index;
                                    }

                                    transaction.typeIndex = index - offset;
                                }

                                return transaction;
                            })

                        return entry;
                    })
                });
            });

		this.searchTextChanged = this.searchTextChanged.bind(this);
    	this.search = this.search.bind(this);
        this.toggleNewJournalUI = this.toggleNewJournalUI.bind(this);
        this.submitNewJournalEntry = this.submitNewJournalEntry.bind(this);
    }

    render() {
        return (
        	<div className="generalJournal">
        		<div className="titleBar">
		            <h1>General Journal</h1>
                    {
					   <button className="btn btn-primary newButton" type="button" onClick={this.toggleNewJournalUI}>+ Add</button> 
                    }
					<div className="filler"></div>
					<div className="searchContainer btn-group">
						<form onSubmit={this.search}>
		            		<input type="search" className="form-control search" onChange={this.searchTextChanged} onBlur={this.search} placeholder="Search"/>
		            	</form>
		            	<button className="btn btn-primary" type="submit" onClick={this.search}>Search</button>
		            </div>
	            </div>
                <div>
                    <div className="row gridHeading">
                        <label className="hidden-xs col-sm-2">Date</label>
                        <label className="hidden-xs col-sm-1">Type</label>
                        <label className="hidden-xs col-sm-5">Accounts</label>
                        <label className="hidden-xs col-sm-2">Debit</label>
                        <label className="hidden-xs col-sm-2">Credit</label>
                    </div>
                    <div className="titleLine"></div>
                    {

                        this.state.isCreatingJournalEntry &&
                            (<JournalEntryCreate entryTypeOptions={this.state.entryTypes} accounts={this.state.accounts} onCancel={this.toggleNewJournalUI} onSubmit={this.submitNewJournalEntry} />)
                    }
                    {
                        (!this.state.isCreatingJournalEntry && (!this.state.entries || this.state.entries.length === 0)) &&
                            (<h2 className="text-center pad">No Journal Entries exist.</h2>)
                    }
                    {
                            this.state.entries.map((item, index) => (
                                <JournalEntry key={item.date_created} entry={item}/>
                            ))
                    }
                </div>
			</div>
        );
    }

    toggleNewJournalUI() {
        this.setState({
            isCreatingJournalEntry: !this.state.isCreatingJournalEntry
        });
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

    submitNewJournalEntry(journalEntry) {
        GeneralJournalAPI.create(journalEntry)
            .then(() => {
                this.props.onNotifySuccess('Journal Entry has been successfully created.');
                this.setState({
                    isCreatingJournalEntry: false
                });
            })
            .catch(() => {
                this.props.onNotifyError('Failed to create journal entry.');
            });
    }
}

export default GeneralJournal;
