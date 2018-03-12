import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './GeneralJournal.css';
import './CommonChart.css';
import GeneralJournalAPI from '../api/GeneralJournal.js';
import AccountsAPI from '../api/Accounts.js';

import JournalEntryCreate from './JournalEntryCreate.js';

class GeneralJournal extends Component {
    constructor(props) {
        super(props);

        this.state = {
	       entries: [],
	       ogentries: [],
	       searchText: '',
           accounts: null
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
                <div>
                    <div className="row gridHeading">
                        <label className="hidden-xs col-sm-1">Date</label>
                        <label className="hidden-xs col-sm-7">Accounts</label>
                        <label className="hidden-xs col-sm-2">Debit</label>
                        <label className="hidden-xs col-sm-2">Credit</label>
                    </div>
                    <div className="titleLine"></div> 
                    <JournalEntryCreate accounts={this.state.accounts} />
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
}

export default GeneralJournal;
