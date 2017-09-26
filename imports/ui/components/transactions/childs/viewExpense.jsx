import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Transactions } from '../../../../api/transactions/transactions.js'
import { Accounts } from '../../../../api/accounts/accounts'
import { routeHelpers } from '../../../../helpers/routeHelpers.js'
import { userCurrencyHelpers } from '../../../../helpers/currencyHelpers'
import RecordsNotExists from '../../utilityComponents/RecordsNotExist/NoRecordFound';
import ConfirmationMessage from '../../utilityComponents/ConfirmationMessage/ConfirmationMessage';

import { Button, Table, FontIcon, Autocomplete, Dropdown, DatePicker, Dialog, Input, ProgressBar, Snackbar, Card } from 'react-toolbox';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';

import theme from './theme';

const il8n = defineMessages({
    EDIT: {
        id: 'COMMON.EDIT'
    },
    DELETE: {
        id: 'COMMON.DELETE'
    },
    EXPENSE: {
        id: 'TRANSACTIONS.EXPENSE'
    },
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
    },
    INFORM_MESSAGE: {
        id: 'TRANSACTIONS.INFORM_MESSAGE'
    },
    CONFIRMATION_MESSAGE: {
        id: 'TRANSACTIONS.CONFIRMATION_MESSAGE'
    },
    REMOVE_EXPENSE: {
        id: 'TRANSACTIONS.REMOVE_EXPENSE_BUTTON'
    }


});

class viewExpense extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            openDialog: false,
        };

    }

    editTransaction(){
        routeHelpers.changeRoute(`/app/transactions/expense/edit/${this.props.params.id}`)
    }

    removeTransaction(){
        this.setState({
            openDialog: false
        });
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
                routeHelpers.changeRoute('/app/transactions', 1200);
                this.setState({
                    active: true,
                    barMessage: 'Expense deleted successfully',
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

    openDialog (e) {
        if(e){
            e.stopPropagation();
            e.preventDefault();
        }
        this.setState({
            openDialog: true,
        });
    }

    closePopup () {
        this.setState({
            openDialog: false
        });
    }

    /*************** template render ***************/
    render() {
        const { formatMessage } = this.props.intl;
        let { transaction } = this.props;
        let { openDialog } = this.state;
        let {_id, transactionAt, category, amount, description, account } = transaction;
        // add safeguard for nested values
        account = account ? account : {};
        let { bank, number } = account;
        let date = moment(transactionAt).format('DD-MMM-YYYY');
        //remove the bank prefix from bank account
        bank = bank && bank.split("bank-")[1];
        return (
            <div className={theme.viewExpense}>
                {Object.keys(transaction).length ?
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
                        <h3><FormattedMessage {...il8n.EXPENSE} /></h3>
                        <div className={theme.rightButtons}>
                            <Button onClick={this.editTransaction.bind(this)}
                                className='header-buttons'
                                label={formatMessage(il8n.EDIT)}
                                name='Income'
                                flat />
                            <Button onClick={this.openDialog.bind(this)}
                                className='header-buttons'
                                label={formatMessage(il8n.DELETE)}
                                name='Expense'
                                flat />
                        </div>
                    </div>
                    <div className={theme.bankContent}>
                        <div className={theme.depositContent}>
                            <h6>Transaction ID: <span>{_id}</span></h6>
                            <h6>Date: <span>{date}</span></h6>
                            <h5>Deposited in: <span>{bank}</span></h5>
                            <h5>Account Number: <span>{number}</span></h5>
                            <h5>Amount: <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <span className={theme.price}><FormattedNumber value={amount}/></span></h5>
                            {description && <h5>Description: <span>{ description }</span> </h5>}
                        </div>
                        <div className={theme.accountContent}>
                            <h5>Sender Name: <span>Saeed Anwar</span></h5>
                            <h5>Sender Bank: <span>Habib Bank</span></h5>
                            <h5>Account Number: <span>009123455670</span></h5>
                        </div>
                        <div className={theme.projectContent}>
                            <h5>Category: <span>{category ? category.name : 'Not Found'}</span></h5>
                        </div>
                    </div>
                </div>
                    : <RecordsNotExists route="/app/transactions" />}

                <ConfirmationMessage
                    heading={formatMessage(il8n.REMOVE_EXPENSE)}
                    information={formatMessage(il8n.INFORM_MESSAGE)}
                    confirmation={formatMessage(il8n.CONFIRMATION_MESSAGE)}
                    open={openDialog}
                    route="/app/transactions"
                    defaultAction={this.removeTransaction.bind(this)}
                    close={this.closePopup.bind(this)}
                />
            </div>

        );
    }
}

viewExpense.propTypes = {

};

viewExpense = createContainer((props) => {
    const { id } = props.params;
    let accountId;
    Meteor.subscribe('transactions.single', id);
    Meteor.subscribe('accounts');
    const transaction = Transactions.findOne(id);
    transaction && (accountId = transaction.account);
    const account = Accounts.findOne(accountId);
    return {
        transaction: transaction ? transaction : {},
        account: account ? account : {}
    };
}, viewExpense);

export default injectIntl(viewExpense);