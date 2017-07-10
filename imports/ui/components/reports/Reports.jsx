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
    let pageCount;


    if( local.type === 'incomes' ){
        pageCount = Counter.get('incomesCount')
    }
    else if( local.type === 'expenses' ){
        pageCount = Counter.get('expensesCount')
    }
    else{
        pageCount = Counter.get('transactionsCount')
    }

    return {
        local: local,
        pageCount: pageCount
    };
}, ReportsPage);