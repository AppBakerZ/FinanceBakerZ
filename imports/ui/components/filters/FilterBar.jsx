import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { } from 'react-toolbox';
import AccountsDD from '/imports/ui/components/filters/AccountsDD.jsx';
import TransactionsType from '/imports/ui/components/filters/TransactionsType.jsx';
import FilterBy from '/imports/ui/components/filters/FilterBy.jsx';
import DateRange from '/imports/ui/components/filters/DateRange.jsx';
import ProjectsDD from '/imports/ui/components/filters/ProjectsDD.jsx';
import CategoriesDD from '/imports/ui/components/filters/CategoriesDD.jsx';

class FilterBar extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }
    render() {

        return (
            <div className='filter-bar'>
                <FilterBy parentProps={ this.props }/>
                {this.props.local.filter === 'range' ? <DateRange parentProps={ this.props }/> : ''}
                <AccountsDD parentProps={ this.props }/>
                <TransactionsType parentProps={ this.props }/>
                {this.props.local.type === 'incomes' ? <ProjectsDD parentProps={ this.props }/> : ''}
                {this.props.local.type === 'expenses' ? <CategoriesDD parentProps={ this.props }/> : ''}


            </div>
        );
    }
}

FilterBar.propTypes = {
    parentProps: PropTypes.object.isRequired

}

export default createContainer(() => {
    return {
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, FilterBar);