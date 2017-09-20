import React, { Component } from 'react';

import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Categories } from '/imports/api/categories/categories.js'
import FilterBar from '/imports/ui/components/filters/FilterBar.jsx';
import TransactionsTable from '/imports/ui/components/reports/TransactionsTable.jsx';
import Pagination from '/imports/ui/components/reports/Pagination.jsx';
import { Counter } from 'meteor/natestrauser:publish-performant-counts';

import theme from './theme';
//define Const
const collection = 'localTransactions';
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
        updateFilter(collection, 'skip', Math.ceil(number * local.limit));

        //filters
        updateFilter(collection, 'type', query.type || 'both');
        updateFilter(collection, 'accounts', accounts);
        updateFilter(collection, 'projects', projects);
        if(query.childrenIncluded === 'true'){
            const allCategories = this.props.categories;
            let childCategories = allCategories.filter(child => {
                return child.parent && child.parent.id === categories[0]
            });
            if(childCategories.length){
                childCategories = childCategories.map(cat => {
                    return cat._id
                });
                categories = _.union(categories, childCategories)
            }
        }
        updateFilter(collection, 'categories', categories);

        //date filters
        updateFilter(collection, 'filter', query.filter || 'range');
        updateFilter(collection, 'dateFrom', moment(dateFrom).format());
        updateFilter(collection, 'dateTo', moment(dateTo).format());
    }

    render() {
        let { pageCount } = this.props;
        return (
            <div className={theme.reports}>
                <FilterBar parentProps={ this.props } collection="localTransactions" />
                <TransactionsTable parentProps={this.props} collection="localTransactions" />
                {pageCount ? <Pagination pageCount={this.props.pageCount} parentProps={ this.props }/> : ''}
            </div>
        );
    }
}




export default createContainer(() => {
    Meteor.subscribe('categories');
    const local = LocalCollection.findOne({
        name: 'localTransactions'
    });
    const categories = Categories.find().fetch();
    const pageCount = Counter.get('transactionsCount');
    const transactionsTotal = Counter.get('transactionsTotal');

    return {
        categories,
        transactionsTotal,
        local: local,
        pageCount: pageCount,
    };
}, TransactionPage);