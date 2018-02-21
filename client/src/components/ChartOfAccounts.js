import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './ChartOfAccounts.css';

class ChartOfAccounts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        	<div className="chartOfAccounts">
        		<div className="titleBar">
		            <h1>Chart of Accounts</h1>
					<NavLink className="NavLink btn btn-primary newButton" to="/chart-of-accounts/add">New +</NavLink> 
					<div className="filler"></div>
					<div className="searchContainer">
		            	<input type="text" class="form-control search" placeholder="Search"/>
		            	<button className="btn btn-default" type="submit">Search</button>
		            </div>
	            </div>

	            <div className="tableWrapper">
			        <table className="table table-hover">
					  <thead>
					  	<tr>
						    <th className="accountNumber">Account Number</th>
						    <th className="name">Name</th>
						    <th className="initialBalance">Initial Balance</th>
						    <th className="isActive">Is Active</th>
						    <th className="comments">Comments</th>
					    </tr>
					  </thead>
					  <tbody>
						  <tr>
						    <td>1</td>
						    <td>Cash</td>
						    <td>0</td>
						    <td>Yes</td>
						    <td></td>
						  </tr>
						  <tr>
						    <td>2</td>
						    <td>Accounts Payable</td>
						    <td>0</td>
						    <td>Yes</td>
						    <td></td>
						  </tr>
						</tbody>
					</table>
				</div>
			</div>
        );
    }
}

export default ChartOfAccounts;
