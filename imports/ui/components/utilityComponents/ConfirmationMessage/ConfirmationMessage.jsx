import React, { Component } from 'react';
import PropTypes from 'prop-types'

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';

import { Button, Snackbar, Dialog } from 'react-toolbox';

import theme from './theme.scss';
import dialogTheme from './dialogTheme'
import dialogButtonTheme from './dialogButtonTheme'


const il8n = defineMessages({
    INFORM_MESSAGE: {
        id: 'CATEGORIES.INFORM_MESSAGE'
    },
    CONFIRMATION_MESSAGE: {
        id: 'CATEGORIES.CONFIRMATION_MESSAGE'
    },
    REMOVE_CATEGORIES: {
        id: 'CATEGORIES.REMOVE_CATEGORIES'
    },
    ADD_CATEGORY: {
        id: 'CATEGORIES.ADD_CATEGORY'
    },
    UPDATE_CATEGORIES: {
        id: 'CATEGORIES.UPDATE_CATEGORY'
    },
    ADD_CATEGORIES: {
        id: 'CATEGORIES.ADD_CATEGORIES'
    },
    CATEGORY_NAME: {
        id: 'CATEGORIES.CATEGORY_NAME'
    },
    CATEGORY_ICON: {
        id: 'CATEGORIES.CATEGORY_ICON'
    },
    DISPLAY_CATEGORY_ICON: {
        id: 'CATEGORIES.DISPLAY_CATEGORY_ICON'
    },
    PARENT_CATEGORY: {
        id: 'CATEGORIES.PARENT_CATEGORY'
    },
    DISPLAY_PARENT_CATEGORY: {
        id: 'CATEGORIES.DISPLAY_PARENT_CATEGORY'
    },
    BACK_BUTTON: {
        id: 'CATEGORIES.BACK_BUTTON'
    },
    REMOVE_BUTTON: {
        id: 'CATEGORIES.REMOVE_BUTTON'
    }
});

/*it need below params to warn user on an action

 @open (boolean value for dialog status) required
 @close (parent component function to close dialog) required
 @heading (which shows on top on dialog) required
 @information (which shows as first details line) required
 @confirmation (which shows as second more details info) optional
 @defaultAction (which action perform on user confirmation) required
 @condition (if provided it will check and perform action accordingly) optional
 @alternateFunction (if condition provided then required) optional

*/

class ConfirmationMessage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { formatMessage } = this.props.intl;
        const { heading, information, confirmation } = this.props;
        const { open, close, defaultAction, condition, alternateAction } = this.props;
        return <Dialog theme={dialogTheme}
                active={open}
                onEscKeyDown={close}
                onOverlayClick={close}
        >
            <div className={theme.dialogContent}>
                <div>
                    <h3> {heading} </h3>
                    <p> { information} </p>
                    <p> { confirmation } </p>
                </div>
                <div className={theme.buttonBox}>
                    <Button label={formatMessage(il8n.BACK_BUTTON)} raised primary onClick={close} />
                    <Button label={formatMessage(il8n.REMOVE_BUTTON)} raised onClick={condition ? alternateAction : defaultAction} theme={dialogButtonTheme} />
                </div>
            </div>
        </Dialog>
    }
}

ConfirmationMessage.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    information: PropTypes.string.isRequired,
    route: PropTypes.string.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(ConfirmationMessage);