import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import Auth from '../api/Auth.js';
import AccountTypesAPI from '../api/AccountTypes.js';
import AccountsAPI from '../api/Accounts.js';
import './AccountForm.css';

class AccountForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToAccountsPage: false,
            accountTypes: []
        };

        if (this.props.match.params.id) {
            this.state.isLoading = true;
            AccountsAPI.getOne(this.props.match.params.id)
                .then((account) => {
                    account.account_type = account.account_type.id;

                    this.state.accountModel = account;
                })
                .catch(() => {
                    alert('Failed to retrieve account information.');
                })
                .finally(() => {
                    this.setState({
                        isLoading: false
                    });
                });
        } else {
            this.state.isLoading = false;
            this.state.accountModel = {
                account_type: '',
                order: '',
                name: '',
                description: '',
                initial_balance: '',
                is_active: false
            };
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
        if (this.state.isLoading) {
            return <div>Loading...</div>;
        }

        if (this.state.redirectToAccountsPage) {
            return <Redirect to="/accounts" />
        }

        return (
            <form className="accountForm" onSubmit={this.submitAccount}>
                <div className="titleBar">
                    <h1>{ this.state.accountModel.id === undefined ? 'Add' : 'Edit' } Account</h1>
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
                        Account Order
                    </div>
                    <div className="fieldColumn container">
                        <input type="number"
                          name="order"
                          className="form-control"
                          placeholder="0"
                          step="1"
                          min="0"
                          value={this.state.accountModel.order}
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
                                checked={this.state.accountModel.is_active}
								value={this.state.accountModel.is_active}
                                disabled={ !Auth.currentUser.groups.find(group => group.name === 'Administrator') }
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
								placeholder="0.00"
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
					<input type="submit" value={ this.state.accountModel.id === undefined ? 'Create' : 'Update' } className="btn btn-primary createButton"/>
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

        let request = this.state.accountModel.id === undefined ?
            AccountsAPI.create(this.state.accountModel) :
            AccountsAPI.update(this.state.accountModel);

        request
            .then(() => {
                this.props.onNotifySuccess(`Account ${this.state.accountModel.id === undefined ? 'created' : 'updated' } successfully.`);

                this.setState({
                    redirectToAccountsPage: true
                });
            })
            .catch(() => {
                this.props.onNotifyError(`Failed to ${this.state.accountModel.id === undefined ? 'create' : 'update' } account.`);
            });
    }
  }

export default AccountForm;
