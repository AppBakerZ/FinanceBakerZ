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



class ConfirmationMessage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { formatMessage } = this.props.intl;
        const { heading, informationMessage, confirmationMessage } = this.props;
        const { open, close, defaultFunction, condition, alternateFunction } = this.props;
        return <Dialog theme={dialogTheme}
                active={open}
                onEscKeyDown={close}
                onOverlayClick={close}
        >
            <div className={theme.dialogContent}>
                <div>
                    <h3> {heading} </h3>
                    <p> {informationMessage} </p>
                    <p> {confirmationMessage} </p>
                </div>
                <div className={theme.buttonBox}>
                    <Button label={formatMessage(il8n.BACK_BUTTON)} raised primary onClick={close} />
                    <Button label={formatMessage(il8n.REMOVE_BUTTON)} raised onClick={condition ? alternateFunction : defaultFunction} theme={dialogButtonTheme} />
                </div>
            </div>
        </Dialog>
    }
}

ConfirmationMessage.propTypes = {
    route: PropTypes.string.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(ConfirmationMessage);