import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Autocomplete, Button, DatePicker, Dialog, Dropdown, IconButton, Input, Snackbar, Table, ProgressBar, Card} from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'

import Form from './Form.jsx';
import ProjectDetail from './ProjectDetail.jsx';
import Loader from '/imports/ui/components/loader/Loader.jsx';

import { Projects } from '../../../api/projects/projects.js';
import { userCurrencyHelpers } from '../../../helpers/currencyHelpers.js'
import theme from './theme';
import dialogTheme from './dialogTheme';
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
    }
});



class ProjectPage extends Component {

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

        this.statuses = [
            {
                label: 'In Progress',
                value: 'progress'
            },
            {
                label: 'Waiting for Feedback',
                value: 'waiting'
            },
            {
                label: 'Completed',
                value: 'completed'
            }
        ];
    }
    onRowClick(index){
        console.log('this.props.projects[index] ', this.props.projects[index]);
        this.openPopup('show', this.props.projects[index])
    }
    popupTemplate(){
        return(
            <Dialog theme={dialogTheme}
                    active={this.state.openDialog}
                    onEscKeyDown={this.closePopup.bind(this)}
                    onOverlayClick={this.closePopup.bind(this)}
                >
                {this.switchPopupTemplate()}
            </Dialog>
        )
    }
    switchPopupTemplate(){
        switch (this.state.action){
            case 'show':
                return <ProjectDetail openPopup={this.openPopup.bind(this)} closePopup={this.closePopup.bind(this)} project={this.state.selectedProject} />;
                break;
            case 'remove':
                return this.renderConfirmationMessage();
                break;
            case 'edit':
                return <Form statuses={this.statuses} project={this.state.selectedProject} closePopup={this.closePopup.bind(this)} />;
                break;
            case 'add':
                return <Form statuses={this.statuses} closePopup={this.closePopup.bind(this)} />;
                break;
        }

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
            console.log('handleScroll');
            let copyQuery = query.get();
            copyQuery.limit  = RECORDS_PER_PAGE * (pageNumber + 1);
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

        let projects = this.props.projects.map((project) => {
            let { name, status, client, startAt, amount } = project;
            return {
                name,
                status,
                clientName: client && client.name,
                startAt: startAt ? moment(startAt).format("MMM Do YY") : 'Not Start Yet',
                amount: (<span>
        <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <FormattedNumber value={amount}/> </span>)
            };
        });


        let projectModel = {
            startAt: {type: Date, title: <FormattedMessage {...il8n.DATE} />},
            name: {type: String, title: <FormattedMessage {...il8n.PROJECT} />},
            clientName: {type: String, title: <FormattedMessage {...il8n.CLIENT} />},
            amount: {type: Number, title: <FormattedMessage {...il8n.AMOUNT} />},
            status: {type: String, title: <FormattedMessage {...il8n.STATUS} />}
        };
       const table = <Table className={theme.table} theme={tableTheme}
                            heading={true}
                            model={projectModel}
                            onRowClick={this.onRowClick.bind(this)}
                            selectable={false}
                            source={projects}
           />;
      const something =
            <div className={theme.projectNothing}>
                <span className={theme.errorShow}><FormattedMessage {...il8n.NO_PROJECTS_ADDED} /></span>
                <div className={theme.addProjectBtn}>
                    <Button type='button' icon='add' raised primary onClick={this.openPopup.bind(this, 'add')} />
                </div>
                <span className={theme.errorShow}><FormattedMessage {...il8n.ADD_PROJECTS} /></span>
            </div>;
        return (
            <Card theme={tableTheme}>
                { this.props.projectsExists ||  projects.length ? table : something}
                { this.props.projectsLoading ? <div className={theme.loaderParent}><Loader primary spinner /></div> : ''}
            </Card>
        )
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className="projects"  onScroll={this.handleScroll}>
                <div className="container">
                    <div>
                        <div className={theme.inputField}>
                            <Input type='text'
                                   label={formatMessage(il8n.FILTER_BY_PROJECT_NAME)}
                                   name='name'
                                   value={this.state.filter.name}
                                   onChange={this.onChangeFilter.bind(this)}
                                />
                        </div>
                        <div className={theme.inputField}>
                            <Input type='text'
                                   label={formatMessage(il8n.FILTER_BY_CLIENT_NAME)}
                                   name='client.name'
                                   value={this.state.filter.client.name}
                                   onChange={this.onChangeFilter.bind(this)}
                                />
                        </div>
                        <div className={theme.inputDropdown}>
                            <Dropdown
                                auto={true}
                                source={this.statuses}
                                name='status'
                                onChange={this.onChangeFilter.bind(this)}
                                label={formatMessage(il8n.FILTER_BY_STATUS)}
                                value={this.state.filter.status}
                                />
                            {(this.state.filter.status) && <IconButton className="close" icon='clear' onClick={this.resetStatusFilter.bind(this)} />}
                        </div>
                    </div>

                    <div className={theme.pageTitle}>
                        <h3> <FormattedMessage {...il8n.PROJECTS} /> </h3>
                        <Button
                            className={theme.button}
                            icon='add'
                            label={formatMessage(il8n.ADD_NEW_PROJECTS)}
                            flat
                            onClick={this.openPopup.bind(this, 'add')}
                            theme={theme}
                            />
                    </div>
                    <Card theme={tableTheme}>
                        {this.props.projectsLoading && this.props.projects.length < RECORDS_PER_PAGE ? <Loader primary /> : this.renderProjectTable()}
                    </Card>
                    {this.popupTemplate()}
                </div>
            </div>
        );
    }
}

ProjectPage.propTypes = {
    projects: PropTypes.array.isRequired,
    intl: intlShape.isRequired
};

ProjectPage = createContainer(() => {
    const projectsHandle = Meteor.subscribe('projects', query.get());
    const projectsLoading = !projectsHandle.ready();
    const projects = Projects.find().fetch();
    const projectsExists = !projectsLoading && !!projects.length;
    return {
        projectsLoading,
        projects,
        projectsExists
    };
}, ProjectPage);

export default injectIntl(ProjectPage);