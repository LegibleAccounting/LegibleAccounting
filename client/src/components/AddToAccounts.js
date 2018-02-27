import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import AccountTypesAPI from '../api/AccountTypes.js';
import AccountsAPI from '../api/Accounts.js';
import './AddToAccounts.css';

class AddToAccountsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToAccountsPage: false,
            accountTypes: [],
            accountModel: {
                account_type: '',
                relative_liquidity: '',
                name: '',
                description: '',
                initial_balance: '',
                is_active: false
            }
        }

        AccountTypesAPI.getAll()
            .then(data => {
            	this.setState({
            		accountTypes: data
            	});
            });

        // Bind event handlers to class instance context.
        this.changeInputState = this.changeInputState.bind(this);
        this.submitAccount = this.submitAccount.bind(this);
    }

    render() {
        if (this.state.redirectToAccountsPage) {
            return <Redirect to="/accounts" />
        }

        return (
            <form className="addToAccounts" onSubmit={this.submitAccount}>
                <div className="titleBar">
                    <h1>Add Account</h1>
                </div>
                <div className="row">
					<div className="textColumn container">
						Account Type
					</div>
					<div className="fieldColumn container">
						<select name="account_type" className="form-control textBox" value={this.state.accountModel.account_type} onChange={this.changeInputState}>
                            <option hidden>-- Select Account Type --</option>
							{
                                this.state.accountTypes.map((item, index) => (
                                    <option key={item.id} value={item.id}>{item.starting_number} - {item.name}</option>
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
						<input type="text"
								name="name"
								className="form-control textBox"
								maxLength="200"
                                value={this.state.accountModel.name}
                                onChange={this.changeInputState} />
					</div>
				</div>	
                <div className="row">
                    <div className="textColumn container">
                        Account Relative Liquidity
                    </div>
                    <div className="fieldColumn container">
                        <input type="number"
                          name="relative_liquidity"
                          className="form-control"
                          placeholder="0"
                          step="1"
                          min="0"
                          value={this.state.accountModel.relative_liquidity}
                          onChange={this.changeInputState} />
                    </div>
                </div>
				<div className="row">
					<div className="textColumn container">
						Account Active
					</div>
					<div className="fieldColumn container">
						<input 	type="checkbox" 
								name="is_active"
								className="accountActiveCheckBox"
								value={this.state.accountModel.is_active}
                                onChange={this.changeInputState} />
					</div>
				</div>
				<div className="row">
					<div className="textColumn container">
						Initial Balance
					</div>
					<div className="fieldColumn container">
						<input	type="number"
								name="initial_balance"
								className="form-control initialBalanceTextField currency"
								placeholder="$0.00"
								step="0.01"
								min="0"
                                value={this.state.accountModel.initial_balance}
                                onChange={this.changeInputState} />
					</div>
				</div>
				<div className="row">
					<div className="textColumn container">
						Comments
					</div>
					<div className="fieldColumn container">
						<input 	type="text"
								name="description"
								className="form-control textBox"
								maxLength="200"
                                value={this.state.accountModel.description}
                                onChange={this.changeInputState} />
					</div>
				</div>	
				<div>
					<input type="submit" value="Create" name="createButton" className="btn btn-primary createButton"/>
				</div>
        		<div className="fillSpace"></div>
				<div>
					<NavLink className="NavLink btn btn-primary newButton" to="/accounts">&lt; Back to Accounts</NavLink>
				</div>
			</form>
		);
    }

    changeInputState(event) {
        this.setState({
            accountModel: Object.assign({}, this.state.accountModel, {
                [event.target.name]: event.target.type === 'checkbox' ?
                    event.target.checked : event.target.value
            })
        });
    }

    submitAccount(event) {
        event.preventDefault();

        AccountsAPI.create(this.state.accountModel)
            .then(() => {
                alert("Account created successfully.");
                this.setState({
                    redirectToAccountsPage: true
                });
            })
            .catch(() => {
                alert("Failed to create account.");
            });
    }
  }

export default AddToAccountsPage;
