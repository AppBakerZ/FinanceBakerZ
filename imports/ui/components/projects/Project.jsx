import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Button, Dropdown, Table, Dialog } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Projects } from '../../../api/projects/projects.js';

class ProjectPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filterByDateIs: 'day',
            openDialog : false
        };

        this.props.toggleSidebar(false);

        //this.insert();

    }

    /*only test*/
    insert(){
            Meteor.call('project.insert', {
            project : {
                type : 'full stack',
                name : 'Novobeez',
                client : {
                    name : 'Noman'
                },
                status : 'In progress'

            }
        } , (err, response) => {

           console.log('error...', err);
           console.log('response...', response);
        });
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
        console.log('this.state e.....', e);
        console.log('this.state t.....', t);
        this.setState({openDialog: !this.state.openDialog});
    }

    addNewProjectTemplate(){
        const actions = [
            { label: "Cancel", onClick: this.addNewProject.bind(this) },
            { label: "Save", onClick: this.addNewProject.bind(this) }];
        return(
            <Dialog
                actions={actions}
                active={this.state.openDialog}
                onEscKeyDown={this.addNewProject.bind(this)}
                onOverlayClick={this.addNewProject.bind(this)}
                title='ADD NEW PROJECT'
                >
                <p>Here you can add arbitrary content. Components like Pickers are using dialogs now.</p>
            </Dialog>
        )
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
                onSelect={this.handleSelect}
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