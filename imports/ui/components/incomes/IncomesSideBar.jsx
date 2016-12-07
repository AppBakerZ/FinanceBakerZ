import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { Input, Button, ProgressBar, Snackbar, Dropdown, DatePicker, TimePicker } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Incomes } from '../../../api/incomes/incomes.js';
import { Accounts } from '../../../api/accounts/accounts.js';

export default class IncomesSideBar extends Component {

    constructor(props) {
        super(props);

        let datetime = new Date();

        this.state = {
            account: '',
            amount: '',
            receivedAt: datetime,
            receivedTime: datetime,
            type: 'project',
            project: '',
            active: false,
            loading: false
        };
    }

    setCurrentRoute(){
        this.setState({
            isNewRoute: this.props.history.isActive('app/incomes/new')
        })
    }

    resetIncome(){
        let datetime = new Date();
        this.setState({
            account: '',
            amount: '',
            receivedAt: datetime,
            receivedTime: datetime,
            type: 'project',
            project: ''
        })
    }


    onSubmit(event){
        event.preventDefault();
        this.state.isNewRoute ? this.createIncome() : this.updateIncome();
        this.setState({loading: true})
    }

    createIncome(){
        let {account, amount, receivedAt, receivedTime, type, project} = this.state;

        receivedAt = new Date(receivedAt);
        receivedTime = new Date(receivedTime);
        console.log(receivedAt)
        console.log(receivedTime)
        console.log('--------------------')
        receivedAt.setHours(receivedTime.getHours(), receivedTime.getMinutes(), 0, 0);
        console.log(receivedAt)

        Meteor.call('incomes.insert', {
            income: {
                account,
                amount: Number(amount),
                receivedAt,
                type,
                project
            }
        }, (err, response) => {
            if(response){
                this.setState({
                    active: true,
                    barMessage: 'Income created successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
                this.resetIncome();
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

    updateIncome(){
        let {_id, account, amount, receivedAt, receivedTime, type, project} = this.state;

        receivedAt = new Date(receivedAt);
        receivedTime = new Date(receivedTime);
        receivedAt.setHours(receivedTime.getHours(), receivedTime.getMinutes(), 0, 0);

        Meteor.call('incomes.update', {
            income: {
                _id,
                account,
                amount: Number(amount),
                receivedAt,
                type,
                project
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
                    barMessage: 'Income updated successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
            this.setState({loading: false})
        });
    }

    removeIncome(){
        const {_id} = this.state;
        Meteor.call('incomes.remove', {
            income: {
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
                this.props.history.replace('/app/incomes/new');
                this.setState({
                    active: true,
                    barMessage: 'Income deleted successfully',
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
        p.income.receivedTime = p.income.receivedAt;
        this.setState(p.income);
        this.setCurrentRoute();
        if(this.state.isNewRoute){
            this.resetIncome()
        }
    }

    renderButton (){
        let button;
        if(this.state.isNewRoute){
            button = <div className='sidebar-buttons-group'>
                <Button icon='add' label='Add Income' raised primary />
            </div>
        }else{
            button = <div className='sidebar-buttons-group'>
                <Button icon='mode_edit' label='Update Income' raised primary />
                <Button
                    onClick={this.removeIncome.bind(this)}
                    type='button'
                    icon='delete'
                    label='Remove Income'
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

    typeItem (type) {
        return (
            <strong>{type.title}</strong>
        );
    }

    accounts(){
        return this.props.accounts.map((account) => {
            account.value = account._id;
            account.icon = 'http://www.clasesdeperiodismo.com/wp-content/uploads/2012/02/radiohead-in-rainbows.png';
            return account;
        })
    }

    types(){
        return [
            {
                title: 'Salary',
                value: 'salary'
            },
            {
                title: 'Project',
                value: 'project'
            }
        ]
    }

    render() {
        return (
            <form onSubmit={this.onSubmit.bind(this)} className="add-income">

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
                <DatePicker
                    label='Receiving Date'
                    name='receivedAt'
                    onChange={this.onChange.bind(this)}
                    value={this.state.receivedAt}
                    />
                <TimePicker
                    label='Receiving time'
                    name='receivedTime'
                    onChange={this.onChange.bind(this)}
                    value={this.state.receivedTime}
                    format='ampm'
                    />
                <Dropdown
                    source={this.types()}
                    name='type'
                    onChange={this.onChange.bind(this)}
                    value={this.state.type}
                    template={this.typeItem}
                    required
                    />
                <Input type='text' label='Project'
                       name='project'
                       maxLength={ 50 }
                       value={this.state.project}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                {this.renderButton()}
            </form>
        );
    }
}

IncomesSideBar.propTypes = {
    income: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    incomeExists: PropTypes.bool.isRequired
};

export default createContainer((props) => {
    const { id } = props.params;
    const incomeHandle = Meteor.subscribe('incomes.single', id);
    const accountsHandle = Meteor.subscribe('accounts');
    const loading = !incomeHandle.ready();
    const income = Incomes.findOne(id);
    const incomeExists = !loading && !!income;
    return {
        loading,
        incomeExists,
        income: incomeExists ? income : {},
        accounts: Accounts.find({}).fetch()
    };
}, IncomesSideBar);