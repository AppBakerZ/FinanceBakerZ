import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Button, Table, FontIcon, Autocomplete, Dropdown, DatePicker, Dialog, Input, ProgressBar, Snackbar, Card } from 'react-toolbox';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';



class viewExpense extends Component {

    constructor(props) {
        super(props);
        this.state = {};

    }
    /*************** template render ***************/
    render() {
        return (
            <div className="viewExpense">
                <div className="container">
                    <h1>View Expense</h1>
                </div>
            </div>

        );
    }
}

viewExpense.propTypes = {

};

viewExpense = createContainer(() => {
    return {

    };
}, viewExpense);

export default injectIntl(viewExpense);