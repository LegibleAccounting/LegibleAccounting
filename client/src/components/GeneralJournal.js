import React, { Component } from 'react';
import { Nav, NavItem, Glyphicon } from 'react-bootstrap';
import DateTime from 'react-datetime';
import './GeneralJournal.css';
import './CommonChart.css';
import AuthAPI from '../api/Auth.js';
import GeneralJournalAPI from '../api/GeneralJournal.js';
import AccountsAPI from '../api/AccountsApi.js';
import Spinner from './Spinner.js';

import JournalEntryCreate from './JournalEntryCreate.js';
import JournalEntry from './JournalEntry.js';

class GeneralJournal extends Component {
    constructor(props) {
        super(props);

        this.state = {
           isLoading: true,
           isFilteringDateRange: false,
           isCreatingJournalEntry: false,
           entries: [],
           ogentries: [],
           entryTypes: [],
           searchText: '',
           accounts: null,
           activeFilter: 1
        };

        this.isStartRangeCalendarOpen = false;
        this.isEndRangeCalendarOpen = false;

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
                    }),
                    ogentries: entries.map((entry) => {
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
        this.toggleStartRangeCalendar = this.toggleStartRangeCalendar.bind(this);
        this.renderStartRangeDatePickerField = this.renderStartRangeDatePickerField.bind(this);
        this.renderEndRangeDatePickerField = this.renderEndRangeDatePickerField.bind(this);
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
                    <h1>Journalize</h1>
                    <button className="btn btn-primary newButton" type="button" onClick={this.toggleNewJournalUI}>+ Add</button>
                    {
                        AuthAPI.currentUserIsManager() && (<button className="btn btn-danger" type="button" onClick={this.closeJournal}>Close Accounts</button>)
                    }
                    <div className="filler"></div>
                    <div className="searchContainer btn-group">
                        <form onSubmit={this.search}>
                            <input type="search" className="form-control search" value={this.state.searchText} onChange={this.searchTextChanged} onBlur={this.search} placeholder="Search"/>
                        </form>
                        <button className="btn btn-primary" type="submit" onClick={this.search}>Search</button>
                    </div>
                </div>
                {
                    this.state.isCreatingJournalEntry &&
                        (<JournalEntryCreate entryTypeOptions={this.state.entryTypes} accounts={this.state.accounts} onCancel={this.toggleNewJournalUI} onSubmit={this.submitNewJournalEntry} />)
                }
                <div>
                    <div className="flex-row flex-v-center journal-filters">
                        <h4 style={{ marginLeft: '3rem', marginRight: '1rem' }}>Start Date: </h4>
                        <DateTime renderInput={this.renderStartRangeDatePickerField} timeFormat={false} dateFormat="YYYY-MM-DD" value={this.state.rangeStartDate} onChange={this.changeStartRangeDate.bind(this)} onBlur={this.setStartRangeCalendarClosed.bind(this)}/>
                        <h4 style={{ marginLeft: '1rem', marginRight: '1rem' }}>End Date: </h4>
                        <DateTime renderInput={this.renderEndRangeDatePickerField} timeFormat={false} dateFormat="YYYY-MM-DD" value={this.state.rangeEndDate} onChange={this.changeEndRangeDate.bind(this)} onBlur={this.setEndRangeCalendarClosed.bind(this)}/>
                        { !this.state.isFilteringDateRange && (<button style={{ marginLeft: '1rem' }} className="btn btn-primary" onClick={this.filterByDateRange.bind(this)}>Filter</button>) }
                        { this.state.isFilteringDateRange && (<button style={{ marginLeft: '1rem' }} className="btn btn-danger" onClick={this.removeDateRangeFilter.bind(this)}>Clear</button>) }
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

    toggleStartRangeCalendar(openCalendarFn, closeCalendarFn) {
        if (this.isStartRangeCalendarOpen) {
            closeCalendarFn();
            this.isStartRangeCalendarOpen = false;
        } else {
            openCalendarFn();
            this.isStartRangeCalendarOpen = true;
        }
    }

    toggleEndRangeCalendar(openCalendarFn, closeCalendarFn) {
        if (this.isEndRangeCalendarOpen) {
            closeCalendarFn();
            this.isEndRangeCalendarOpen = false;
        } else {
            openCalendarFn();
            this.isEndRangeCalendarOpen = true;
        }
    }

    renderStartRangeDatePickerField(props, openCalendarFn, closeCalendarFn) {
        return (
            <div>
                <button className="btn btn-default" onClick={this.toggleStartRangeCalendar.bind(this, openCalendarFn, closeCalendarFn)}>
                    <Glyphicon glyph="calendar" />
                </button>
                <label className="date-left-margin">{ this.state.rangeStartDate }</label>
            </div>
        );
    }

    renderEndRangeDatePickerField(props, openCalendarFn, closeCalendarFn) {
        return (
            <div>
                <button className="btn btn-default" onClick={this.toggleEndRangeCalendar.bind(this, openCalendarFn, closeCalendarFn)}>
                    <Glyphicon glyph="calendar" />
                </button>
                <label className="date-left-margin">{ this.state.rangeEndDate }</label>
            </div>
        );
    }

    setStartRangeCalendarClosed() {
        this.isStartRangeCalendarOpen = false;
    }

    setEndRangeCalendarClosed() {
        this.isEndRangeCalendarOpen = false;
    }

    changeStartRangeDate(momentValue) {
        this.setState({
            rangeStartDate: momentValue.format('YYYY-MM-DD')
        });
    }

    changeEndRangeDate(momentValue) {
        this.setState({
            rangeEndDate: momentValue.format('YYYY-MM-DD')
        });
    }

    filterByDateRange() {
        if (!this.state.rangeStartDate || !this.state.rangeEndDate) {
            return;
        }

        let approvalFilter;
        if (this.state.activeFilter === 2) {
            approvalFilter = true;
        } else if (this.state.activeFilter === 3) {
            approvalFilter = false;
        } else {
            approvalFilter = null;
        }

        this.setState({ isLoading: true });
        GeneralJournalAPI.search(approvalFilter, this.state.searchText, { dateStart: this.state.rangeStartDate, dateEnd: this.state.rangeEndDate })
            .then((entries) => {
                this.setState({
                    isFilteringDateRange: true,
                    entries: entries.map((entry) => {
                        entry.transactions = this.getIndexedTransactions(entry.transactions);
                        return entry;
                    })
                })
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    removeDateRangeFilter() {
        this.setState({
            isFilteringDateRange: false,
            rangeStartDate: '',
            rangeEndDate: '',
            entries: this.state.ogentries
        });
    }

    closeJournal() {
        AccountsAPI.closeAccounts()
            .then(({ message }) => {
                this.props.onNotifySuccess(message);
                GeneralJournalAPI.getAll()
                    .then((entries) => {
                        this.setState({
                            activeFilter: 1,
                            entries: entries.map((entry) => {
                                entry.transactions = this.getIndexedTransactions(entry.transactions);
                                return entry;
                            }),
                            ogentries: entries.map((entry) => {
                                entry.transactions = this.getIndexedTransactions(entry.transactions);
                                return entry;
                            })
                        });
                    });
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

        let approvalFilter;
        if (this.state.activeFilter === 2) {
            approvalFilter = true;
        } else if (this.state.activeFilter === 3) {
            approvalFilter = false;
        } else {
            approvalFilter = null;
        }

        this.setState({ isLoading: true });
        GeneralJournalAPI.search(approvalFilter, this.state.searchText)
            .then((entries) => {
                this.setState({
                    isFilteringDateRange: false,
                    rangeStartDate: '',
                    rangeEndDate: '',
                    entries: entries.map((entry) => {
                        entry.transactions = this.getIndexedTransactions(entry.transactions);
                        return entry;
                    })
                })
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
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
                this.setState({
                    entries: this.state.entries.map(entry => {
                        if (entry.id === journalEntryId) {
                            entry.is_approved = true;
                        }

                        return entry;
                    }),
                    ogentries: this.state.ogentries.map(entry => {
                        if (entry.id === journalEntryId) {
                            entry.is_approved = true;
                        }

                        return entry;
                    })
                });
            })
            .catch(() => {
                this.props.onNotifyError('Failed to approve journal entry.');
            });

    }

    rejectJournalEntry(journalEntryId, rejectionMemo) {
        GeneralJournalAPI.update({ id: journalEntryId, is_approved: false, memo: rejectionMemo })
            .then(() => {
                this.props.onNotifySuccess('Journal Entry has been successfully rejected.');
                this.setState({
                    entries: this.state.entries.map(entry => {
                        if (entry.id === journalEntryId) {
                            entry.is_approved = false;
                        }

                        return entry;
                    }),
                    ogentries: this.state.ogentries.map(entry => {
                        if (entry.id === journalEntryId) {
                            entry.is_approved = false;
                        }

                        return entry;
                    })
                });
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
        this.setState({ isLoading: true });
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
                searchText: '',
                isFilteringDateRange: false,
                rangeStartDate: '',
                rangeEndDate: '',
                activeFilter: selectedKey,
                entries: entries.map((entry) => {
                    entry.transactions = this.getIndexedTransactions(entry.transactions);
                    return entry;
                }),
                ogentries: entries.map((entry) => {
                    entry.transactions = this.getIndexedTransactions(entry.transactions);
                    return entry;
                })
            });
        }).finally(() => {
            this.setState({ isLoading: false });
        });
    }
}

export default GeneralJournal;
