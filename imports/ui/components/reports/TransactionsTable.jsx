import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router';

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Card } from 'react-toolbox/lib/card';
import {Button, IconButton} from 'react-toolbox/lib/button';

import moment from 'moment';
import { Table, Snackbar } from 'react-toolbox';
import {defineMessages, FormattedMessage, FormattedNumber} from 'react-intl';

import Arrow from '/imports/ui/components/arrow/Arrow.jsx';
import transactionsTable from './transactionsTable';
import { routeHelpers } from '../../../helpers/routeHelpers.js'

import { Transactions } from '../../../api/transactions/transactions';
import { Projects } from '../../../api/projects/projects.js';
import { Categories } from '../../../api/categories/categories.js';

import { userCurrencyHelpers } from '../../../helpers/currencyHelpers.js'
import { dateHelpers } from '../../../helpers/dateHelpers.js'

const il8n = defineMessages({
    TRANSACTION_DATE: {
        id: 'TRANSACTIONS.TRANSACTION_DATE'
    },
    TRANSACTION_CATEGORY: {
        id: 'TRANSACTIONS.TRANSACTION_CATEGORY'
    },
    AMOUNT_OF_TRANSACTION: {
        id: 'TRANSACTIONS.AMOUNT_OF_TRANSACTION'
    }
});

class TransactionsTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            active: false
        };
    }
    selectItem(index){
        let selectedTransaction =  this.props.transactions[index] ;
        browserHistory.push({
            pathname: `/app/transactions/${selectedTransaction.type}/${selectedTransaction._id}`
        })
    }
    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }
    getTableModel(){
        return {
            leftIcon: {type: String},
            date: {type: Date, title: <FormattedMessage {...il8n.TRANSACTION_DATE} />},
            category: {type: Date, title: <FormattedMessage {...il8n.TRANSACTION_CATEGORY} />},
            amount: {type: Date, title: <FormattedMessage {...il8n.AMOUNT_OF_TRANSACTION} />},
            rightIcon: {type: String}
        }
    }
    addIncome(){
        if(this.props.projectExists){
            routeHelpers.changeRoute('/app/transactions/income/add/new');
        }
        else{
            this.setState({
                active: true,
                barMessage: 'You must have a single project to add income'
            });
        }

    }
    addExpense(){
        if(this.props.categoryExists){
            routeHelpers.changeRoute('/app/transactions/expense/add/new');
        }
        else{
            this.setState({
                active: true,
                barMessage: 'You must have a single category to add expense'
            });
        }

    }
    render() {

        let transactions = this.props.transactions;
        let data = transactions.map(function(transaction){
            return {
                leftIcon: transaction.type === "income" ? <Arrow primary right width='16px' height='16px' /> : <Arrow danger left width='16px' height='16px' />,
                date: moment(transaction.transactionAt).format("DD-MMM-YY"),
                category: (transaction.type === "income" ? (transaction.project && transaction.project.name || transaction.creditType || transaction.type) : (transaction.category && transaction.category.name || transaction.type)),
                amount: (<span>
        <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <FormattedNumber value={transaction.amount}/>  </span>),
                rightIcon: transaction.type === "income" ? <Arrow primary width='16px' height='16px' /> : <Arrow danger down width='16px' height='16px' />
            }
        });

        return (
            <Card className={transactionsTable.cardReport}>
                <div className={transactionsTable.titleBg}>
                    <Snackbar
                        action='Dismiss'
                        active={this.state.active}
                        label={this.state.barMessage}
                        timeout={2000}
                        onClick={this.handleBarClick.bind(this)}
                        onTimeout={this.handleBarTimeout.bind(this)}
                        type={this.state.barType}
                        />
                    <h3>Transactions</h3>
                    <div className={transactionsTable.rightButtons}>
                            <Button
                                onClick={this.addIncome.bind(this)}
                                className='header-buttons'
                                icon='add'
                                label="income"
                                name='Income'
                                flat />
                            <Button
                                onClick={this.addExpense.bind(this)}
                                className='header-buttons'
                                icon='add'
                                label="expense"
                                name='Expense'
                                flat />
                    </div>
                </div>
                <Table theme={transactionsTable} model={this.getTableModel()}
                       source={data}
                       onRowClick={this.selectItem.bind(this)}
                       selectable={false}
                       heading={true}
                />
            </Card>
        );
    }
}


TransactionsTable.propTypes = {
    transactions: PropTypes.array.isRequired
};

export default createContainer(() => {

    const local = LocalCollection.findOne({
        name: 'reports'
    });
    const transactionsHandle = Meteor.subscribe('transaction', {
        limit : local.limit,
        skip: local.skip,
        accounts: local.accounts,
        dateFilter: local.filter === 'all' ? '' : dateHelpers.filterByDate(local.filter, {
            dateFrom: local.dateFrom,
            dateTo: local.dateTo
        }),
        type: local.type,
        filterByCategory: local.type === 'expenses' ? local.categories : '',
        filterByProjects: local.type === 'incomes' ? local.projects : ''
    });

    const projects = Meteor.subscribe('projects.all');
    const categories = Meteor.subscribe('categories');

    const transactionsLoading = !transactionsHandle.ready();
    const transactionsExists = !transactionsLoading && !!transactions;

    const transactions = Transactions.find({}, {
        limit: local.limit,
        sort:{
            transactionAt: -1
        }
    }).fetch();

    const categoryExists = Categories.findOne({});
    const projectExists = Projects.findOne({});
    return {
        local,
        transactions,
        categoryExists,
        projectExists
    };
}, TransactionsTable);