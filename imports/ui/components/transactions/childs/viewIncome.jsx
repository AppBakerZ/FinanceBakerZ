import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Button, Table, FontIcon, Autocomplete, Dropdown, DatePicker, Dialog, Input, ProgressBar, Snackbar, Card } from 'react-toolbox';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';
import { Transactions } from '../../../../api/transactions/transactions.js'
import { Accounts } from '../../../../api/accounts/accounts'
import { Projects } from '../../../../api/projects/projects.js'
import { routeHelpers } from '../../../../helpers/routeHelpers.js'
import { stringHelpers } from '../../../../helpers/stringHelpers'
import { userCurrencyHelpers } from '/imports/helpers/currencyHelpers.js'
import theme from './theme';
import moment from 'moment';


const il8n = defineMessages({
    ACCOUNT_NUMBER: {
        id: 'TRANSACTIONS.ACCOUNT_NUMBER'
    },
    SENDER_BANK:{
        id: 'TRANSACTIONS.SENDER_BANK'
    },
    SENDER_NAME: {
        id: 'TRANSACTIONS.SENDER_NAME'
    },
    TRANSACTION_ID:{
        id: 'TRANSACTIONS.TRANSACTION_ID'
    },
    DATE:{
        id: 'TRANSACTIONS.DATE'
    },
    DEPOSITED_IN:{
        id: 'TRANSACTIONS.DEPOSITED_IN'
    },

    AMOUNT:{
        id: 'TRANSACTIONS.AMOUNT'
    },
    CREDIT_TYPE: {
        id: 'TRANSACTIONS.CREDIT_TYPE'
    },
    PROJECT:{
        id: 'TRANSACTIONS.PROJECT'
    }




});

class viewIncome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false
        };

    }
    /*************** template render ***************/

    editTransaction(){
        routeHelpers.changeRoute(`/app/transactions/income/edit/${this.props.params.id}`)
    }

    removeTransaction(){
        const { id } = this.props.params;
        Meteor.call('transactions.remove', {
            transaction: {
                _id: id
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
                routeHelpers.changeRoute('/app/reports', 1200);
                this.setState({
                    active: true,
                    barMessage: 'Income deleted successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
        });
    }

    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }

    render() {
        const { formatMessage } = this.props.intl;
        let { transaction, account, currentProject} = this.props;
        let { bank, number } = account;
        let details = {};
        if(currentProject){
            details = currentProject;
        }

        //remove the bank prefix from bank account
        bank = bank && bank.split("bank-")[1];
        let { amount, _id, transactionAt, project } = transaction;

        let date = moment (transactionAt).format('DD-MMM-YYYY');
        return (
            <div className={theme.viewExpense}>
                <div className="container">
                    <div className={theme.titleBox}>
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
                        <h3>bank deposit</h3>
                        <div className={theme.rightButtons}>
                            <Button
                                onClick={this.editTransaction.bind(this)}
                                className='header-buttons'
                                label="edit"
                                name='Income'
                                flat />
                            <Button
                                onClick={this.removeTransaction.bind(this)}
                                className='header-buttons'
                                label="delete"
                                name='Expense'
                                flat />
                        </div>
                    </div>
                    <div className={theme.bankContent}>
                        <div className={theme.depositContent}>
                            <h6>{formatMessage(il8n.TRANSACTION_ID)}: <span>{ _id }</span></h6>
                            <h6>{formatMessage(il8n.DATE)}: <span> { date } </span></h6>
                            <h5>{formatMessage(il8n.DEPOSITED_IN)}: <span>{ bank }</span></h5>
                            <h5>{formatMessage(il8n.ACCOUNT_NUMBER)}: <span>{ number }</span></h5>
                            <h5>{formatMessage(il8n.AMOUNT)}: <span> <i className={userCurrencyHelpers.loggedUserCurrency()}></i> </span>  <span className={theme.price}> { amount } </span> </h5>
                        </div>
                        {details && details.client ?
                            <div className={theme.accountContent}>
                                {Object.keys(details.client).map((key, idx) => (
                                    <h5 key={key + idx}>Client {stringHelpers.capitalize(key)}: <span>{details.client[key]}</span></h5>
                                ))}
                            </div> : ''
                        }

                        <div className={theme.projectContent}>
                            { transaction.creditType ? (transaction.creditType === 'salary' ?
                                <h5>{formatMessage(il8n.CREDIT_TYPE)}: <span>Salary</span></h5> :
                                <h5>{formatMessage(il8n.CREDIT_TYPE)}: <span>{ transaction.project ? transaction.project.name : 'Not Available' }</span></h5>) :
                                <h5>{formatMessage(il8n.PROJECT)}: <span>{ transaction.project ? transaction.project.name : 'Not Available' }</span></h5>
                            }
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

viewIncome.propTypes = {

};

viewIncome = createContainer((props) => {
    const { id } = props.params;
    let accountId, project;
    const transactionHandle = Meteor.subscribe('transactions.single', id);
    Meteor.subscribe('accounts');
    const loading = !transactionHandle.ready();
    const transaction = Transactions.findOne({_id: id});
    if(transaction && transaction.project){
        const transactionHandle = Meteor.subscribe('projects.single', transaction.project._id);
        project = Projects.findOne(transaction.project._id);
    }
    transaction && (accountId = transaction.account);
    const account = Accounts.findOne(accountId);
    const transactionExists = !loading && !!transaction;

    return {
        loading,
        transactionExists,
        currentProject: project,
        transaction: transactionExists ? transaction : {},
        account: account ? account : {}
    };
}, viewIncome);

export default injectIntl(viewIncome);