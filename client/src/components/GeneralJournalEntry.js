import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import './GeneralJournal.css';
import './CommonChart.css';
import GeneralJournalAPI from '../api/GeneralJournal.js';
import AccountsAPI from '../api/Accounts.js';

import JournalEntryCreate from './JournalEntryCreate.js';
import JournalEntry from './JournalEntry.js';

class GeneralJournalEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
           entry: null,
           isLoading: true
        };

        var id = this.props.match.params.id;
        if (id) {
	        GeneralJournalAPI.getOne(id)
	            .then((entry) => {
	                this.setState({
	                    entry
	                });
	            })
	            .finally(() => {
	            	this.setState({
	            		isLoading: false
	            	});
	            });
        }
    }

    render() {
    	if (this.state.isLoading) {
    		return (<div>Loading...</div>);
    	}

        return (
            <div className="generalJournal">
                <div className="titleBar">
                    <h1>Entry # {this.state.entry.id}</h1>
                </div>
                {
                    this.state.isCreatingJournalEntry &&
                        (<JournalEntryCreate entryTypeOptions={this.state.entryTypes} accounts={this.state.accounts} onCancel={this.toggleNewJournalUI} onSubmit={this.submitNewJournalEntry} />)
                }
                <div>
                    <div className="row gridHeading">
                        <label className="hidden-xs col-sm-2"></label>
                        <label className="hidden-xs col-sm-1">Type</label>
                        <label className="hidden-xs col-sm-1">Creator</label>
                        <label className="hidden-xs col-sm-4">Accounts</label>
                        <label className="hidden-xs col-sm-2">Debit</label>
                        <label className="hidden-xs col-sm-2">Credit</label>
                    </div>
                    <div className="titleLine"></div>
                    {     
                        <JournalEntry key={this.state.entry.date_created} entry={this.state.entry} onApprove={this.approveJournalEntry.bind(this)} onReject={this.rejectJournalEntry.bind(this)}/>
                            
                    }
                </div>
            </div>
        );
    }

        approveJournalEntry(journalEntryId) {
        GeneralJournalAPI.update({ id: journalEntryId, is_approved: true })
            .then(() => {
                this.props.onNotifySuccess('Journal Entry has been successfully approved.');
                this.handleJournalFilterSelection(this.state.activeFilter);
            })
            .catch(() => {
                this.props.onNotifyError('Failed to approve journal entry.');
            });

    }

    rejectJournalEntry(journalEntryId, rejectionMemo) {
        GeneralJournalAPI.update({ id: journalEntryId, is_approved: false, rejection_memo: rejectionMemo })
            .then(() => {
                this.props.onNotifySuccess('Journal Entry has been successfully rejected.');
                this.handleJournalFilterSelection(this.state.activeFilter);
            })
            .catch((response) => {
                if (!response.length) {
                    this.props.onNotifyError('Failed to reject journal entry.');
                    return;
                }

                this.props.onNotifyError('Rejection Memo: ' + response[0]);
            });

    }
}

export default GeneralJournalEntry;