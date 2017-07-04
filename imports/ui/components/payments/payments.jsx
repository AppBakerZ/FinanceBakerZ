import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Autocomplete, Button, DatePicker, Dialog, Dropdown, IconButton, Input, Snackbar, Table, ProgressBar, Card} from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'


import { Projects } from '../../../api/projects/projects.js';
import theme from './theme';
import tableTheme from './tableTheme';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';

const RECORDS_PER_PAGE = 8;

const paymentModel = {
    radioButton: String,
    icon: String,
};

const paymentMethods = [
    {name: 'Easy Paisa' },
    {name: 'Bank Transfer'}
];

let pageNumber = 1,
    query = new ReactiveVar({
        limit : RECORDS_PER_PAGE * pageNumber
    });

const il8n = defineMessages({
    PAYMENTS: {
        id: 'LEFTMENU.PAYMENTS'
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
    METHOD: {
        id: 'PAYMENTS.METHOD'
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



class PaymentPage extends Component {

    constructor(props) {
        super(props);

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
    onRowClick(index){
        console.log('this.props.projects[index] ', this.props.projects[index]);
    }

    renderPaymentTable() {
        let payments = paymentMethods.map((method, index) => {
            return {
                radioButton:
                    <div>
                        <span>radio goes here</span>
                    </div>,
                icon:
                    <div>icon goes here</div>,

            }
        });

        const table = <Table className={theme.table} theme={tableTheme}
                             heading={false}
                             model={paymentModel}
                             onRowClick={this.onRowClick.bind(this)}
                             selectable={false}
                             source={payments}
        />;
        return (
            <Card theme={tableTheme}>
                { table }
            </Card>
        )
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className="projects">
                <div className="container">

                    <div className={theme.pageTitle}>
                        <h3> <FormattedMessage {...il8n.PAYMENTS} /> </h3>
                    </div>
                    <Card theme={tableTheme}>
                        {this.renderPaymentTable()}
                    </Card>
                    <form action="https://easypay.easypaisa.com.pk/easypay/Index.jsf" method="POST">
                        <input type="hidden" name="storeId" value="5820" />
                        <input type="hidden" name="amount" value="10" hidden />
                        <input type="hidden" name="postBackURL" value="http://localhost:3000/app/easyPaisa" hidden/>
                        <input type="hidden" name="orderRefNum" value="1101" />
                        <input type="hidden" name="mobileNum" value="03325241789" />
                        <button caption='EasyPaisa' leftIcon='payment' name="pay" type="submit" label="easyPay">Proceed</button>
                    </form>
                </div>
            </div>
        );
    }
}

PaymentPage.propTypes = {
    projects: PropTypes.array.isRequired,
    intl: intlShape.isRequired
};

PaymentPage = createContainer(() => {
    const projectsHandle = Meteor.subscribe('projects', query.get());
    const projectsLoading = !projectsHandle.ready();
    const projects = Projects.find().fetch();
    const projectsExists = !projectsLoading && !!projects.length;
    return {
        projectsLoading,
        projects,
        projectsExists
    };
}, PaymentPage);

export default injectIntl(PaymentPage);