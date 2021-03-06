import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import { routeHelpers } from '../../../helpers/routeHelpers.js'
import { AppConfig} from "/imports/utils/config";

import { Autocomplete, Button, DatePicker, Dialog, Dropdown, IconButton, Input, Snackbar, Table, ProgressBar, Card} from 'react-toolbox';

import { Meteor } from 'meteor/meteor';

import NothingFound from '../utilityComponents/NothingFound.jsx'
import RecordsNotExists from '../utilityComponents/RecordsNotExists.jsx'
import Pagination from '/imports/ui/components/reports/Pagination.jsx';

import { Projects } from '../../../api/projects/projects.js';
import { userCurrencyHelpers } from '../../../helpers/currencyHelpers.js'
import theme from './theme';
import tableTheme from './tableTheme';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';

const il8n = defineMessages({
    NO_PROJECTS_ADDED: {
        id: 'PROJECTS.NO_PROJECTS_ADDED'
    },
    GENERALIZED_FILTER: {
        id: 'PROJECTS.GENERALIZED_FILTER'
    },
    NO_PROJECTS_MATCHED: {
        id: 'PROJECTS.NO_PROJECTS_MATCHED'
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



class ProjectPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filter : {
                name: '',
                client : {
                    name: ''
                },
                status:''
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

    componentWillUpdate(nextProps) {
        const { location, params, local } = nextProps;
        let query = location.query;

        //first update skip if given else set initial
        let number = params.number || 0;
        updateFilter('localProjects', 'skip', Math.ceil(number * local.limit));

        //filters
        updateFilter('localProjects', 'projectName', query.projectName);
        updateFilter('localProjects', 'client.name', query['client.name']);
        updateFilter('localProjects', 'status', query.status);
    }

    componentDidMount(){
        this.updateFilters()
    }

    updateFilters(){
        const { location } = this.props;
        let { filter } =  this.state;
        let query = location.query;
        query.projectName && (filter['name'] = query.projectName);
        query['client.name'] && (filter['client']['name'] = query['client.name']);
        query.status && (filter['status'] = query.status);
        this.setState([filter])
    }

    onRowClick(index){
        let id = this.props.projects[index]._id;
        AppConfig.setPreviousRoute(location.href);
        routeHelpers.changeRoute(`/app/projectDetail/${id}`);
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


    /*************** onChange filter value***************/
    onChangeFilter(val, event){
        let { location } = this.props;
        let query = location.query;
        let label = event.target.name,
            filter = _.extend(this.state.filter, this.state.filter);
        filter[label] = val;

        //reset pagination on any filter change
        let pathname = routeHelpers.resetPagination(location.pathname);

        if(label === 'name'){
            // transaction filter
            if( query.projectName !== val ){
                query.projectName = val;
                routeHelpers.changeRoute(pathname, 0, query)
            }
        }
        else{
            if( query[label] !== val ){
                query[label] = val;
                routeHelpers.changeRoute(pathname, 0, query)
            }
        }
        if(label === 'client.name'){
            filter['client']['name'] = val;
        }
        this.setState({ filter});
    }

    resetStatusFilter(){
        let { location } = this.props;
        let { filter } = this.state;
        let query = location.query;
        delete query.status;
        filter.status = '';
        this.setState({ filter });
        let pathname = routeHelpers.resetPagination(location.pathname);
        routeHelpers.changeRoute(pathname, 0, query);
    }

    renderProjectTable() {

        let projects = this.props.projects.map((project) => {
            let { name, status, client, startAt, amount } = project;
            return {
                name,
                status,
                clientName: client && client.name ? client.name :'-',
                startAt: startAt ? moment(startAt).format("MMM Do YY") : 'Not Start Yet',
                amount: (<span>
        <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <FormattedNumber value={amount || 0}/> </span>)
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
        return (
            <Card theme={tableTheme}>
                { projects.length ? table : this.props.projectsTotal ? <NothingFound route="/app/projects/add/new"/>: <RecordsNotExists route="app/projects/add/new"/>}
            </Card>
        )
    }

    addProject(){
        AppConfig.setPreviousRoute(location.href);
        routeHelpers.changeRoute('/app/projects/add/new');
    }

    render() {
        const { formatMessage } = this.props.intl;
        let { pageCount } = this.props;
        return (
            <div className="projects">
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
                            onClick={this.addProject.bind(this)}
                            theme={theme}
                            />
                    </div>
                    <Card theme={tableTheme} className={theme.responsiveTable}>
                        { this.renderProjectTable() }
                    </Card>
                </div>
                {pageCount ? <Pagination pageCount={this.props.pageCount} parentProps={ this.props }/> : ''}

            </div>
        );
    }
}

ProjectPage.propTypes = {
    projects: PropTypes.array.isRequired,
    intl: intlShape.isRequired
};

ProjectPage = createContainer(() => {
    let projectsFind = Projects.find().fetch();

    const local = LocalCollection.findOne({
        name: 'localProjects'
    });

    const pageCount = Counter.get('projectsCount');
    const projectsTotal = Counter.get('projectsTotal');

    const projectsHandle = Meteor.subscribe('projects', {
        name: local.projectName === '' ? {} : {
            $regex: local.projectName
        },
        'client.name': local.client.name === '' ? {} : {
            $regex: local.client.name
        },
        status: local.status,
        limit : local.limit,
        skip: local.skip,
    });

    const projectsLoading = !projectsHandle.ready();
    const projects = Projects.find().fetch();
    const projectsExists = !projectsLoading && !!projects.length;
    return {
        local: LocalCollection.findOne({
            name: 'localProjects'
        }),
        projectsFind,
        pageCount,
        projectsTotal,
        projectsLoading,
        projects,
        projectsExists
    };
}, ProjectPage);

export default injectIntl(ProjectPage);