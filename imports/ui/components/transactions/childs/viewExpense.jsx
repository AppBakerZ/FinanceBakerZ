import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Transactions } from '../../../../api/transactions/transactions.js'
import { Accounts } from '../../../../api/accounts/accounts'
import { routeHelpers } from '../../../../helpers/routeHelpers.js'
import { userCurrencyHelpers } from '../../../../helpers/currencyHelpers'


import { Button, Table, FontIcon, Autocomplete, Dropdown, DatePicker, Dialog, Input, ProgressBar, Snackbar, Card } from 'react-toolbox';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';

import theme from './theme';

class viewExpense extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false
        };

    }

    editTransaction(){
        routeHelpers.changeRoute(`/app/transactions/expense/edit/${this.props.params.id}`)
    }

    removeTransaction(){
        const { id } = this.props.params;
        Meteor.call('expenses.remove', {
            expense: {
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
    /*************** template render ***************/
    render() {
        let { transaction, account } = this.props;
        let {_id, transactionAt, category, amount, description } = transaction;
        let { bank, number } = account;
        let date = moment(transactionAt).format('DD-MMM-YYYY');
        //remove the bank prefix from bank account
        bank = bank && bank.split("bank-")[1];
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
                            <Button onClick={this.editTransaction.bind(this)}
                                className='header-buttons'
                                label="edit"
                                name='Income'
                                flat />
                            <Button onClick={this.removeTransaction.bind(this)}
                                className='header-buttons'
                                label="delete"
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
    Meteor.subscribe('categories');
    const transaction = Transactions.findOne(id);
    transaction && (accountId = transaction.account);
    const account = Accounts.findOne(accountId);
    return {
        transaction: transaction ? transaction : {},
        account: account ? account : {}
    };
}, viewExpense);

export default injectIntl(viewExpense);