import React, { Component } from 'react';
import styles from './AddToAccounts.css';
import AccountTypesAPI from '../api/AccountTypes.js';
import { NavLink } from 'react-router-dom';

class AddToAccountsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	accountTypes: []
        }

        AccountTypesAPI.getAll()
        .then(data => {
        	this.setState({
        		accountTypes: data
        	});
        });
    }

    render() {
        return (
        	<div className="addToAccounts">	
        		<h1 class="page-title">Add Account</h1>
                <div class="row">
					<div class="textColumn container">
						Account Type
					</div>
					<div class="fieldColumn container">
						<select class="form-control textBox">
							{ this.state.accountTypes.length ? (
								this.state.accountTypes.map((item, index) => (
									<option>{item.starting_number} - {item.name}</option>
									)
								)
							) : (
								<h2>No Account Types</h2>
							)}
						</select>
					</div>
				</div>
				<div class="row">
					<div class="textColumn container">
						Account Name
					</div>
					<div class="fieldColumn container">
						<input 	type="text"
								name="accountNameTextField"
								class="form-control textBox"
								maxlength="200"/>
					</div>
				</div>	
				<div class="row">
					<div class="textColumn container">
						Account Active
					</div>
					<div class="fieldColumn container">
						<input 	type="checkbox" 
								name="accountActiveCheckBox"
								class="accountActiveCheckBox"
								value="true"
								defaultChecked="checked"/>
					</div>
				</div>
				<div class="row">
					<div class="textColumn container">
						Initial Balance
					</div>
					<div class="fieldColumn container">
						<input	type="number"
								name="initialBalanceTextField"
								class="form-control initialBalanceTextField currency"
								placeholder="$0.00"
								step="0.01"
								min="0"/>
					</div>
				</div>
				<div class="row">
					<div class="textColumn container">
						Comments
					</div>
					<div class="fieldColumn container">
						<input 	type="text"
								name="commentsTextField"
								class="form-control textBox"
								maxlength="200"/>
					</div>
				</div>	
				<div>
					<input type="submit" value="Create" name="createButton" className="btn btn-primary createButton"/>
				</div>
        		<div class="fillSpace"></div>
				<div>
					<NavLink className="NavLink btn btn-primary newButton" to="/accounts">&lt; Back to Accounts</NavLink>
				</div>
			</div>
		);
    }
}

export default AddToAccountsPage;
