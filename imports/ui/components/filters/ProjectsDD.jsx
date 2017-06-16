import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Autocomplete } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';

import { Projects } from '../../../api/projects/projects.js';

class ProjectsDD extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }
    projects(){
        let projects = {};
        this.props.projects.forEach((project) => {
            projects[project._id] = project.name;
        });

        return projects;
    }

    filterByProjects(projects) {
        this.setState({multiple: projects});
        this.props.getProjects(projects)
    }

    render() {
        return (
            <Autocomplete
                direction='down'
                onChange={this.filterByProjects.bind(this)}
                label='Projects'
                source={this.projects()}
                value={this.state.multiple}
                />
        );
    }
}

ProjectsDD.propTypes = {
    projects: PropTypes.array.isRequired
};

export default createContainer(() => {

    Meteor.subscribe('projects.all');
    const projects = Projects.find().fetch();

    return {
        projects
    };
}, ProjectsDD);