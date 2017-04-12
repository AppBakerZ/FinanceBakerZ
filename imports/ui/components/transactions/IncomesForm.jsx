import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { Input, Button, ProgressBar, Snackbar, Dropdown, DatePicker, TimePicker } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Incomes } from '../../../api/incomes/incomes.js';
import { Accounts } from '../../../api/accounts/accounts.js';
import { Projects } from '../../../api/projects/projects.js';
import { accountHelpers } from '/imports/helpers/accountHelpers.js'

import theme from './theme';

class IncomesForm extends Component {

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

    setCurrentRoute(value){
        this.setState({
            isNewRoute: value
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
        receivedAt.setHours(receivedTime.getHours(), receivedTime.getMinutes(), 0, 0);
        project = (project && type == "project" && {_id: project}) || {};

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
                this.props.closePopup();
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
        project = (project && type == "project" && {_id: project}) || {};

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
                this.props.closePopup();
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
        e.target.name == 'project' && this.setState({['projectName']: e.target.textContent});
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
        p.income.type == "project" && ((p.income.projectName = p.income.project.name) && (p.income.project = p.income.project._id));
        this.setState(p.income);
        this.setCurrentRoute(p.isNewRoute);
        if(p.isNewRoute){
            this.resetIncome()
        }
    }

    renderButton (){
        let button;
        if(this.state.isNewRoute){
            button = <div className={theme.addIncomeBtn}>
                <Button type='submit' icon='add' label='Add Income' raised primary />
            </div>
        }else{
            button = <div className={theme.addIncomeBtn}>
                <Button type='submit' icon='mode_edit' label='Update Income' raised primary />
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

        let parentClass = '';

        if(account.removeRightBorder){
            parentClass = theme['removeRightBorder']
        }

        if(account.removeBottomBorder){
            parentClass = theme['removeBottomBorder']
        }

        return (
            <div className={parentClass}>
                <i className={account.bank}/>
            </div>
        );
    }

    accounts(){
        return this.props.accounts.map((account, index) => {
            account.value = account._id;

            index++;
            if(index % 3 == 0){
                account.removeRightBorder = true
            }
            let lastItems = this.props.accounts.length % 3 == 0 ? 3 : this.props.accounts.length % 3;
            if(index > this.props.accounts.length - lastItems){
                account.removeBottomBorder = true
            }

            return account;
        })
    }

    typeItem (type) {
        return (
            <strong>{type.title}</strong>
        );
    }

    projectItem (project) {
        return (
            <strong>{project.name}</strong>
        );
    }

    projects(){
        return this.props.projects.map((project) => {
            project.value = project._id;
            project.icon = 'http://www.clasesdeperiodismo.com/wp-content/uploads/2012/02/radiohead-in-rainbows.png';
            return project;
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

                <Dropdown theme={theme}
                    className={theme.bankFonts}
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
                    label='Select type'
                    onChange={this.onChange.bind(this)}
                    value={this.state.type}
                    template={this.typeItem}
                    required
                    />
                {this.state.type == 'project' &&
                <Dropdown
                    source={this.projects()}
                    name='project'
                    onChange={this.onChange.bind(this)}
                    label='Select project'
                    value={this.state.project}
                    template={this.projectItem}
                    required/>
                }
                {this.renderButton()}
            </form>
        );
    }
}

IncomesForm.propTypes = {
    income: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    incomeExists: PropTypes.bool.isRequired
};

export default createContainer((props) => {
    const { id } = props.params;
    const incomeHandle = Meteor.subscribe('incomes.single', id);
    const loading = !incomeHandle.ready();
    const income = Incomes.findOne(id);
    const incomeExists = !loading && !!income;
    Meteor.subscribe('accounts');
    Meteor.subscribe('projects.all');
    return {
        loading,
        incomeExists,
        income: incomeExists ? income : {},
        accounts: Accounts.find({}).fetch(),
        projects: Projects.find({}).fetch()
    };
}, IncomesForm);