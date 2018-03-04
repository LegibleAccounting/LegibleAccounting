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
	      searchText: ''
	    };

		this.searchTextChanged = this.searchTextChanged.bind(this);
    	this.search = this.search.bind(this);
    }

    render() {
        return (
        	<div className="generalJournal">
        		<div className="titleBar">
		            <h1>General Journal</h1>
                    {
					   <NavLink className="NavLink btn btn-primary newButton" to="">Add +</NavLink> 
                    }
					<div className="filler"></div>
					<div className="searchContainer btn-group">
						<form onSubmit={this.search}>
		            		<input type="search" className="form-control search" onChange={this.searchTextChanged} onBlur={this.search} placeholder="Search"/>
		            	</form>
		            	<button className="btn btn-primary" type="submit" onClick={this.search}>Search</button>
		            </div>
	            </div>
                <div className="tableWrapper .table-responsive">
                    <table className="table table-hover">
                          <thead>
                            <tr>
                                <th className="dateColumn">Date</th>
                                <th className="accountsColumn">Accounts</th>
                                <th className="debitColumn">Debit</th>
                                <th className="creditColumn">Credit</th>
                            </tr>
                          </thead>
                        </table>
                </div>
                <div className="entriesWrapper">
                    <GeneralJournalEntry> </GeneralJournalEntry>
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
}

export default GeneralJournal;
