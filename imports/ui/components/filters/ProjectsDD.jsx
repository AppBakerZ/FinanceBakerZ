import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Autocomplete } from 'react-toolbox';
import { Meteor } from 'meteor/meteor';
import { Projects } from '../../../api/projects/projects.js';
import {intlShape, injectIntl, defineMessages} from 'react-intl';

import theme from './theme';

const il8n = defineMessages({
    FILTER_BY_PROJECT: {
        id: 'TRANSACTIONS.FILTER_BY_PROJECT'
    }
});

class ProjectsDD extends Component {

    constructor(props) {
        super(props);
    }
    projects(){
        let projects = {};
        this.props.projects.forEach((project) => {
            projects[project._id] = project.name;
        });

        return projects;
    }
    filterByProjects(projects) {
        updateFilter('reports', 'projects', projects)
    }
    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.autoCompleteIncomeParent}>
                <Autocomplete
                    theme={theme}
                    className={theme.autoCompleteIncome}
                    direction='down'
                    onChange={this.filterByProjects.bind(this)}
                    label={formatMessage(il8n.FILTER_BY_PROJECT)}
                    source={this.projects()}
                    value={this.props.local.projects}
                    />
            </div>
        );
    }
}

ProjectsDD.propTypes = {
    projects: PropTypes.array.isRequired
};

export default injectIntl(createContainer(() => {

    Meteor.subscribe('projects.all');
    const projects = Projects.find().fetch();

    return {
        projects,
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, ProjectsDD));