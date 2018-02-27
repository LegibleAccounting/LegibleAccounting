import React, { Component } from 'react';
import './AddToAccounts.css';
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
        		<h1 className="page-title">Add Account</h1>
                <div className="row">
					<div className="textColumn container">
						Account Type
					</div>
					<div className="fieldColumn container">
						<select className="form-control textBox">
							{
                                this.state.accountTypes.map((item, index) => (
                                    <option key={item.id}>{item.starting_number} - {item.name}</option>
                                ))
							}
						</select>
					</div>
				</div>
				<div className="row">
					<div className="textColumn container">
						Account Name
					</div>
					<div className="fieldColumn container">
						<input 	type="text"
								name="accountNameTextField"
								className="form-control textBox"
								maxLength="200"/>
					</div>
				</div>	
				<div className="row">
					<div className="textColumn container">
						Account Active
					</div>
					<div className="fieldColumn container">
						<input 	type="checkbox" 
								name="accountActiveCheckBox"
								className="accountActiveCheckBox"
								value="true"
								defaultChecked="checked"/>
					</div>
				</div>
				<div className="row">
					<div className="textColumn container">
						Initial Balance
					</div>
					<div className="fieldColumn container">
						<input	type="number"
								name="initialBalanceTextField"
								className="form-control initialBalanceTextField currency"
								placeholder="$0.00"
								step="0.01"
								min="0"/>
					</div>
				</div>
				<div className="row">
					<div className="textColumn container">
						Comments
					</div>
					<div className="fieldColumn container">
						<input 	type="text"
								name="commentsTextField"
								className="form-control textBox"
								maxLength="200"/>
					</div>
				</div>	
				<div>
					<input type="submit" value="Create" name="createButton" className="btn btn-primary createButton"/>
				</div>
        		<div className="fillSpace"></div>
				<div>
					<NavLink className="NavLink btn btn-primary newButton" to="/accounts">&lt; Back to Accounts</NavLink>
				</div>
			</div>
		);
    }
}

export default AddToAccountsPage;
