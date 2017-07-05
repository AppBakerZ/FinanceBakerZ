import React, { Component } from 'react';

import { createContainer } from 'meteor/react-meteor-data';

import FilterBar from '/imports/ui/components/filters/FilterBar.jsx';
import TransactionsTable from '/imports/ui/components/reports/TransactionsTable.jsx';
import Pagination from '/imports/ui/components/reports/Pagination.jsx';
import Arrow from '/imports/ui/components/arrow/Arrow.jsx';
import { Counter } from 'meteor/natestrauser:publish-performant-counts';
import { dateHelpers } from '../../../helpers/dateHelpers.js'

import theme from './theme';

class ReportsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className={theme.reports}>
                <FilterBar />
                <TransactionsTable />
                <Pagination pageCount={this.props.pageCount} />
            </div>
        );
    }
}


export default createContainer(() => {

    const local = LocalCollection.findOne({
        name: 'reports'
    });

    console.log(Counter.get('countIncomes'));
    console.log(Counter.get('countExpenses'));
    console.log('Plus: ', Counter.get('countExpenses') + Counter.get('countIncomes'));

    //currently no need here?
    // const transactionsHandle = Meteor.subscribe('transactions', {
    //     limit : 10,
    //     skip: local.skip,
    //     accounts: local.accounts,
    //     dateFilter: dateHelpers.filterByDate(local.filter, {
    //         dateFrom: local.dateFrom,
    //         dateTo: local.dateTo
    //     }),
    //     type: local.type,
    //     filterByCategory: local.type == 'expenses' ? local.categories : '',
    //     filterByProjects: local.type == 'incomes' ? local.projects : ''
    // });



    return {
        local: LocalCollection.findOne({
            name: 'reports'
        }),
        pageCount: Counter.get('countExpenses') + Counter.get('countIncomes')
    };
}, ReportsPage);