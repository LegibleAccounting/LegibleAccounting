import React, { Component } from 'react';
import { Popover } from 'react-bootstrap';
import { OverlayTrigger } from 'react-bootstrap';
import './JournalEntry.css';

class JournalEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {};
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
                    <div className="col-xs-12 col-sm-9 largeWrapper">
                        {
                            this.props.entry.transactions.map((item, index) => (
                                <div className="row auto-height transactionWrapper" key={item.affected_account.id}>
                                    <div className="col-xs-12 col-sm-6">
                                        <div className="accountNameWrapper">
                                            <OverlayTrigger
                                              trigger="click"
                                              rootClose
                                              placement="bottom"
                                              overlay={(
                                                  <Popover id="popover-trigger-click-root-close" title="Attachments">
                                                    {
                                                        item.receipts.map((item, index) => (
                                                            <div key={item.file} className="attachment-name-overflow">
                                                                <a href={item.file}>{item.original_filename}</a>
                                                            </div>
                                                        ))
                                                    }
                                                  </Popover>
                                              )}>  
                                                <span
                                                    className={"glyphicon glyphicon-paperclip attachmentButton " +
                                                    'accountEntry ' + (item.is_debit ? '' : 'creditAccountEntry')}
                                                    style={{visibility: !item.receipts.length && 'hidden'}}>
                                                </span>  
                                            </OverlayTrigger>

                                            <div className="accountName">
                                               {item.affected_account.account_number + " - " + item.affected_account.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={ 'amountEntry col-xs-12 ' + (item.is_debit ? 'col-sm-6' : 'col-sm-3 col-sm-offset-3') }>
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
                    <div className="col-md-8 descriptionWrapperWrapper" hidden={this.props.entry.description === ""}>
                        <div className="descriptionWrapper">
                            <div className="descriptionTitle">Description:</div>
                            <div className="description">{this.props.entry.description}</div>
                        </div>
                    </div>
                    <div className="col-md-4 actionButtonsWrapper">
                       
                    </div>
                </div>
                <div className="line"></div> 
            </div>
        );
    }
}

export default JournalEntry;
