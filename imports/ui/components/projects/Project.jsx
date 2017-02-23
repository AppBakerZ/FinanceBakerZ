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
import { currencyFormatHelpers, userCurrencyHelpers } from '../../../helpers/currencyHelpers.js'

import theme from './theme';
import dialogTheme from './dialogTheme';
import tableTheme from './tableTheme';
import buttonTheme from './buttonTheme';

const RECORDS_PER_PAGE = 8;

let pageNumber = 1,
    query = new ReactiveVar({
        limit : RECORDS_PER_PAGE * pageNumber
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
        return (
            <div className={theme.dialogAccount}>
                <div className={theme.confirmText}>
                    <h3>bank project</h3>
                    <p>This will remove your all data</p>
                    <p>Are you sure to remove your bank project?</p>
                </div>

                <div className={theme.buttonArea}>
                    <Button label='GO BACK' raised primary onClick={this.closePopup.bind(this)} />
                    <Button label='YES, REMOVE' raised theme={buttonTheme} onClick={this.removeProject.bind(this)}/>
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
        <i className={userCurrencyHelpers.loggedUserCurrency()}></i> {currencyFormatHelpers.currencyStandardFormat(amount)}</span>)
            };
        });

        if(!projects.length) return;

        let projectModel = {
            startAt: {type: Date, title: 'Date'},
            name: {type: String, title: 'Project'},
            clientName: {type: String, title: 'Client'},
            amount: {type: Number, title: 'Amount'},
            status: {type: String, title: 'Status'}
        };

        return (
            <Card theme={tableTheme}>
                <Table className={theme.table} theme={tableTheme}
                       heading={false}
                       model={projectModel}
                       onRowClick={this.onRowClick.bind(this)}
                       selectable={false}
                       source={projects}
                    />
                <div className={theme.projectNothing}>
                    <span className={theme.errorShow}>you do not have any projects</span>
                    <div className={theme.addProjectBtn}>
                        <Button type='button' icon='add' raised primary />
                    </div>
                    <span className={theme.errorShow}>add some to show</span>
                </div>
            </Card>
        )
    }

    render() {
        return (
            <div className="projects"  onScroll={this.handleScroll}>
                <div className="container">
                    <div>
                        <div className={theme.inputField}>
                            <Input type='text'
                                   label="Filter by Project Name"
                                   name='name'
                                   value={this.state.filter.name}
                                   onChange={this.onChangeFilter.bind(this)}
                                />
                        </div>
                        <div className={theme.inputField}>
                            <Input type='text'
                                   label="Filter by Client Name"
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
                                label='Filter By Status'
                                value={this.state.filter.status}
                                />
                            {(this.state.filter.status) && <IconButton className="close" icon='clear' onClick={this.resetStatusFilter.bind(this)} />}
                        </div>
                    </div>

                    <div className={theme.pageTitle}>
                        <h3>Projects</h3>
                        <Button
                            className={theme.button}
                            icon='add'
                            label='Add New'
                            flat
                            onClick={this.openPopup.bind(this, 'add')}
                            theme={theme}
                            />
                    </div>
                    {this.renderProjectTable()}
                    {this.popupTemplate()}

                </div>
            </div>
        );
    }
}

ProjectPage.propTypes = {
    projects: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('projects', query.get());
    return {
        projects: Projects.find().fetch()
    };
}, ProjectPage);