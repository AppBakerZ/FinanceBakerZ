import React, { Component } from 'react';

import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import FilterBar from '/imports/ui/components/filters/FilterBar.jsx';
import TransactionsTable from '/imports/ui/components/reports/TransactionsTable.jsx';
import Pagination from '/imports/ui/components/reports/Pagination.jsx';
import { Counter } from 'meteor/natestrauser:publish-performant-counts';

import theme from './theme';

class ReportsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillUpdate(nextProps) {

        const {location, params, local} = nextProps;
        let query = location.query, accounts, projects, categories, dateFrom, dateTo;
        accounts = query.accounts ? query.accounts.split(",") : [];
        projects = query.projects ? query.projects.split(",") : [];
        categories = query.categories ? query.categories.split(",") : [];

        dateFrom = query.dateFrom || moment().subtract(1, 'months').startOf('month').format();
        dateTo = query.dateTo || moment().startOf('today').format();


        //first update skip if given
        params.number && updateFilter('reports', 'skip', Math.ceil(params.number * local.limit));

        //filters
        updateFilter('reports', 'type', query.type || 'both');
        updateFilter('reports', 'accounts', accounts);
        updateFilter('reports', 'projects', projects);
        updateFilter('reports', 'categories', categories);

        //date filters
        updateFilter('reports', 'filter', query.filter || 'range');
        updateFilter('reports', 'dateFrom', moment(dateFrom).format());
        updateFilter('reports', 'dateTo', moment(dateTo).format());
    }

    render() {
        return (
            <div className={theme.reports}>
                <FilterBar parentProps={ this.props }/>
                <TransactionsTable />
                <Pagination pageCount={this.props.pageCount} parentProps={ this.props }/>
            </div>
        );
    }
}


export default createContainer(() => {

    const local = LocalCollection.findOne({
        name: 'reports'
    });
    const pageCount = Counter.get('transactionsCount');

    return {
        local: local,
        pageCount: pageCount,
    };
}, ReportsPage);