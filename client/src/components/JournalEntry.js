import React, { Component } from 'react';
import { Popover } from 'react-bootstrap';
import { OverlayTrigger } from 'react-bootstrap';
import Auth from '../api/Auth.js';
import './JournalEntry.css';

class JournalEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRejecting: false,
            rejectionMemo: ''
        };
    }

    render() {
        return (
            <div className="journalEntry">
                <div className="row topOfEntryWrapper">
                    <div className="col-xs-12 col-sm-2 dateEntry">
                        {this.props.entry.date}
                    </div>
                    <div className="col-xs-12 col-sm-1">
                        <div className="typeEntry">{this.props.entry.entry_type}</div>
                    </div>
                    <div className="col-xs-12 col-sm-1">
                        <div className="typeEntry">{this.props.entry.creator.username}</div>
                    </div>
                    <div className="col-xs-12 col-sm-8 largeWrapper">
                        {
                            this.props.entry.transactions.map((item, index) => (
                                <div className="row auto-height transactionWrapper" key={item.affected_account.id}>
                                    <div className="col-xs-12 col-sm-6">
                                        <div className={"accountNameWrapper " + 'accountEntry ' + (item.is_debit ? '' : 'creditAccountEntry')}>
                                            <div className="accountName">
                                               <a href={'/accounts/'+item.affected_account.id + '/ledger'}>{item.affected_account.account_number}</a> - {item.affected_account.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={ 'amountEntry col-xs-12 ' +
                                      (item.is_debit ? 'col-sm-6' : 'col-sm-3 col-sm-offset-3')}>
                                        <label
                                          className={ item.is_debit ? 'dollarSignDebit' : 'dollarSignCredit' }
                                          style={{visibility: item.typeIndex !== 0 && 'hidden'}}>$
                                        </label>
                                        <div className="amountEntryValue">{item.value}</div>
                                    </div>
                                </div>
                            ))
                        }
                      </div>
                </div>
                
                <div className="row bottomOfEntryWrapper">
                    <div className="col-md-8 descriptionWrapperWrapper">
                        <div className="descriptionWrapper" style={{ visibility: this.props.entry.description === "" && 'hidden' }}>
                            <div className="descriptionTitle">Description:</div>
                            <div className="description">{this.props.entry.description}</div>
                        </div>
                    </div>
                    <OverlayTrigger
                      trigger="click"
                      rootClose
                      placement="bottom"
                      overlay={(
                          <Popover id="popover-trigger-click-root-close" title="Attachments">
                            {
                                this.props.entry.receipts.map((item, index) => (
                                    <div key={item.file} className="attachment-name-overflow">
                                        <a href={item.file}>{item.original_filename}</a>
                                    </div>
                                ))
                            }
                          </Popover>
                      )}>  
                        <span
                            className="glyphicon glyphicon-paperclip attachmentButton"
                            style={{visibility: !this.props.entry.receipts.length && 'hidden'}}>
                        </span>  
                    </OverlayTrigger>
                    {
                        !this.state.isRejecting ? (                        
                        <div className="col-md-4 actionButtonsWrapper flex-row">
                            <div className="flex-fill"></div>
                            <button className="btn cancelButton submitButton"
                              style={{ display: (!(Auth.currentUserIsManager()) || !(this.props.entry.is_approved === null)) && 'none' }}
                              onClick={this.beginEntryRejection.bind(this)}>Reject</button>
                            <button
                              style={{ display: (!(Auth.currentUserIsManager()) || !(this.props.entry.is_approved === null)) && 'none' }}
                              className="btn btn-primary submitButton" onClick={this.delegateJournalEntryApproval.bind(this)}>Approve</button>

                            <label className="approvedRejectedWrapper" style={{ display: (this.props.entry.is_approved === null) && 'none' }}>
                                {
                                    this.props.entry.is_approved ? (
                                        <div className="approved">Approved</div>
                                    ) : (
                                        <div className="rejected">Rejected: {this.props.entry.rejection_memo}</div>
                                    )
                                }
                            </label>
                        </div>
                        ) : (<div className="col-md-4"></div>)
                    }
                </div>
                {
                    this.state.isRejecting ? (
                        <div className="flex-row rejectionReasonForm">
                            <input type="text" className="form-control" placeholder="Rejection Reason" style={{width: '400px' }} value={this.state.rejectionMemo} onChange={this.changeRejectionMemo.bind(this)} />
                            <div className="flex-fill"></div>
                            <button className="btn cancelButton" onClick={this.cancelEntryRejection.bind(this)}>Cancel</button>
                            <button className="btn btn-primary submitButton"  onClick={this.delegateJournalEntryRejection.bind(this)}>Reject</button>
                        </div>
                    ) : (
                        <div></div>
                    )
                }
                <div className="line"></div> 
            </div>
        );
    }

    delegateJournalEntryApproval() {
        this.props.onApprove(this.props.entry.id);
    }

    changeRejectionMemo(event) {
        this.setState({
            rejectionMemo: event.target.value
        });
    }

    beginEntryRejection() {
        this.setState({
            isRejecting: true
        });
    }

    cancelEntryRejection() {
        this.setState({
            isRejecting: false
        });
    }

    delegateJournalEntryRejection() {
        this.props.onReject(this.props.entry.id, this.state.rejectionMemo);
        this.setState({
            isRejecting: false
        });
    }
}

export default JournalEntry;
