import React, { Component } from 'react';
import './Logs.css';
import './CommonChart.css';
import LogsAPI from '../api/Logs.js';

class Logs extends Component {
    constructor(props) {
        super(props);

        this.state = {
          logs: [],
          ogLogs: [],
          searchText: ''
        };

        this.searchTextChanged = this.searchTextChanged.bind(this);
        this.search = this.search.bind(this);

        LogsAPI.getAll()
            .then(data => {
                this.setState({
                    logs: data,
                    ogLogs: data
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

                <div className="tableWrapper .table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                            <th className="changed">Changed</th>
                            <th className="changes">Old Value | New Value</th>
                            <th className="changedBy">Changed By</th>
                            <th className="changeDate">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        { 
                        	this.state.logs.length ? (
	                          	this.state.logs.map((item, index) => (
	                          		<tr key={index}>
		                          		<td>{item.object_repr}</td>
				                        
				                        <td>
			                          		{item.changes ? (
					                          	Object.keys(item.changes).map((itemName, index) => (
					                          		<div key={index}>
						                          		<div>{itemName} --- From: {item.changes[itemName][0]} | To: {item.changes[itemName][1]}</div>
						                          	</div>
					                          	))
					                        ) : (
					                        	<div>No Changes</div>
					                        )}
				                        </td>

				                        <td>{item.actor.username}</td>
				                        <td>{item.timestamp}</td>
			                    	</tr>
	                          	))
	                        ) : (
	                        	//else
	                            <tr>
	                                <td></td>
	                                <td>No Logs</td>
	                                <td></td>
	                                <td></td>
	                                <td></td>
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
}

export default Logs;
