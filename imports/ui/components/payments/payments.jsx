import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Autocomplete, Button, DatePicker, Dialog, Dropdown, IconButton, Input, Snackbar, Table, ProgressBar, Card} from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'

import Loader from '/imports/ui/components/loader/Loader.jsx';

import { Projects } from '../../../api/projects/projects.js';
import { userCurrencyHelpers } from '../../../helpers/currencyHelpers.js'
import theme from './theme';
import tableTheme from './tableTheme';
import buttonTheme from './buttonTheme';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';

const RECORDS_PER_PAGE = 8;

let pageNumber = 1,
    query = new ReactiveVar({
        limit : RECORDS_PER_PAGE * pageNumber
    });

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

        this.state = {
            filter : {
                client : {}
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
    onRowClick(index){
        console.log('this.props.projects[index] ', this.props.projects[index]);
        this.openPopup('show', this.props.projects[index])
    }


    openPopup (action, project) {
        this.setState({
            openDialog: true,
            action,
            selectedProject: project || null
        });
    }
    closePopup () {
        this.setState({
            openDialog: false
        });
    }
    renderConfirmationMessage(){
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.dialogAccount}>
                <div className={theme.confirmText}>
                    <h3><FormattedMessage {...il8n.BANK_PROJECTS} /></h3>
                    <p><FormattedMessage {...il8n.INFORM_MESSAGE} /></p>
                    <p><FormattedMessage {...il8n.CONFIRMATION_MESSAGE} /></p>
                </div>

                <div className={theme.buttonArea}>
                    <Button label={formatMessage(il8n.BACK_BUTTON)} raised primary onClick={this.closePopup.bind(this)} />
                    <Button label={formatMessage(il8n.REMOVE_BUTTON)} raised theme={buttonTheme} onClick={this.removeProject.bind(this)}/>
                </div>
            </div>
        )
    }
    removeProject(){
        const {_id} = this.state.selectedProject;
        Meteor.call('projects.remove', {
            project: {
                _id
            }
        }, (err, response) => {
            if(err){

            }else{

            }
        });
        // Close Popup
        this.closePopup()
    }

    /*************** Infinite scroll ***************/
    handleScroll(event) {
        let infiniteState = event.nativeEvent;
        if((infiniteState.srcElement.scrollTop + infiniteState.srcElement.offsetHeight) > (infiniteState.srcElement.scrollHeight -1)){
            let copyQuery = query.get();
            copyQuery.limit  = RECORDS_PER_PAGE * (pageNumber += 1);
            query.set(copyQuery);
        }
    }

    /*************** onChange filter value***************/
    onChangeFilter(val, event){
        let copyQuery = query.get(),
            label = event.target.name,
            filter = _.extend(this.state.filter, this.state.filter);

        filter[label] = val;
        if(label == 'client.name'){
            filter['client']['name'] = val;
        }
        this.setState({ filter});
        if(val){
            copyQuery[label] = (label != 'status') ? { $regex : val} : val;
        }
        else{
            delete  copyQuery[label]
        }

        pageNumber = 1;
        copyQuery.limit  = RECORDS_PER_PAGE * pageNumber;
        query.set(copyQuery);
    }

    resetStatusFilter(){
        let copyQuery = query.get(),
            filter = _.extend(this.state.filter, this.state.filter);

        filter.status = '';
        this.setState({ filter});
        delete copyQuery.status;
        query.set(copyQuery);
    }

    renderProjectTable() {
        let payments = [
            'cash',
            'easyPaisa'
        ];


        let projectModel = {
            startAt: {type: Date, title: <FormattedMessage {...il8n.METHOD} />},
        };
        const table = <Table className={theme.table} theme={tableTheme}
                             heading={true}
                             model={projectModel}
                             onRowClick={this.onRowClick.bind(this)}
                             selectable={false}
                             source={payments}
        />;
        return (
            <Card theme={tableTheme}>
                { table }
                { this.props.projectsLoading ? <div className={theme.loaderParent}><Loader primary spinner /></div> : ''}
            </Card>
        )
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className="projects"  onScroll={this.handleScroll}>
                <div className="container">

                    <div className={theme.pageTitle}>
                        <h3> <FormattedMessage {...il8n.PAYMENTS} /> </h3>
                    </div>
                    <Card theme={tableTheme}>
                        {this.props.projectsLoading && this.props.projects.length < RECORDS_PER_PAGE ? <Loader primary /> : this.renderProjectTable()}
                    </Card>
                    <form action="https://easypay.easypaisa.com.pk/easypay/Index.jsf" method="POST">
                        <input type="hidden" name="storeId" value="5820" />
                        <input type="hidden" name="amount" value="10" hidden />
                        <input type="hidden" name="postBackURL" value="http://localhost:3000/app/easyPaisa" hidden/>
                        <input type="hidden" name="orderRefNum" value="1101" />
                        <input type="hidden" name="mobileNum" value="03325241789" />
                        <input caption='EasyPaisa' leftIcon='payment' name="pay" type="submit" label="easyPay"/>
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