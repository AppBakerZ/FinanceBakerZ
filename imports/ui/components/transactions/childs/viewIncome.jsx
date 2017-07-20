import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Button, Table, FontIcon, Autocomplete, Dropdown, DatePicker, Dialog, Input, ProgressBar, Snackbar, Card } from 'react-toolbox';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';
import { Transactions } from '../../../../api/transactions/transactions.js'
import { Accounts } from '../../../../api/accounts/accounts'
import { routeHelpers } from '../../../../helpers/routeHelpers.js'
import { userCurrencyHelpers } from '/imports/helpers/currencyHelpers.js'
import theme from './theme';
import moment from 'moment';
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
        Meteor.call('incomes.remove', {
            income: {
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
        let { transaction, account } = this.props;
        console.log(transaction);
        let { bank, number } = account;
        //remove the bank prefix from bank account
        bank = bank && bank.split("bank-")[1];
        let { amount, _id, transactionAt } = transaction;
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
                            <h6>Transaction ID: <span>{ _id }</span></h6>
                            <h6>Date: <span> { date } </span></h6>
                            <h5>Deposited in: <span>{ bank }</span></h5>
                            <h5>Account Number: <span>{ number }</span></h5>
                            <h5>Amount: <span> <i className={userCurrencyHelpers.loggedUserCurrency()}></i> </span>  <span className={theme.price}> { amount } </span> </h5>
                        </div>
                        <div className={theme.accountContent}>
                            <h5>Sender Name: <span>Saeed Anwar</span></h5>
                            <h5>Sender Bank: <span>Habib Bank</span></h5>
                            <h5>Account Number: <span>009123455670</span></h5>
                        </div>
                        <div className={theme.projectContent}>
                            { transaction.creditType ? (transaction.creditType === 'salary' ?
                                <h5>CreditType: <span>Salary</span></h5> :
                                <h5>CreditType: <span>{ transaction.project ? transaction.project.name : 'Not Available' }</span></h5>) :
                                <h5>Project: <span>{ transaction.project ? transaction.project.name : 'Not Available' }</span></h5>
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
    let accountId;
    const transactionHandle = Meteor.subscribe('transactions.single', id);
    Meteor.subscribe('accounts');
    const loading = !transactionHandle.ready();
    const transaction = Transactions.findOne({_id: id});
    transaction && (accountId = transaction.account);
    const account = Accounts.findOne(accountId);
    const transactionExists = !loading && !!transaction;

    return {
        loading,
        transactionExists,
        transaction: transactionExists ? transaction : {},
        account: account ? account : {}
    };
}, viewIncome);

export default injectIntl(viewIncome);