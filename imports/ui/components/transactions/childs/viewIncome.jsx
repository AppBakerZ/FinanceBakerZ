import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Button, Table, FontIcon, Autocomplete, Dropdown, DatePicker, Dialog, Input, ProgressBar, Snackbar, Card } from 'react-toolbox';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';



class viewIncome extends Component {

    constructor(props) {
        super(props);
        this.state = {};

    }
    /*************** template render ***************/
    render() {
        return (
            <div className="viewIncome">
                <div className="container">
                    <h1>View Income</h1>
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