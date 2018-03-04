import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './GeneralJournalEntry.css';
import Auth from '../api/Auth.js';

class GeneralJournalEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
	      entryStatus: [],
	    };
    }

    render() {
        return (
        	<div className="generalJournalEntry">
                <div className="date debitColumn">10/12/18</div>
                <div className="accountsColumn">Account 1</div>
			</div>
        );
    }
}

export default GeneralJournalEntry;
