import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './GeneralJournalEntry.css';
import Auth from '../api/Auth.js';

class GeneralJournalEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
	      entryStatus: [],
	      searchText: ''
	    };

		this.searchTextChanged = this.searchTextChanged.bind(this);
    	this.search = this.search.bind(this);
    }

    render() {
        return (
        	<div className="generalJournal">
			</div>
        );
    }
}

export default GeneralJournalEntry;
