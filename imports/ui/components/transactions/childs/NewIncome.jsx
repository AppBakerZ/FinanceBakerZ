import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { routeHelpers } from '../../../../helpers/routeHelpers.js'
import { _ } from 'underscore';

import { Input, Button, ProgressBar, Snackbar, Dropdown, DatePicker, TimePicker } from 'react-toolbox';
import { Card} from 'react-toolbox/lib/card';

import { Meteor } from 'meteor/meteor';
import { Transactions } from '../../../../api/transactions/transactions.js';
import { Accounts } from '../../../../api/accounts/accounts.js';
import { Projects } from '../../../../api/projects/projects.js';
import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';
import theme from '../theme';
import dropdownTheme from '../dropdownTheme';


const il8n = defineMessages({
    ADD_INCOME_BUTTON: {
        id: 'TRANSACTIONS.ADD_INCOME_BUTTON'
    },
    UPDATE_INCOME_BUTTON: {
        id: 'TRANSACTIONS.UPDATE_INCOME_BUTTON'
    },
    REMOVE_INCOME_BUTTON: {
        id: 'TRANSACTIONS.REMOVE_INCOME_BUTTON'
    },
    CHANGE_BILL_BUTTON: {
        id: 'TRANSACTIONS.CHANGE_BILL_BUTTON'
    },
    SELECT_ACCOUNT: {
        id: 'TRANSACTIONS.SELECT_ACCOUNT'
    },
    AMOUNT: {
        id: 'TRANSACTIONS.AMOUNT'
    },
    SELECT_CATEGORY: {
        id: 'TRANSACTIONS.SELECT_CATEGORY'
    },
    CREATION_DATE: {
        id: 'TRANSACTIONS.CREATION_DATE'
    },
    CREATION_TIME: {
        id: 'TRANSACTIONS.CREATION_TIME'
    },
    DESCRIPTION: {
        id: 'TRANSACTIONS.DESCRIPTION'
    },
    INCOME_ACCOUNT: {
        id: 'TRANSACTIONS.INCOME_ACCOUNT'
    },
    INCOME_AMOUNT: {
        id: 'TRANSACTIONS.INCOME_AMOUNT'
    },
    RECEIVING_DATE: {
        id: 'TRANSACTIONS.RECEIVING_DATE'
    },
    RECEIVING_TIME: {
        id: 'TRANSACTIONS.RECEIVING_TIME'
    },
    SELECT_TYPE: {
        id: 'TRANSACTIONS.SELECT_TYPE'
    },
    SELECT_PROJECT: {
        id: 'TRANSACTIONS.SELECT_PROJECT'
    },
    ADD_NEW_INCOME:{
      id: 'TRANSACTIONS.ADD_INCOME'
    }
});



class NewIncome extends Component {

    constructor(props) {
        super(props);

        let datetime = new Date();

        this.state = {
            account: '',
            amount: '',
            accountBank: '',
            accountNumber: '',
            receivedAt: datetime,
            receivedTime: datetime,
            creditType: 'project',
            project: '',
            active: false,
            disableButton: false,
            loading: false
        };
    }

    componentWillReceiveProps (p){
        p.income.receivedTime = p.income.transactionAt;
        p.income.receivedAt = p.income.transactionAt;
        if( p.income && p.income.creditType ){
            p.income.creditType === "project" && ((p.income.projectName = p.income.project.name) && (p.income.project = p.income.project._id));
        }
        if(p.income.account){
            let { account } = p.income;
            p.income.account = account._id;
            p.income.accountBank = account.bank;
            if(p.income.accountNumber){
                account.number = p.income.accountNumber
            }
        }
        this.setState(p.income);
        let isNew = p.params.id === 'new';
        this.setCurrentRoute(isNew);
        isNew && this.resetIncome()
    }

    setCurrentRoute(value){
        this.setState({
            isNew: value
        })
    }

    resetIncome(){
        let datetime = new Date();
        this.setState({
            account: '',
            amount: '',
            receivedAt: datetime,
            receivedTime: datetime,
            creditType: 'project',
            project: ''
        })
    }


    onSubmit(event){
        event.preventDefault();
        this.setState({
            disableButton: true,
            loading: true
        });
        this.state.isNew ? this.createIncome() : this.updateIncome();
    }

    createIncome() {
        let {account, amount, receivedAt, receivedTime, creditType, project} = this.state;
        let errMessage = 'You must select the project';
        if (creditType === "project" && !Object.keys(project).length) {
            if(!this.props.projects.length){
                errMessage = 'You should add at least a project or change the income type'
            }
            this.setState({
                disableButton: false,
                active: true,
                barMessage: errMessage
            });
            return
        }

        if (!Object.keys(account).length) {
            errMessage = 'You must select the account';
            this.setState({
                disableButton: false,
                active: true,
                barMessage: errMessage
            });
            return
        }
        let transactionAt = new Date(receivedAt);
        let type='income';
        receivedTime = new Date(receivedTime);
        transactionAt.setHours(receivedTime.getHours(), receivedTime.getMinutes(), 0, 0);
        project = (project && creditType === "project" && {_id: project}) || {};
        let projectExists = Projects.findOne({_id: project._id});
        if(projectExists){
            project.name = projectExists.name;
        }
        account = {_id: account};
        let accountExists = Accounts.findOne({_id: account._id});
        if(accountExists){
            account.bank = accountExists.bank;
            accountExists.number && (account.number = accountExists.number)
        }
        else{
            //fall back for old records in old transactions
            account.bank = this.state.accountBank;
            this.state.accountNumber && (account.number = this.state.accountNumber);
        }
        creditType = creditType === "project" ? 'project' : 'salary';

            Meteor.call('transactions.insert', {
                transaction: {
                    account,
                    amount: Number(amount),
                    transactionAt,
                    type,
                    project,
                    creditType
                }
            }, (err, response) => {
                if (response) {
                    routeHelpers.changeRoute('/app/transactions', 1200, {}, true);
                    this.setState({
                        active: true,
                        barMessage: 'Income created successfully',
                        barIcon: 'done',
                        barType: 'accept'
                    });
                } else {
                    this.setState({
                        disableButton: false,
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
        let {_id, account, amount, receivedAt, receivedTime, creditType, project} = this.state;
        let transactionAt = new Date(receivedAt);
        let type = 'income';
        receivedTime = new Date(receivedTime);
        transactionAt.setHours(receivedTime.getHours(), receivedTime.getMinutes(), 0, 0);
        //project processing
        project = (project && creditType === "project" && {_id: project}) || {};
        let projectExists = Projects.findOne({_id: project._id});
        if(projectExists){
            project.name = projectExists.name;
        }
        else if(_.keys(project).length){
            //fall back for old records in old transactions
            project.name = this.state.projectName
        }
        //account processing
        if (!Object.keys(account).length) {
            errMessage = 'You must select the account';
            this.setState({
                disableButton: false,
                active: true,
                barMessage: errMessage
            });
            return
        }
        account = {_id: account};
        let accountExists = Accounts.findOne({_id: account._id});
        if(accountExists){
            account.bank = accountExists.bank;
            accountExists.number && (account.number = accountExists.number)
        }
        else{
            //fall back for old records in old transactions
            account.bank = this.state.accountBank;
            this.state.accountNumber && (account.number = this.state.accountNumber);
        }
        creditType = creditType === "project" ? 'project' : 'salary';

        Meteor.call('transactions.update', {
            transaction: {
                _id,
                account,
                amount: Number(amount),
                transactionAt,
                type,
                project,
                creditType
            }
        }, (err, response) => {
            if(err){
                this.setState({
                    disableButton: false,
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }else{
                routeHelpers.changeRoute('/app/transactions', 1200, {}, true);
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
        Meteor.call('transactions.remove', {
            transaction: {
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
                routeHelpers.changeRoute('/app/transactions', 1200, {}, true);
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
        e.target.name === 'project' && this.setState({['projectName']: e.target.textContent});
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

    renderButton (){
        const { formatMessage } = this.props.intl;
        let button;
        if(this.state.isNew){
            button = <div className={theme.addIncomeBtn}>
                <Button type='submit' icon='add' label={formatMessage(il8n.ADD_INCOME_BUTTON)} raised primary disabled={this.state.disableButton}/>
            </div>
        }else{
            button = <div className={theme.addIncomeBtn}>
                <Button type='submit' icon='mode_edit' label={formatMessage(il8n.UPDATE_INCOME_BUTTON)} raised primary disabled={this.state.disableButton}/>
            </div>
        }
        return button;
    }

    accountItem (account) {

        let parentClass = '';

        if(account.removeRightBorder){
            parentClass = dropdownTheme['removeRightBorder']
        }

        if(account.removeBottomBorder){
            parentClass = dropdownTheme['removeBottomBorder']
        }

        return (
            <div className={parentClass}>
                <i className={account.bank}/>
            </div>
        );
    }

    accounts(){
        const { accounts } = this.props;
        const { account, accountBank, accountNumber } = this.state;
        //
        //if any account deleted then just add value to prevent empty values on updating record
        let index = _.findIndex(accounts, {_id: account});
        if(index === -1){
            accounts.push({
                _id: account,
                bank: accountBank,
                number: accountNumber
            })
        }
        return accounts.map((account, index) => {
            account.value = account._id;

            index++;
            if(index % 5 === 0){
                account.removeRightBorder = true
            }
            let lastItems = this.props.accounts.length % 5 === 0 ? 5 : this.props.accounts.length % 5;
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
        const { projects } = this.props;
        const {project, projectName, isNew } = this.state;

        if(!isNew){
            //if any project deleted then just add value to prevent empty values on updating record
            let index = _.findIndex(projects, {_id: project});
            if(index === -1){
                projects.push({
                    _id: project,
                    name: projectName
                })
            }
        }

        return projects.map((project) => {
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
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.incomeCard}>
                <Card theme={theme}>
                    <h3>{formatMessage(il8n.ADD_NEW_INCOME)}</h3>
                    <form onSubmit={this.onSubmit.bind(this)} className={theme.incomeForm}>
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

                        <Dropdown theme={dropdownTheme}
                                  className={theme.accountsDropdown}
                                  auto={false}
                                  source={this.accounts()}
                                  name='account'
                                  onChange={this.onChange.bind(this)}
                                  label={formatMessage(il8n.INCOME_ACCOUNT)}
                                  value={this.state.account}
                                  template={this.accountItem}
                                  required
                        />

                        <Input type='number' label={formatMessage(il8n.INCOME_AMOUNT)}
                               name='amount'
                               value={this.state.amount}
                               onChange={this.onChange.bind(this)}
                               required
                        />
                        <DatePicker
                            label={formatMessage(il8n.RECEIVING_DATE)}
                            name='receivedAt'
                            onChange={this.onChange.bind(this)}
                            value={this.state.receivedAt}
                        />
                        <TimePicker
                            label={formatMessage(il8n.RECEIVING_TIME)}
                            name='receivedTime'
                            onChange={this.onChange.bind(this)}
                            value={this.state.receivedTime}
                            format='ampm'
                        />
                        <Dropdown
                            source={this.types()}
                            name='creditType'
                            label={formatMessage(il8n.SELECT_TYPE)}
                            onChange={this.onChange.bind(this)}
                            value={this.state.creditType}
                            template={this.typeItem}
                            required
                        />
                        {this.state.creditType === 'project' &&
                        <Dropdown
                            source={this.projects()}
                            name='project'
                            onChange={this.onChange.bind(this)}
                            label={formatMessage(il8n.SELECT_PROJECT)}
                            value={this.state.project}
                            template={this.projectItem}
                            required/>
                        }
                        {this.renderButton()}
                    </form>
                </Card>
            </div>
        );
    }
}

NewIncome.propTypes = {
    income: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    incomeExists: PropTypes.bool.isRequired,
    intl: intlShape.isRequired
};

NewIncome = createContainer((props) => {
    const { id } = props.params;
    const incomeHandle = Meteor.subscribe('transactions.single', id);
    const loading = !incomeHandle.ready();
    const income = Transactions.findOne(id);
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
}, NewIncome);

export default injectIntl(NewIncome);