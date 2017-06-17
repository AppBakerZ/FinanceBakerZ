import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { } from 'react-toolbox';
import AccountsDD from '/imports/ui/components/filters/AccountsDD.jsx';
import TransactionsType from '/imports/ui/components/filters/TransactionsType.jsx';
import FilterBy from '/imports/ui/components/filters/FilterBy.jsx';
import ProjectsDD from '/imports/ui/components/filters/ProjectsDD.jsx';
import CategoriesDD from '/imports/ui/components/filters/CategoriesDD.jsx';

import { Meteor } from 'meteor/meteor';

class ReportsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }
    render() {
        return (
            <div className='reports'>
                <AccountsDD />
                <TransactionsType />
                <FilterBy />
                <ProjectsDD />
                <CategoriesDD />
            </div>
        );
    }
}

ReportsPage.propTypes = {};

export default createContainer(() => {
    return {};
}, ReportsPage);