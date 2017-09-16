import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';
import { Autocomplete } from 'react-toolbox';
import { Meteor } from 'meteor/meteor';
import { Projects } from '../../../api/projects/projects.js';
import {intlShape, injectIntl, defineMessages} from 'react-intl';
import { routeHelpers } from '../../../helpers/routeHelpers.js'

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
        let { parentProps } = this.props.parentProps;
        let { location } = parentProps;
        let pathname = routeHelpers.resetPagination(location.pathname);
        let query = location.query;
        query.projects = `${[projects]}`;
        routeHelpers.changeRoute(pathname, 0, query)
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
    projects: PropTypes.array.isRequired,
    parentProps: PropTypes.object.isRequired
};

export default injectIntl(createContainer((props) => {

    Meteor.subscribe('projects.all');
    const projects = Projects.find().fetch();
    let { parentProps } = props;
    return {
        projects,
        local: LocalCollection.findOne({
            name: parentProps.collection
        })
    };
}, ProjectsDD));