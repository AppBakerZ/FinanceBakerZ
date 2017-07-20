import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Button, Table, FontIcon, Autocomplete, Dropdown, DatePicker, Dialog, Input, ProgressBar, Snackbar, Card } from 'react-toolbox';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';

import theme from './theme';

class viewIncome extends Component {

    constructor(props) {
        super(props);
        this.state = {};

    }
    /*************** template render ***************/
    render() {
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
                            <h6>Transaction ID: <span>009981</span></h6>
                            <h6>Date: <span>05-December-2016</span></h6>
                            <h5>Deposited in: <span>Standard Chartered</span></h5>
                            <h5>Account Number: <span>00971322001</span></h5>
                            <h5>Amount: <span className={theme.price}>10,000</span> <span>PKR</span></h5>
                        </div>
                        <div className={theme.accountContent}>
                            <h5>Sender Name: <span>Saeed Anwar</span></h5>
                            <h5>Sender Bank: <span>Habib Bank</span></h5>
                            <h5>Account Number: <span>009123455670</span></h5>
                        </div>
                        <div className={theme.projectContent}>
                            <h5>Project: <span>Logo Design</span></h5>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

viewIncome.propTypes = {

};

viewIncome = createContainer(() => {
    return {

    };
}, viewIncome);

export default injectIntl(viewIncome);