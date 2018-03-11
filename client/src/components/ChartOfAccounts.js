import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './ChartOfAccounts.css';
import './CommonChart.css';
import Auth from '../api/Auth.js';
import AccountsAPI from '../api/Accounts.js';

class ChartOfAccounts extends Component {
    constructor(props) {
        super(props);

        this.state = {
	      accounts: [],
	      ogAccounts: [],
	      searchText: ''
	    };

		this.searchTextChanged = this.searchTextChanged.bind(this);
    	this.search = this.search.bind(this);

        AccountsAPI.getAll(true)
        	.then(data => {
        		this.setState({
        			accounts: data,
        			ogAccounts: data
        		});
        	});
    }

    render() {
        return (
        	<div className="chartOfAccounts">
        		<div className="titleBar">
		            <h1>Chart of Accounts</h1>
                    {
                        Auth.currentUser.groups.find(group => group.name === 'Administrator') ? (
					       <NavLink className="NavLink btn btn-primary newButton" to="/chart-of-accounts/add">+ Add</NavLink> 
                        ) : (
                            <span></span>
                        )
                    }
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
						    <th className="accountNumber">#</th>
						    <th className="name">Name</th>
						    <th className="initialBalance">Balance</th>
						    <th className="comments">Comments</th>
						    <th className="edits"></th>
					    </tr>
					  </thead>
					  <tbody>
				       	{ this.state.accounts.length ? (
				          this.state.accounts.map((item, index) => (
				             <tr key={item.id}>
						    	<td>{item.account_number}</td>
						    	<td>{item.name}</td>
						    	<td align="right"></td>
						    	<td>{item.description}</td>
                                <td>
                                {
                                    Auth.currentUser.groups.find(group => group.name === 'Administrator' || group.name === 'Manager') ? (
                                        <NavLink className="NavLink btn btn-primary newButton" to={`/accounts/${item.id}`}>Edit</NavLink>
                                    ) : (
                                        <span></span>
                                    )
                                }
                                </td>
						  	</tr>
				          ))
				        ) : (
				            <tr>
                                <td></td>
                                <td>No Accounts</td>
                                <td></td>
                                <td></td>
                            </tr>
				        )}
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
    			accounts: this.state.ogAccounts
    		});
    	}
    }

    search(event) {
    	event.preventDefault();
    	 AccountsAPI.search(true, this.state.searchText)
        	.then(data => {
        		this.setState({
        			accounts: data
        		});
        	});
    }
}

export default ChartOfAccounts;
