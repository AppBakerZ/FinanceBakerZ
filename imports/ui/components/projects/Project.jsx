import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Autocomplete, Button, DatePicker, Dialog, Dropdown, IconButton, Input, Snackbar, Table, ProgressBar} from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'

import { Projects } from '../../../api/projects/projects.js';
import { currencyFormatHelpers, userCurrencyHelpers } from '../../../helpers/currencyHelpers.js'

import theme from './theme';
import dialogTheme from './dialogTheme';
import tableTheme from './tableTheme';
import buttonTheme from './buttonTheme';

const RECORDS_PER_PAGE = 8;

let pageNumber = 1,
    statusFilters = [
        {
            name: 'Working',
            value: 'working'
        },
        {
            name: 'Progress',
            value: 'progress'
        },
        {
            name: 'Waiting',
            value: 'waiting'
        },
        {
            name: 'Completed',
            value: 'completed'
        }
    ],
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
            openDialog : false,
            barActive : false,
            showForm : true,
            updateForm : false,
            loading : false,
            deleteConfirmMessage : false,
            selectedProject : {},
            project : {
                client : {}
            }
        };
        this.props.toggleSidebar(false);
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


    /*************** open popup ***************/
    openedPopup (showForm) {
        this.setState({showForm, openDialog: true, deleteConfirmMessage: false});
    }

    /*************** close popup ***************/
    closePopup () {
        this.setState({openDialog:false, updateForm : false});
    }

    /*************** edit project popup ***************/
    editPopup(){
        let project = JSON.parse(JSON.stringify(this.state.selectedProject));
        delete project.createdAt;
        delete project.clientName;
        delete project.date;
        delete project.updatedAt;
        delete project.owner;
        delete project.test;
        if(project.startAt){
            project.startAt = new Date(project.startAt);
        }
        this.setState({showForm : true, updateForm : true, project});
    }

    deleteProjectToggle(){
        this.setState({deleteConfirmMessage : !this.state.deleteConfirmMessage});
    }

    deleteProject(){
        let selectedProject = this.state.selectedProject;
        this.setState({loading : true});
        Meteor.call('project.remove', {project : {_id : selectedProject._id}}
            , (err, response) => {
                if(err){
                    this.setState({
                        barActive: true,
                        barMessage: err.reason,
                        barIcon: 'error_outline',
                        barType: 'cancel',
                        loading : false
                    });
                }else{
                    this.setState({
                        barActive: true,
                        barMessage:   'Remove' + this.state.selectedProject.name + 'Successfully!',
                        barIcon: 'done',
                        barType: 'accept',
                        loading : false
                    });
                    this.closePopup();
                    this.setState({project :   {client : {}} });

                }
            });
    }

    progressBarToggle (){
        return  this.state.loading ? 'progress-bar' : 'progress-bar hide';
    }

    /*************** onChange value in popup form ***************/
    onChange (val, e) {
        let newProject = _.extend(this.state.project, this.state.project),
            label = e.target.name;

        if(label == 'client.name'){
            newProject['client']['name'] = val;
        }
        else if(label == 'amount'){
            newProject[label] = +val;

        }
        else{
            newProject[label] = val;

        }
        this.setState({ project: newProject });
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

    /*************** reset status filter ***************/
    resetStatusFilter(){
        let copyQuery = query.get(),
            filter = _.extend(this.state.filter, this.state.filter);

        filter.status = '';
        this.setState({ filter});
        delete copyQuery.status;
        query.set(copyQuery);
    }

    /*************** create and update project method  ***************/
    createNewProject(event){
        event.preventDefault();
        const {project} = this.state;
        this.setState({loading : true});
        Meteor.call('project.insert', {project}
            , (err, response) => {
                if(err){
                    this.setState({
                        barActive: true,
                        barMessage: err.reason,
                        barIcon: 'error_outline',
                        barType: 'cancel',
                        loading : false
                    });
                }else{
                    this.setState({
                        barActive: true,
                        barMessage: this.state.updateForm ? 'Update Successfully!' : 'Add new Project successfully',
                        barIcon: 'done',
                        barType: 'accept',
                        loading : false
                    });
                    this.closePopup();
                    this.setState({project :   {client : {}} });

                }
            });
    }

    barClick () {
        this.setState({ barActive: false });
    }

    /*************** Select single project in table row click ***************/
    selectProject(index){
        let selectedProject =  this.props.projects[index] ;
        this.setState({selectedProject});
        this.openedPopup();
    }

    /********************************************* Templates *********************************************/

    /*************** Dropdown select option template ***************/
    dropDownSelectedTemplate (account) {
        return (
            <span>
                <strong>{account.name}</strong>
            </span>
        );
    }

    selectedProjectDetails(){
        return this.state.deleteConfirmMessage ? this.renderConfirmationMessage() : this.renderProjectDetails();
    }

    renderConfirmationMessage(){
        let selectedProject = this.state.selectedProject ;

        return (
            <div>
                <div className={theme.confirmText}>
                    <p>This will remove your all data</p>
                    <p>Are you sure to remove your project?</p>
                </div>

                <div className={theme.buttonDialog}>
                    <Button label='GO BACK' raised primary onClick={this.deleteProjectToggle.bind(this)} />
                    <Button label='YES, REMOVE' raised onClick={this.deleteProject.bind(this)} theme={buttonTheme} />
                </div>
            </div>
        )
    }


    renderProjectDetails(){
        let selectedProject = this.state.selectedProject ;

        return (
            <div>
                <div className={theme.contentTwo}>
                    <div> <p>Client Name :</p> <p>{selectedProject.client.name}</p></div>
                    <div> <p>Project Status :</p> <p>{selectedProject.status}</p></div>
                </div>

                <div className={theme.buttonBox}>
                    <Button label='Edit Information' raised accent onClick={this.editPopup.bind(this)} />
                    <Button label='Delete Project' raised accent onClick={this.deleteProjectToggle.bind(this)} />
                </div>
            </div>
        )
    }
    /*************** Select single project in table row click ***************/
    renderSelectedProject(){
        let selectedProject = this.state.selectedProject ;
        return(
            <div className={theme.contentParent}>
                <div className={theme.contentOne}>
                    <div> <span>Project ID :</span> <span>{selectedProject._id}</span></div>
                    {(selectedProject.startAt) && <div> <span>Date :</span> <span>{moment(selectedProject.startAt).format('MMM Do YY')}</span></div>}
                </div>

                <h4>{selectedProject.name}</h4>

                {this.selectedProjectDetails()}
            </div>
        )
    }

    /*************** form template ***************/
    renderAddProjectForm(){
        let {updateForm, selectedProject} = this.state;
        return(
            <form className={theme.createProjectForm} onSubmit={this.createNewProject.bind(this)} >
                {(updateForm) && <div> <span>Project ID :</span><span>{selectedProject._id}</span></div>}
                {(updateForm && selectedProject.startAt) && <div> <span>Date :</span><span>{moment(selectedProject.startAt).format('MMM Do YY')}</span></div>}

                <h4 className={theme.title}>{(updateForm) ? selectedProject.name :   'Add New Project'}</h4>

                <Input type='text' label='Project Name'
                       name='name'
                       maxLength={ 50 }
                       value={this.state.project.name}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='text' label='Client Name'
                       name='client.name'
                       maxLength={ 50 }
                       value={this.state.project.client.name}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='text' label='Type'
                       name='type'
                       maxLength={ 50 }
                       value={this.state.project.type}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='number' label='Amount'
                       name='amount'
                       value={this.state.project.amount}
                       onChange={this.onChange.bind(this)}
                    />
                <Dropdown
                    auto={true}
                    source={statusFilters}
                    name='status'
                    onChange={this.onChange.bind(this)}
                    label='Status'
                    value={this.state.project.status}
                    template={this.dropDownSelectedTemplate}
                    required
                    />
                <DatePicker
                    label='Start Date'
                    name='startAt'
                    onChange={this.onChange.bind(this)}
                    value={this.state.project.startAt}
                    />
                <div className={theme.addBtn}>
                    <Button type="submit" icon='add' label={(updateForm) ?'update':   'Add New'} raised primary />
                </div>
            </form>
        )
    }

    /*************** choose template which show on popup ***************/
    templateRender(){
        return this.state.showForm ? this.renderAddProjectForm() : this.renderSelectedProject();
    }

    /*************** popup ***************/
    popupTemplate(){
        return(
            <Dialog theme={dialogTheme}
                className={theme.dialogBox}
                active={this.state.openDialog}
                onEscKeyDown={this.closePopup.bind(this)}
                onOverlayClick={this.closePopup.bind(this)}
                >
                <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />
                {this.templateRender()}
            </Dialog>
        )
    }

    /*************** table template ***************/
    renderProjectTable() {
        let projects = this.props.projects;
        let data = _.compact(projects.map((obj)=>{
            if(obj.client){
                obj.clientName = obj.client.name;
                obj.date = obj.startAt ? moment(obj.startAt).format("MMM Do YY") : 'Not Start Yet';
                obj.amount = userCurrencyHelpers.loggedUserCurrency() + currencyFormatHelpers.currencyStandardFormat(obj.amount);
                return obj;
            }
        }));
        if(!data.length) return;
        let tableModel = {
            date: {type: Date, title: 'Date'},
            name: {type: String, title: 'Project'},
            clientName: {type: String, title: 'Client'},
            amount: {type: Number, title: 'Amount'},
            status: {type: String, title: 'Status'}
        };
        return ( <Table theme={tableTheme} className={theme.table}
                heading={false}
                model={tableModel}
                onRowClick={this.selectProject.bind(this)}
                selectable={false}
                source={data}
                />
        )
    }

    /*************** template render ***************/
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
                                source={statusFilters}
                                name='status'
                                onChange={this.onChangeFilter.bind(this)}
                                label='Filter By Status'
                                value={this.state.filter.status}
                                template={this.dropDownSelectedTemplate}
                                />
                            {(this.state.filter.status) && <IconButton className="close" icon='clear' onClick={this.resetStatusFilter.bind(this)} />}
                        </div>
                    </div>

                    <div className={theme.pageTitle}>
                        <h3>Projects</h3>
                        <Button className={theme.button} icon='add' label='Add New' flat onClick={this.openedPopup.bind(this, true)} theme={theme}/>
                        {this.popupTemplate()}
                    </div>
                    {this.renderProjectTable()}

                    <Snackbar
                        action='Dismiss'
                        active={this.state.barActive}
                        icon={this.state.barIcon}
                        label={this.state.barMessage}
                        timeout={2000}
                        onClick={this.barClick.bind(this)}
                        onTimeout={this.barClick.bind(this)}
                        type={this.state.barType}
                        />
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