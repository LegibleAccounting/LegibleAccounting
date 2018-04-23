import React, { Component } from 'react';
import './GeneralJournal.css';
import './CommonChart.css';
import GeneralJournalAPI from '../api/GeneralJournal.js';
import Spinner from './Spinner.js';
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
                    entry.transactions = this.getIndexedTransactions(entry.transactions);

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
            return (
                <div style={{ marginTop: '2rem' }} className="full-height flex-row flex-v-center flex-h-center">
                    <Spinner />
                </div>
            );
        }

        return (
            <div className="generalJournal">
                <div className="titleBar">
                    <h1>Entry # {this.state.entry.id}</h1>
                </div>
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

    getIndexedTransactions(transactions) {
        let offset = null;
        return transactions
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
            });
    }

    approveJournalEntry(journalEntryId) {
        GeneralJournalAPI.update({ id: journalEntryId, is_approved: true })
            .then(() => {
                this.props.onNotifySuccess('Journal Entry has been successfully approved.');
            })
            .catch(() => {
                this.props.onNotifyError('Failed to approve journal entry.');
            });

    }

    rejectJournalEntry(journalEntryId, rejectionMemo) {
        GeneralJournalAPI.update({ id: journalEntryId, is_approved: false, memo: rejectionMemo })
            .then(() => {
                this.props.onNotifySuccess('Journal Entry has been successfully rejected.');
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
