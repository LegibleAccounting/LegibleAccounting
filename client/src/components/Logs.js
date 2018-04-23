import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import './Logs.css';
import './CommonChart.css';
import LogsAPI from '../api/Logs.js';
import Spinner from './Spinner.js';

class Logs extends Component {
    constructor(props) {
        super(props);

        this.state = {
          logs: [],
          ogLogs: [],
          searchText: '',
          isLoading: true,
          sortState: {}
        };

        this.searchTextChanged = this.searchTextChanged.bind(this);
        this.search = this.search.bind(this);

        LogsAPI.getAll()
            .then(data => {
                this.setState({
                    logs: data,
                    ogLogs: data,
                    isLoading: false
                });
            });
    }

    render() {
        return (
            <div className="logs">
                <div className="titleBar">
                    <h1>Logs</h1>
                    <div className="filler"></div>
                    <div className="searchContainer btn-group">
                        <form onSubmit={this.search}>
                            <input type="search" className="form-control search" onChange={this.searchTextChanged} onBlur={this.search} placeholder="Search"/>
                        </form>
                        <button className="btn btn-primary" type="submit" onClick={this.search}>Search</button>
                    </div>
                </div>

                <div className="tableWrapper">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                            <th className="changed">Changed
                            {
                                !this.state.sortState.object_repr || this.state.sortState.object_repr === 'asc' ? (
                                    <Glyphicon glyph="chevron-up" className={!this.state.sortState.object_repr ? 'sorter sorter-inactive' : 'sorter'}
                                      onClick={this.sort.bind(this, 'object_repr')} />
                                ): (
                                    <Glyphicon glyph="chevron-down" className="sorter"
                                      onClick={this.sort.bind(this, 'object_repr')} />
                                )
                            }
                            { this.state.sortState.object_repr }
                            </th>
                            <th className="change-fieldName">Field Changed</th>
                            <th className="change-fromValue">From</th>
                            <th className="change-toValue">To</th>
                            <th className="changedBy">Changed By
                            {
                                !this.state.sortState.actor__username || this.state.sortState.actor__username === 'asc' ? (
                                    <Glyphicon glyph="chevron-up" className={!this.state.sortState.actor__username ? 'sorter sorter-inactive' : 'sorter'}
                                      onClick={this.sort.bind(this, 'actor__username')} />
                                ): (
                                    <Glyphicon glyph="chevron-down" className="sorter"
                                      onClick={this.sort.bind(this, 'actor__username')} />
                                )
                            }
                            { this.state.sortState.actor__username }
                            </th>
                            <th>Date
                            {
                                !this.state.sortState.timestamp || this.state.sortState.timestamp === 'asc' ? (
                                    <Glyphicon glyph="chevron-up" className={!this.state.sortState.timestamp ? 'sorter sorter-inactive' : 'sorter'}
                                      onClick={this.sort.bind(this, 'timestamp')} />
                                ): (
                                    <Glyphicon glyph="chevron-down" className="sorter"
                                      onClick={this.sort.bind(this, 'timestamp')} />
                                )
                            }
                            { this.state.sortState.timestamp }
                            </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                        	this.state.logs.length ? (
	                          	this.state.logs.map((item, index) => (
	                          		<tr key={index}>
		                          		<td>{item.object_repr}</td>

				                        <td colSpan="3">
                                            <ul className="list-group">
                                                {Object.keys(item.changes).map((itemName, index) => (
                                                    <li className="list-group-item" key={index}>
                                                        <div className="change-Wrapper">{itemName}</div>
                                                        <div className="change-Wrapper"><b>{item.changes[itemName][0]}</b></div>
                                                        <div className="change-Wrapper"><b>{item.changes[itemName][1]}</b></div>
                                                    </li>
                                                ))}
                                            </ul>
				                        </td>

				                        <td>{item.actor.username}</td>
				                        <td>{item.timestamp}</td>
			                    	</tr>
	                          	))
	                        ) : (
                                <tr>
                                    <td colSpan="1000" className="text-center">
                                        <div style={{ marginTop: '4rem' }}>
                                            { this.state.isLoading ? (
                                                <Spinner />
                                            ) : ('No Logs') }
                                        </div>
                                    </td>
                                </tr>
	                        )
                   		}
                       </tbody>
                    </table>
                </div>
            </div>
        );
    }

    searchTextChanged(event) {
        this.setState({ searchText: event.target.value });
        if (event.target.value === '') {
            this.setState({
                logs: this.state.ogLogs
            });
        }
    }

    search(event) {
        event.preventDefault();
         LogsAPI.search(this.state.searchText)
        .then(data => {
            this.setState({
                logs: data
            });
        });
    }

    sort(propertyName, multiSearchProps=null) {
        this.setState({
            isLoading: true
        });

        let awaitPromise;

        if (!this.state.sortState[propertyName]) {
             awaitPromise = LogsAPI.search(this.state.searchText, (Array.isArray(multiSearchProps) ? multiSearchProps : [propertyName]), false)
                .then((logs) => {
                    this.setState({
                        logs,
                        sortState: {
                            [propertyName]: 'desc'
                        }
                    });
                });
        } else if (this.state.sortState[propertyName] === 'desc') {
            awaitPromise = LogsAPI.search(this.state.searchText, (Array.isArray(multiSearchProps) ? multiSearchProps : [propertyName]), true)
                .then((logs) => {
                    this.setState({
                        logs,
                        sortState: {
                            [propertyName]: 'asc'
                        }
                    });
                });
        } else {
            if (!this.state.searchText) {
                awaitPromise = Promise.resolve();
                this.setState({
                    logs: this.state.ogLogs,
                    sortState: {}
                });
            } else {
                awaitPromise = LogsAPI.search(this.state.searchText)
                    .then((logs) => {
                        this.setState({
                            logs,
                            sortState: {}
                        });
                    });
            }
        }

        awaitPromise.finally(() => {
            this.setState({
                isLoading: false
            });
        });
    }
}

export default Logs;
