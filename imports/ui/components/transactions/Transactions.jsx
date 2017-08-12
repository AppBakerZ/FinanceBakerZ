import React, { Component } from 'react';

import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import FilterBar from '/imports/ui/components/filters/FilterBar.jsx';
import TransactionsTable from '/imports/ui/components/reports/TransactionsTable.jsx';
import Pagination from '/imports/ui/components/reports/Pagination.jsx';
import { Counter } from 'meteor/natestrauser:publish-performant-counts';

import theme from './theme';

class TransactionPage extends Component {

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

        dateFrom = query.dateFrom || moment().startOf('month').format();
        dateTo = query.dateTo || moment().startOf('today').format();


        //first update skip if given else set initial
        let number = params.number || 0;
        updateFilter('localTransactions', 'skip', Math.ceil(number * local.limit));

        //filters
        updateFilter('localTransactions', 'type', query.type || 'both');
        updateFilter('localTransactions', 'accounts', accounts);
        updateFilter('localTransactions', 'projects', projects);
        updateFilter('localTransactions', 'categories', categories);

        //date filters
        updateFilter('localTransactions', 'filter', query.filter || 'range');
        updateFilter('localTransactions', 'dateFrom', moment(dateFrom).format());
        updateFilter('localTransactions', 'dateTo', moment(dateTo).format());
    }

    render() {
        let { pageCount } = this.props;
        return (
            <div className={theme.reports}>
                <FilterBar parentProps={ this.props }/>
                <TransactionsTable parentProps={this.props}/>
                {pageCount ? <Pagination pageCount={this.props.pageCount} parentProps={ this.props }/> : ''}
            </div>
        );
    }
}




export default createContainer(() => {

    const local = LocalCollection.findOne({
        name: 'localTransactions'
    });
    const pageCount = Counter.get('transactionsCount');
    const totalCount = Counter.get('totalCount');

    return {
        totalCount,
        local: local,
        pageCount: pageCount,
    };
}, TransactionPage);