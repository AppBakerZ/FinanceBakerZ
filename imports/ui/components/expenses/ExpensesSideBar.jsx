import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { Input, Button, ProgressBar, Snackbar, Dropdown,DatePicker, TimePicker } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';

import { Expenses } from '../../../api/expences/expenses.js';
import { Accounts } from '../../../api/accounts/accounts.js';

export default class ExpensesSideBar extends Component {

    constructor(props) {
        super(props);

        let datetime = new Date();

        this.state = {
            account: '',
            amount: '',
            description: '',
            createdAt: datetime,
            createdTime: datetime,
            purpose: '',
            active: false,
            loading: false
        };
    }

    setCurrentRoute(){
        this.setState({
            isNewRoute: this.props.history.isActive('app/expenses/new')
        })
    }

    resetExpense(){
        let datetime = new Date();
        this.setState({
            account: '',
            amount: '',
            description: '',
            createdAt: datetime,
            createdTime: datetime,
            purpose: ''
        })
    }


    onSubmit(event){
        event.preventDefault();
        this.state.isNewRoute ? this.createExpense() : this.updateExpense();
        this.setState({loading: true})
    }

    createExpense(){
        let {account, amount, description, createdAt, createdTime, purpose} = this.state;
        createdAt = new Date(createdAt);
        createdTime = new Date(createdTime);
        createdAt.setHours(createdTime.getHours(), createdTime.getMinutes(), 0, 0);

        Meteor.call('expenses.insert', {
            expense: {
                account,
                amount: Number(amount),
                createdAt,
                description,
                purpose
            }
        }, (err, response) => {
            if(response){
                this.setState({
                    active: true,
                    barMessage: 'Expense created successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
                this.resetExpense();
            }else{
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
            this.setState({loading: false})
        });
    }

    updateExpense(){
        let {_id, account, amount ,createdAt ,createdTime ,description, purpose} = this.state;
        createdAt = new Date(createdAt);
        createdTime = new Date(createdTime);
        createdAt.setHours(createdTime.getHours(), createdTime.getMinutes(), 0, 0);
        Meteor.call('expenses.update', {
            expense: {
                _id,
                account,
                amount: Number(amount),
                createdAt,
                description,
                purpose
            }
        }, (err, response) => {
            if(err){
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }else{
                this.setState({
                    active: true,
                    barMessage: 'Expense updated successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
            this.setState({loading: false})
        });
    }

    removeExpense(){
        const {_id} = this.state;
        Meteor.call('expenses.remove', {
            expense: {
                _id
            }
        }, (err, response) => {
            if(err){
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }else{
                this.props.history.replace('/app/expenses/new');
                this.setState({
                    active: true,
                    barMessage: 'Expense deleted successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
        });
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
    }

    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }

    progressBarToggle (){
        return this.props.loading || this.state.loading ? 'progress-bar' : 'progress-bar hide';
    }

    componentWillReceiveProps (p){
        this.setState(p.expense);
        this.setCurrentRoute();
        if(this.state.isNewRoute){
            this.resetExpense()
        }
    }

    renderButton (){
        let button;
        if(this.state.isNewRoute){
            button = <Button icon='add' label='Add Expense' raised primary />
        }else{
            button = <div>
                <Button icon='mode_edit' label='Update Expense' raised primary />
                <Button
                    onClick={this.removeExpense.bind(this)}
                    type='button'
                    icon='delete'
                    label='Remove Expense'
                    className='float-right'
                    accent />
            </div>
        }
        return button;
    }

    accountItem (account) {
        const containerStyle = {
            display: 'flex',
            flexDirection: 'row'
        };

        const imageStyle = {
            display: 'flex',
            width: '32px',
            height: '32px',
            flexGrow: 0,
            marginRight: '8px',
            backgroundColor: '#ccc'
        };

        const contentStyle = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 2
        };

        return (
            <div style={containerStyle}>
                <img src={account.icon} style={imageStyle}/>
                <div style={contentStyle}>
                    <strong>{account.name}</strong>
                    <small>{account.purpose}</small>
                </div>
            </div>
        );
    }

    accounts(){
        return this.props.accounts.map((account) => {
            account.value = account._id;
            account.icon = 'http://www.clasesdeperiodismo.com/wp-content/uploads/2012/02/radiohead-in-rainbows.png';
            return account;
        })
    }

    render() {
        return (
            <form onSubmit={this.onSubmit.bind(this)} className="add-expense">

                <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />

                <Snackbar
                    action='Dismiss'
                    active={this.state.active}
                    icon={this.state.barIcon}
                    label={this.state.barMessage}
                    timeout={2000}
                    onClick={this.handleBarClick.bind(this)}
                    onTimeout={this.handleBarTimeout.bind(this)}
                    type={this.state.barType}
                    />

                <Dropdown
                    auto={false}
                    source={this.accounts()}
                    name='account'
                    onChange={this.onChange.bind(this)}
                    label='Select your account'
                    value={this.state.account}
                    template={this.accountItem}
                    required
                    />

                <Input type='number' label='Amount'
                       name='amount'
                       value={this.state.amount}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='text' label='Purpose'
                       name='purpose'
                       maxLength={ 50 }
                       value={this.state.purpose}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='text' label='Description'
                       name='description'
                       multiline
                       value={this.state.description}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <DatePicker
                    label='Creation Date'
                    name='createdAt'
                    onChange={this.onChange.bind(this)}
                    value={this.state.createdAt}
                />
                <TimePicker
                    label='Creation time'
                    name='createdTime'
                    onChange={this.onChange.bind(this)}
                    value={this.state.createdTime}
                    format='ampm'
                />

                {this.renderButton()}
            </form>
        );
    }
}

ExpensesSideBar.propTypes = {
    expense: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    expenseExists: PropTypes.bool.isRequired
};

export default createContainer((props) => {
    const { id } = props.params;
    const expenseHandle = Meteor.subscribe('expenses.single', id);
    const accountsHandle = Meteor.subscribe('accounts');
    const loading = !expenseHandle.ready();
    const expense = Expenses.findOne(id);
    const expenseExists = !loading && !!expense;
    return {
        loading,
        expenseExists,
        expense: expenseExists ? expense : {},
        accounts: Accounts.find({}).fetch()
    };
}, ExpensesSideBar);