import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import './GeneralJournal.css';
import './CommonChart.css';
import AuthAPI from '../api/Auth.js';
import GeneralJournalAPI from '../api/GeneralJournal.js';
import AccountsAPI from '../api/AccountsApi.js';

import JournalEntryCreate from './JournalEntryCreate.js';
import JournalEntry from './JournalEntry.js';

class GeneralJournal extends Component {
    constructor(props) {
        super(props);

        this.state = {
           isLoading: true,
           isCreatingJournalEntry: false,
           entries: [],
           ogentries: [],
           entryTypes: [],
           searchText: '',
           accounts: null,
           activeFilter: 1
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
                        entry.transactions = this.getIndexedTransactions(entry.transactions);
                        return entry;
                    })
                });
            })
            .finally(() => {
                this.setState({
                    isLoading: false
                });
            });

        this.searchTextChanged = this.searchTextChanged.bind(this);
        this.search = this.search.bind(this);
        this.toggleNewJournalUI = this.toggleNewJournalUI.bind(this);
        this.submitNewJournalEntry = this.submitNewJournalEntry.bind(this);
        this.closeJournal = this.closeJournal.bind(this);
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="full-height flex-row flex-h-center flex-v-center">
                    <h1>Loading Journal...</h1>
                </div>
            );
        }

        return (
            <div className="generalJournal">
                <div className="titleBar">
                    <h1>Journalize</h1>
                    <button className="btn btn-primary newButton" type="button" onClick={this.toggleNewJournalUI}>+ Add</button>
                    {
                        AuthAPI.currentUserIsManager() && (<button className="btn btn-danger" type="button" onClick={this.closeJournal}>Close Accounts</button>)
                    }
                    <div className="filler"></div>
                    <div className="searchContainer btn-group">
                        <form onSubmit={this.search}>
                            <input type="search" className="form-control search" onChange={this.searchTextChanged} onBlur={this.search} placeholder="Search"/>
                        </form>
                        <button className="btn btn-primary" type="submit" onClick={this.search}>Search</button>
                    </div>
                </div>
                {
                    this.state.isCreatingJournalEntry &&
                        (<JournalEntryCreate entryTypeOptions={this.state.entryTypes} accounts={this.state.accounts} onCancel={this.toggleNewJournalUI} onSubmit={this.submitNewJournalEntry} />)
                }
                <div>
                    <div className="flex-row journal-filters">
                        <div className="flex-fill"></div>
                        <Nav bsStyle="pills" activeKey={this.state.activeFilter} onSelect={this.handleJournalFilterSelection.bind(this)}>
                            <NavItem eventKey={1}>
                              All
                            </NavItem>
                            <NavItem eventKey={2}>
                              Approved
                            </NavItem>
                            <NavItem eventKey={3}>
                                Needs Approval
                            </NavItem>
                            <NavItem eventKey={4}>
                              Rejected
                            </NavItem>
                        </Nav>
                    </div>
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
                        (!this.state.isCreatingJournalEntry && (!this.state.entries || this.state.entries.length === 0)) &&
                            (<h2 className="text-center pad">No Journal Entries exist.</h2>)
                    }
                    {
                            this.state.entries.map((item, index) => (
                                <JournalEntry key={item.date_created} entry={item} onApprove={this.approveJournalEntry.bind(this)} onReject={this.rejectJournalEntry.bind(this)}/>
                            ))
                    }
                </div>
            </div>
        );
    }

    closeJournal() {
        AccountsAPI.closeAccounts()
            .then(({ message }) => {
                this.props.onNotifySuccess(message);
            })
            .catch((response ) => {
                this.props.onNotifyError(response.message || response.detail || 'An error occurred.');
            });
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
            .then((newJournalEntry) => {
                this.props.onNotifySuccess('Journal Entry has been successfully created.');
                this.setState({
                    isCreatingJournalEntry: false
                });

                GeneralJournalAPI.getAll()
                    .then((entries) => {
                        this.setState({
                            activeFilter: 1,
                            entries: entries.map((entry) => {
                                entry.transactions = this.getIndexedTransactions(entry.transactions);
                                return entry;
                            })
                        });
                    });
            })
            .catch((response) => {
                let errorFields = Object.keys(response);
                if (!errorFields.length) {
                    this.props.onNotifyError('Failed to create journal entry.');
                    return;
                }

                if (response.entry_type && response.entry_type.length) {
                    this.props.onNotifyError('Entry Type: ' + response.entry_type[0]);
                } else if (response.transactions && response.transactions.length) {
                    let firstTransaction = response.transactions[0];
                    let transactionErrorFields = Object.keys(firstTransaction);
                    if (!transactionErrorFields.length) {
                        this.props.onNotifyError('Failed to create journal entry due to malformed transaction(s).');
                        return;
                    }

                    if (firstTransaction.affected_account && firstTransaction.affected_account.length) {
                        this.props.onNotifyError('Transaction - Affected Account: ' + firstTransaction.affected_account[0]);
                    } else if (firstTransaction.value && firstTransaction.value.length) {
                        this.props.onNotifyError('Transaction - Value: ' + firstTransaction.value[0]);
                    } else {
                        this.props.onNotifyError('Failed to create journal entry due to a malformed transaction.');
                    }
                } else if (response.receipts && response.receipts.length) {
                    let firstReceipt = response.receipts[0];
                    let receiptErrorFields = Object.keys(firstReceipt);
                    if (!receiptErrorFields.length) {
                        this.props.onNotifyError('Failed to create journal entry due to malformed receipt(s).');
                        return;
                    }

                    if (firstReceipt.file && firstReceipt.file.length) {
                        this.props.onNotifyError('Receipt - File: ' + firstReceipt.file[0]);
                    } else if (firstReceipt.original_filename && firstReceipt.original_filename.length) {
                        this.props.onNotifyError('Receipt - Filename: ' + firstReceipt.original_filename[0]);
                    } else {
                        this.props.onNotifyError('Failed to create journal entry due to malformed receipt.');
                    }
                } else {
                    this.props.onNotifyError('Failed to create journal entry.');
                }
            });
    }

    approveJournalEntry(journalEntryId, approvalMemo) {
        GeneralJournalAPI.update({ id: journalEntryId, is_approved: true, memo: approvalMemo })
            .then(() => {
                this.props.onNotifySuccess('Journal Entry has been successfully approved.');
                this.handleJournalFilterSelection(this.state.activeFilter);
            })
            .catch(() => {
                this.props.onNotifyError('Failed to approve journal entry.');
            });

    }

    rejectJournalEntry(journalEntryId, rejectionMemo) {
        GeneralJournalAPI.update({ id: journalEntryId, is_approved: false, memo: rejectionMemo })
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

    handleJournalFilterSelection(selectedKey) {
        let awaitPromise = null;
        if (selectedKey === 1) {
            awaitPromise = GeneralJournalAPI.getAll();
        } else if (selectedKey === 2) {
            awaitPromise = GeneralJournalAPI.search(true);
        } else if (selectedKey === 4) {
            awaitPromise = GeneralJournalAPI.search(false);
        } else {
            // 3
            // TODO: Do better
            awaitPromise = GeneralJournalAPI.getAll()
                .then((entries) => {
                    return entries.filter(entry => entry.is_approved === null);
                });
        }

        awaitPromise.then((entries) => {
            this.setState({
                activeFilter: selectedKey,
                entries: entries.map((entry) => {
                    entry.transactions = this.getIndexedTransactions(entry.transactions);
                    return entry;
                })
            });
        });
    }
}

export default GeneralJournal;
