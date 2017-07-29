import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Autocomplete, Button, DatePicker, Dialog, Dropdown, IconButton, Input, Snackbar, Table, ProgressBar, Card} from 'react-toolbox';

import { Meteor } from 'meteor/meteor';

import Form from '../Form.jsx';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';

const il8n = defineMessages({
    NO_PROJECTS_ADDED: {
        id: 'PROJECTS.NO_PROJECTS_ADDED'
    },
    ADD_PROJECTS: {
        id: 'PROJECTS.ADD_PROJECT_TO_SHOW'
    },
    PROJECTS: {
        id: 'PROJECTS.SHOW_PROJECTS'
    },
    BANK_PROJECTS: {
        id: 'PROJECTS.BANK_PROJECTS'
    },
    INFORM_MESSAGE: {
        id: 'PROJECTS.INFORM_MESSAGE'
    },
    CONFIRMATION_MESSAGE: {
        id: 'PROJECTS.CONFIRMATION_MESSAGE'
    },
    BACK_BUTTON: {
        id: 'PROJECTS.BACK_BUTTON'
    },
    REMOVE_BUTTON: {
        id: 'PROJECTS.REMOVE_BUTTON'
    },
    ADD_NEW_PROJECTS: {
        id: 'PROJECTS.ADD_NEW_PROJECTS'
    },
    FILTER_BY_PROJECT_NAME: {
        id: 'PROJECTS.FILTER_BY_PROJECT_NAME'
    },
    FILTER_BY_CLIENT_NAME: {
        id: 'PROJECTS.FILTER_BY_CLIENT_NAME'
    },
    FILTER_BY_STATUS: {
        id: 'PROJECTS.FILTER_BY_STATUS'
    },
    DATE: {
        id: 'PROJECTS.DATE'
    },
    PROJECT: {
        id: 'PROJECTS.PROJECT'
    },
    CLIENT: {
        id: 'PROJECTS.CLIENT'
    },
    AMOUNT: {
        id: 'PROJECTS.AMOUNT'
    },
    STATUS: {
        id: 'PROJECTS.STATUS_OF_PROJECT'
    },
    PROGRESS: {
        id: 'PROJECTS.PROGRESS'
    },
    WAITING: {
        id: 'PROJECTS.WAITING'
    },
    COMPLETED: {
        id: 'PROJECTS.COMPLETED'
    }
});


class NewProjectPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filter : {
                name: '',
                client : {
                    name: ''
                },
                amountPaid: 30
            },

            removeConfirmMessage: false,
            openDialog: false,
            selectedProject: null,
            action: null,
            loading : false
        };

        const { formatMessage } = this.props.intl;

        this.statuses = [
            {
                label: formatMessage(il8n.PROGRESS),
                value: 'progress'
            },
            {
                label: formatMessage(il8n.WAITING),
                value: 'waiting'
            },
            {
                label: formatMessage(il8n.COMPLETED),
                value: 'completed'
            }
        ];
    }



    render() {
        let project = {
            client: {
                name: 'test'
            },
            amount: 50
        };
        const { formatMessage } = this.props.intl;
        return (
            <Form statuses={this.statuses} />
        );
    }
}

NewProjectPage.propTypes = {

};

NewProjectPage = createContainer(() => {


    return {

    };
}, NewProjectPage);

export default injectIntl(NewProjectPage);