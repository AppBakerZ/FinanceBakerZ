import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { } from 'react-toolbox';
import AccountsDD from '/imports/ui/components/filters/AccountsDD.jsx';
import TransactionsType from '/imports/ui/components/filters/TransactionsType.jsx';
import FilterBy from '/imports/ui/components/filters/FilterBy.jsx';
import DateRange from '/imports/ui/components/filters/DateRange.jsx';
import ProjectsDD from '/imports/ui/components/filters/ProjectsDD.jsx';
import CategoriesDD from '/imports/ui/components/filters/CategoriesDD.jsx';

import { Meteor } from 'meteor/meteor';

class ReportsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }
    render() {
        console.log("this.props.local.filter == 'range'", this.props.local.filter == 'range');
        return (
            <div className='reports'>
                <AccountsDD />
                <TransactionsType />
                {this.props.local.type == 'incomes' ? <ProjectsDD /> : ''}
                {this.props.local.type == 'expenses' ? <CategoriesDD /> : ''}
                <FilterBy />
                {this.props.local.filter == 'range' ? <DateRange /> : ''}
            </div>
        );
    }
}

export default createContainer(() => {
    return {
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, ReportsPage);