import React, { Component } from 'react';

import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import FilterBar from '/imports/ui/components/filters/FilterBar.jsx';
import TransactionsTable from '/imports/ui/components/reports/TransactionsTable.jsx';
import Pagination from '/imports/ui/components/reports/Pagination.jsx';
import { Counter } from 'meteor/natestrauser:publish-performant-counts';

import theme from './theme';


//define Const
const collection = 'localReports';
class ReportsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillUpdate(nextProps) {
        console.log(nextProps);

        const {location, params, local} = nextProps;
        let query = location.query, accounts, projects, categories, dateFrom, dateTo;
        accounts = query.accounts ? query.accounts.split(",") : [];
        projects = query.projects ? query.projects.split(",") : [];
        categories = query.categories ? query.categories.split(",") : [];

        dateFrom = query.dateFrom || moment().startOf('month').format();
        dateTo = query.dateTo || moment().startOf('today').format();


        //first update skip if given
        params.number && updateFilter(collection, 'skip', Math.ceil(params.number * local.limit));

        //filters
        updateFilter(collection, 'type', query.type || 'both');
        updateFilter(collection, 'accounts', accounts);
        updateFilter(collection, 'projects', projects);
        updateFilter(collection, 'categories', categories);

        //date filters
        updateFilter(collection, 'filter', query.filter || 'range');
        updateFilter(collection, 'dateFrom', moment(dateFrom).format());
        updateFilter(collection, 'dateTo', moment(dateTo).format());
    }

    render() {
        return (
            <div className={theme.reports}>
                <FilterBar parentProps={ this.props } collection="localReports" />
                <TransactionsTable parentProps={this.props} collection="localReports" />
                <Pagination pageCount={this.props.pageCount} parentProps={ this.props }/>
            </div>
        );
    }
}



export default createContainer(() => {

    const local = LocalCollection.findOne({
        name: 'localTransactions'
    });
    const pageCount = Counter.get('transactionsCount');

    return {
        local: local,
        pageCount: pageCount,
    };
}, ReportsPage);