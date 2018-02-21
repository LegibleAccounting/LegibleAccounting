import React, { Component } from 'react';
import styles from './AddToChartOfAccounts.css';

class AddToChartOfAccountsPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        	<body>
        	<div className="addToChartOfAccounts">	
        		<h1 class="page-title">Add Account</h1>
				
					<form>
						Account ID
						<select>
							<option value="1">100 - Cash</option>
							<option value="2">101 - Petty Cash</option>
							<option value="3">201 - Accounts Payable</option>
						</select><br/>
						Account Active  <input 	type="checkbox" 
												name="accountActiveCheckBox" /><br/>
						Initial Balance  <input type="text" name="initialBalanceTextField"/><br/>
						Comments  <input type="text" name="commentsTextField"/><br/>
						<input type="submit" value="Create" name="createButton" className="btn btn-default createButton"/>
					</form>
				</div>
				<div>
					<button>&lt; Back to Chart of Accounts</button>
				</div>
			</body>
		);
    }
}

export default AddToChartOfAccountsPage;
