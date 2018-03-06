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
                <div className=".table-responsive">
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
                <div className=".container">
                    <div className="row topEntryWrapper">
                          <div className="col-lg-2 dateEntry">3/15/18</div>
                          <div className="col-lg-6">
                                <select className="form-control accountDropdown debitDropdown" value={this.state.accountID} onChange={this.changeAccount}>
                                    <option hidden>-- Select Account --</option>
                                </select>
                                <select className="form-control accountDropdown creditDropdown" value={this.state.accountID} onChange={this.changeAccount}>
                                    <option hidden>-- Select Account --</option>
                                </select>
                          </div>
                          <div className="col-lg-2">
                            <div>
                                <input type="number" className="form-control text-right" placeholder="0.00"/>
                            </div>
                          </div>
                          <div className="col-lg-2">
                          </div>
                    </div>
                    <div className="line"></div> 
                    <div className="row">
                        <div className="col-lg-5 descriptionWrapper">
                            <h4>Description</h4>
                            <textarea type="text" className="form-control description" cols="40" rows="5" placeholder="Description"/>
                        </div>
                        <div className="col-lg-4 descriptionWrapper">
                            <div className="attachmentsTitle">
                                <h4>Attachments</h4>
                                <button class="addEntityButton">+ Add</button>
                            </div>
                        </div>
                        <div className="col-lg-3 actionButtonsWrapper">
                                <button className="btn cancelButton">Cancel</button>
                                <button className="btn btn-primary">Submit</button>
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
}

export default GeneralJournal;
