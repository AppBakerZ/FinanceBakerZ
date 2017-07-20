import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Button, Table, FontIcon, Autocomplete, Dropdown, DatePicker, Dialog, Input, ProgressBar, Snackbar, Card } from 'react-toolbox';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';
import { Transactions } from '../../../../api/transactions/transactions.js'
import { userCurrencyHelpers } from '/imports/helpers/currencyHelpers.js'
import theme from './theme';
import moment from 'moment';
class viewIncome extends Component {

    constructor(props) {
        super(props);
        this.state = {};

    }
    /*************** template render ***************/
    render() {
        let { transaction } = this.props;
        let { amount, _id, transactionAt, project } = transaction;
        let date = moment (transactionAt).format('DD-MMM-YYYY');
        return (
            <div className={theme.viewExpense}>
                <div className="container">
                    <div className={theme.titleBox}>
                        <h3>bank deposit</h3>
                        <div className={theme.rightButtons}>
                            <Button
                                className='header-buttons'
                                label="edit"
                                name='Income'
                                flat />
                            <Button
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
                            <h5>Deposited in: <span>Standard Chartered</span></h5>
                            <h5>Account Number: <span>00971322001</span></h5>
                            <h5>Amount: <span> <i className={userCurrencyHelpers.loggedUserCurrency()}></i> </span>  <span className={theme.price}> { amount } </span> </h5>
                        </div>
                        <div className={theme.accountContent}>
                            <h5>Sender Name: <span>Saeed Anwar</span></h5>
                            <h5>Sender Bank: <span>Habib Bank</span></h5>
                            <h5>Account Number: <span>009123455670</span></h5>
                        </div>
                        <div className={theme.projectContent}>
                            <h5>Project: <span>{ transaction.project ? transaction.project.name : 'Not Available' }</span></h5>
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
    const transactionHandle = Meteor.subscribe('transactions.single', id);
    const loading = !transactionHandle.ready();
    const transaction = Transactions.findOne({_id: id});
    const transactionExists = !loading && !!transaction;

    return {
        loading,
        transactionExists,
        transaction: transactionExists ? transaction : {}
    };
}, viewIncome);

export default injectIntl(viewIncome);