import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Autocomplete, Button, DatePicker, Dialog, Dropdown, IconButton, Input, Snackbar, Table} from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'

import { Projects } from '../../../api/projects/projects.js';

let filters = new ReactiveVar({});


class ProjectPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filter : {},
            openDialog : false,
            distinct : {
                type : []
            },
            barActive : false,
            showForm : true,
            updateForm : false,
            selectedProject : {},
            project : {
                client : {}
            }
        };
        this.props.toggleSidebar(false);
    }


    /*************** status filters ***************/
    statusFilters(){
        return [
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

        ];
    }

    filterItem (account) {
        const containerStyle = {
            display: 'flex',
            flexDirection: 'row'
        };

        const contentStyle = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 2
        };

        return (
            <div style={containerStyle}>
                <div style={contentStyle}>
                    <strong>{account.name}</strong>
                </div>
            </div>
        );
    }

    /*************** open popup ***************/
    openedPopup (showForm) {
        this.setState({showForm, openDialog: true});
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

    /*************** onChange value in popup form ***************/
    onChange (val, e) {
        let newProject = _.extend(this.state.project, this.state.project),
            label = e.target.name;

        if(label == 'client.name'){
            newProject['client']['name'] = val;
        }
        else{
            newProject[label] = val;

        }
        this.setState({ project: newProject });
    }

    /*************** onChange filter value***************/
    onChangeFilter(val, event){
        let copyFilter = filters.get();
        let  label = event.target.name;
        if(label == 'startAt'){
            this.setState({ dateFilter: val });
            let startDate = new Date(val); // this is the starting date that looks like ISODate("2014-10-03T04:00:00.188Z")
            startDate.setSeconds(0);
            startDate.setHours(0);
            startDate.setMinutes(0);

            let endDate = new Date(val);
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);

            copyFilter.startAt = {
                $gt:startDate,
                $lt:endDate
            };
            filters.set(copyFilter);
        }
        else{
            let filter = _.extend(this.state.filter, this.state.filter);
            filter[label] = val;
            this.setState({ filter});
            copyFilter[label] = val;
            filters.set(copyFilter);
            console.log('filters get ...', filters.get());
        }

    }

    resetDateFilter(){
        this.setState({ dateFilter: '' });
        let copyFilter = filters.get();
        delete copyFilter.startAt;
        filters.set(copyFilter);
    }

    /*************** create and update project method  ***************/
    createNewProject(event){
        event.preventDefault();
        const {project} = this.state;
        Meteor.call('project.insert', {project}
            , (err, response) => {
                if(err){
                    this.setState({
                        barActive: true,
                        barMessage: err.reason,
                        barIcon: 'error_outline',
                        barType: 'cancel'
                    });
                }else{
                    this.setState({
                        barActive: true,
                        barMessage: this.state.updateForm ? 'Update Successfully!' : 'Add new Project successfully',
                        barIcon: 'done',
                        barType: 'accept'
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

    /*************** Select single project in table row click ***************/
    renderSelectedProject(){
        let selectedProject = this.state.selectedProject ;
        return(
            <div>
                <div> <span>Project ID :</span><span>{selectedProject._id}</span></div>
                {(selectedProject.startAt) && <div> <span>Date :</span><span>{moment(selectedProject.startAt).format('MMM Do YY')}</span></div>}

                    <h4>{selectedProject.name}</h4>

                <div> <span>Client Name:</span><span>{selectedProject.client.name}</span></div>
                <div> <span>Project Status :</span><span>{selectedProject.status}</span></div>

                <Button label='Edit Information' raised primary onClick={this.editPopup.bind(this)} />
            </div>
        )
    }

    /*************** form template ***************/
    renderAddProjectForm(){
        let {updateForm, selectedProject} = this.state;
        return(
            <form className="create-project-form"  onSubmit={this.createNewProject.bind(this)} >
                {(updateForm) && <div> <span>Project ID :</span><span>{selectedProject._id}</span></div>}
                {(updateForm && selectedProject.startAt) && <div> <span>Date :</span><span>{moment(selectedProject.startAt).format('MMM Do YY')}</span></div>}

                <h4>{(updateForm) ? selectedProject.name :   'Add New Project'}</h4>

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
                <Input type='text' label='Status'
                       name='status'
                       maxLength={ 50 }
                       value={this.state.project.status}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <DatePicker
                    label='Start Date'
                    name='startAt'
                    onChange={this.onChange.bind(this)}
                    value={this.state.project.startAt}
                    />
                <Button type="submit" icon='add' label={(updateForm) ?'update':   'Add Now'} raised primary />
            </form>
        )
    }

    templateRender(){
        return this.state.showForm ? this.renderAddProjectForm() : this.renderSelectedProject();
    }

    popupTemplate(){
        return(
            <Dialog
                className='dialog-box tiny-scroll'
                active={this.state.openDialog}
                onEscKeyDown={this.closePopup.bind(this)}
                onOverlayClick={this.closePopup.bind(this)}
                >
                {this.templateRender()}
            </Dialog>
        )
    }

    renderProjectTable() {
        const projects = this.props.projects;
        const tableModel = {
            date: {type: Date, title: 'Date'},
            name: {type: String, title: 'Project'},
            type:{type: String, title: 'Type'},
            clientName: {type: String, title: 'Client'},
            status: {type: String, title: 'Status'}
        };

        const data = projects.map((obj)=>{
            obj.clientName = obj.client.name;
            obj.date = obj.startAt ? moment(obj.startAt).format("MMM Do YY") : 'Not Start Yet';
            return obj;
        });

        return ( <Table
                model={tableModel}
                onRowClick={this.selectProject.bind(this)}
                selectable={false}
                source={data}
                />
        )
    }

    render() {
        return (
            <div className="projects">
                <div className="container">
                    <div className="flex">
                        <div className="date-picker">
                            <DatePicker
                                label='Filter Date'
                                name='startAt'
                                onChange={this.onChangeFilter.bind(this)}
                                value={this.state.dateFilter}
                                />
                            {(this.state.dateFilter) && <IconButton className="close" icon='clear' onClick={this.resetDateFilter.bind(this)} />}
                        </div>
                        <div>
                            <Input type='text'
                                   label="Filter by Project Type"
                                   name='type'
                                   value={this.state.filter.type}
                                   onChange={this.onChangeFilter.bind(this)}
                                />
                        </div>
                        <div>
                            <Input type='text'
                                   label="Filter by Client Name"
                                   name='type'
                                   value={this.state.filter.type}
                                   onChange={this.onChangeFilter.bind(this)}
                                />
                        </div>
                        <div >
                            <Dropdown
                                auto={true}
                                source={this.statusFilters()}
                                name='status'
                                onChange={this.onChangeFilter.bind(this)}
                                label='Filter By Status'
                                value={this.state.filter.status}
                                template={this.filterItem}
                                required
                                />
                        </div>
                    </div>

                    <div className="page-title">
                        <h3>Projects</h3>
                        <Button icon='add' label='Add New' flat onClick={this.openedPopup.bind(this, true)} />
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
    Meteor.subscribe('projects');
    return {
        projects: Projects.find(filters.get()).fetch()
    };
}, ProjectPage);