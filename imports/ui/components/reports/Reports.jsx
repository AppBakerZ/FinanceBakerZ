import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { } from 'react-toolbox';
import AccountsDD from '/imports/ui/components/filters/AccountsDD.jsx';
import TransactionsType from '/imports/ui/components/filters/TransactionsType.jsx';
import FilterBy from '/imports/ui/components/filters/FilterBy.jsx';
import ProjectsDD from '/imports/ui/components/filters/ProjectsDD.jsx';

import { Meteor } from 'meteor/meteor';

class ReportsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }
    getAccounts(accounts){
        console.log('accounts', accounts);
    }
    getType(type){
        console.log('type', type);
    }
    getFilter(filter){
        console.log('filter', filter);
    }
    getProjects(project){
        console.log('project', project);
    }
    render() {
        return (
            <div className='reports'>
                <AccountsDD  getAccounts={this.getAccounts.bind(this)}/>
                <TransactionsType  getType={this.getType.bind(this)}/>
                <FilterBy  getFilter={this.getFilter.bind(this)}/>
                <ProjectsDD  getProjects={this.getProjects.bind(this)}/>
            </div>
        );
    }
}

ReportsPage.propTypes = {};

export default createContainer(() => {

    return {};
}, ReportsPage);