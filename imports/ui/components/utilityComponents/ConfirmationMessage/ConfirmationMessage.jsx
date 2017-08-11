import React, { Component } from 'react';
import PropTypes from 'prop-types'

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';

import { Button } from 'react-toolbox';

import theme from './theme.scss';


const il8n = defineMessages({

});



class ConfirmationMessage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={theme.dialogContent}>
                <div>
                    <h3> <FormattedMessage {...il8n.REMOVE_CATEGORIES} /> </h3>
                    <p> <FormattedMessage {...il8n.INFORM_MESSAGE} /> </p>
                    <p> <FormattedMessage {...il8n.CONFIRMATION_MESSAGE} /> </p>
                </div>
                <div className={theme.buttonBox}>
                    <Button label={formatMessage(il8n.BACK_BUTTON)} raised primary onClick={this.closePopup.bind(this)} />
                    <Button label={formatMessage(il8n.REMOVE_BUTTON)} raised onClick={!isRemoveSubcategory ? this.removeCategory.bind(this) : this.removeSubcategory.bind(this)} theme={dialogButtonTheme} />
                </div>
            </div>
        );
    }
}

ConfirmationMessage.propTypes = {
    route: PropTypes.string.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(ConfirmationMessage);