import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Button, Input, DatePicker, Dropdown, Table, Dialog, Snackbar } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Projects } from '../../../api/projects/projects.js';

class ProjectPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filterByDateIs: 'day',
            openDialog : false,
            barActive : false,
            project : {
                client : {}
            }
        };
        this.props.toggleSidebar(false);
    }

    /*************** date filters ***************/
    dateFilters(){
        return [
            {
                name: 'Today',
                value: 'day'
            },
            {
                name: 'This Week',
                value: 'week'
            },
            {
                name: 'This Month',
                value: 'month'
            },
            {
                name: 'Last Month',
                value: 'months'
            },
            {
                name: 'This Year',
                value: 'year'
            },
            {
                name: 'Date Range',
                value: 'range'
            }
        ];
    }

    filterByDate(value, event){
        this.setState({[event.target.name]: value});
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

    addNewProject (e, t) {
        this.setState({openDialog: !this.state.openDialog});
    }

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
                        barMessage: 'Add new Project successfully',
                        barIcon: 'done',
                        barType: 'accept'
                    });
                    this.addNewProject();
                }
                console.log('response...', response);
            });

        console.log('createNewProject e', event);
        console.log('addNewProject', this.state);
    }


    barClick () {
        this.setState({ barActive: false });
    }


    addNewProjectTemplate(){
        return(
            <Dialog
                active={this.state.openDialog}
                onEscKeyDown={this.addNewProject.bind(this)}
                onOverlayClick={this.addNewProject.bind(this)}
                title='ADD NEW PROJECT'
                >
                <form className="create-project-form"  onSubmit={this.createNewProject.bind(this)} >
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
                    <Button type="submit" icon='add' label='Add Now' raised primary />
                </form>
            </Dialog>
        )
    }

    handleSelect(selected){
        console.log('this.state.selected',selected, this.state.selected);
    }

    renderProjectTable() {
        const projects = this.props.projects;
        const tableModel = {
            date: {type: Date, title: 'Date'},
            name: {type: String, title: 'Project'},
            clientName: {type: String, title: 'Client'},
            status: {type: String, title: 'Status'}
        };

        const data = projects.map((obj)=>{
            obj.clientName = obj.client.name;
            obj.date = moment(obj.createdAt).format("MMM Do YY");
            return obj;
        });


        return ( <Table
                model={tableModel}
                onRowClick={(i, a) => {
                            console.log(i, a.currentTarget.parentNode)
                            }}
                selectable={false}
                selected={this.state.selected}
                source={data}
                />
        )
    }

    render() {
        return (
            <div className="projects">
                <div className="container">
                    <div className="flex">
                        <div >
                            <Dropdown
                                auto={false}
                                source={this.dateFilters()}
                                name='filterByDateIs'
                                onChange={this.filterByDate.bind(this)}
                                label='Filter by'
                                value={this.state.filterBy}
                                template={this.filterItem}
                                required
                                />
                        </div>
                        <div>
                            <Dropdown
                                auto={false}
                                source={this.dateFilters()}
                                name='filterByDateIs'
                                onChange={this.filterByDate.bind(this)}
                                label='Filter by Project Type'
                                value={this.state.filterBy}
                                template={this.filterItem}
                                required
                                />
                        </div>
                        <div>
                            <Dropdown
                                auto={false}
                                source={this.dateFilters()}
                                name='filterByDateIs'
                                onChange={this.filterByDate.bind(this)}
                                label='Filter By Client'
                                value={this.state.filterBy}
                                template={this.filterItem}
                                required
                                />
                        </div>
                        <div >
                            <Dropdown
                                auto={false}
                                source={this.dateFilters()}
                                name='filterByDateIs'
                                onChange={this.filterByDate.bind(this)}
                                label='Filter By Status'
                                value={this.state.filterBy}
                                template={this.filterItem}
                                required
                                />
                        </div>
                    </div>

                    <div className="page-title">
                        <h3>Projects</h3>
                        <Button icon='add' label='Add New' flat onClick={this.addNewProject.bind(this)} />
                        {this.addNewProjectTemplate()}
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
        projects: Projects.find({}).fetch()
    };
}, ProjectPage);