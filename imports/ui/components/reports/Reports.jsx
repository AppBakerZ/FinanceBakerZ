import React, { Component } from 'react';

import { createContainer } from 'meteor/react-meteor-data';

import FilterBar from '/imports/ui/components/filters/FilterBar.jsx';
import TransactionsTable from '/imports/ui/components/reports/TransactionsTable.jsx';
import Pagination from '/imports/ui/components/reports/Pagination.jsx';
import Arrow from '/imports/ui/components/arrow/Arrow.jsx';

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
                <Pagination />
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