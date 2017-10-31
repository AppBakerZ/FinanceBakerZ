import React, { Component } from 'react';
import PropTypes from 'prop-types'

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Card } from 'react-toolbox/lib/card';
import {Button, IconButton} from 'react-toolbox/lib/button';

import moment from 'moment';
import { Table, Snackbar } from 'react-toolbox';
import {defineMessages, FormattedMessage, intlShape, injectIntl, FormattedNumber} from 'react-intl';

import Arrow from '/imports/ui/components/arrow/Arrow.jsx';
import transactionsTable from './transactionsTable';
import NothingFound from '../utilityComponents/NothingFound.jsx'
import RecordsNotExists from '../utilityComponents/RecordsNotExists.jsx'

import { routeHelpers } from '../../../helpers/routeHelpers.js'
import { AppConfig } from "/imports/utils/config";

import { Transactions } from '../../../api/transactions/transactions';

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
    },
    ADD_INCOME: {
        id: 'TRANSACTIONS.ADD_INCOME'
    },
    ADD_EXPENSE: {
        id: 'TRANSACTIONS.ADD_EXPENSE'
    },
    TRANSACTIONS:{
            id: 'TRANSACTIONS.TITLE'
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
        AppConfig.setPreviousRoute(location.href);
        routeHelpers.changeRoute(`/app/transactions/${selectedTransaction.type}/${selectedTransaction._id}`);
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
        AppConfig.setPreviousRoute(location.href);
        routeHelpers.changeRoute('/app/transactions/income/add/new');
    }
    addExpense(){
        AppConfig.setPreviousRoute(location.href);
        routeHelpers.changeRoute('/app/transactions/expense/add/new');
    }
    render() {
        const { formatMessage } = this.props.intl;
        let { transactions, transactionsTotal } = this.props;
        let data = transactions.map(function(transaction){
            return {
                leftIcon: transaction.type === "income" ? <Arrow primary right width='16px' height='16px' /> : <Arrow danger left width='16px' height='16px' />,
                date: moment(transaction.transactionAt).format("DD-MMM-YY"),
                category: (transaction.type === "income" ? (transaction.project && transaction.project.name || transaction.creditType || transaction.type) : (transaction.category && transaction.category.name || transaction.type)),
                amount: (<span>
        <i className={userCurrencyHelpers.loggedUserCurrency()} /> <FormattedNumber value={transaction.amount}/>  </span>),
                rightIcon: transaction.type === "income" ? <Arrow primary width='16px' height='16px' /> : <Arrow danger down width='16px' height='16px' />
            }
        });
        const table = <Table theme={transactionsTable} model={this.getTableModel()}
                             source={data}
                             onRowClick={this.selectItem.bind(this)}
                             selectable={false}
                             heading={true}
                        />;

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
                    <h3>{formatMessage(il8n.TRANSACTIONS)}</h3>
                    <div className={transactionsTable.rightButtons}>
                            <Button
                                onClick={this.addIncome.bind(this)}
                                className='header-buttons'
                                icon='add'
                                label= {formatMessage(il8n.ADD_INCOME)}
                                name='Income'
                                flat />
                            <Button
                                onClick={this.addExpense.bind(this)}
                                className='header-buttons'
                                icon='add'
                                label={formatMessage(il8n.ADD_EXPENSE)}
                                name='Expense'
                                flat />
                    </div>
                </div>
                <div className={transactionsTable.tableParent}>
                    { transactions.length ? table : transactionsTotal.length ? <NothingFound route="/app/transactions/income/add/new"/>: <RecordsNotExists route="app/transactions/income/add/new"/>}
                </div>
            </Card>
        );
    }
}


TransactionsTable.propTypes = {
    transactions: PropTypes.array.isRequired,
    intl: intlShape.isRequired
};

TransactionsTable =  createContainer((props) => {
    const local = LocalCollection.findOne({
        name: props.collection
    });
    const { location } = props.parentProps;

    /*
     all below function is to get categories if child categories flag true
     include all child categories but display only parent category in suggession box
     */
    let query = location.query, combinedCategories = local.categories;
    if(local.categories.length && query.childrenIncluded === 'true'){
        const allCategories = props.parentProps.categories;
        let childCategories = allCategories.filter(child => {
            return child.parent && child.parent.id === local.categories[0]
        });
        if(childCategories.length){
            childCategories = childCategories.map(cat => {
                return cat._id
            });
            combinedCategories = _.union(local.categories, childCategories)
        }
    }
    const transactionsHandle = Meteor.subscribe('transaction', {
        limit : local.limit,
        skip: local.skip,
        accounts: local.accounts,
        dateFilter: local.filter === 'all' ? '' : dateHelpers.filterByDate(local.filter, {
            dateFrom: local.dateFrom,
            dateTo: local.dateTo
        }),
        type: local.type,
        filterByCategory: local.type === 'expenses' ? combinedCategories : '',
        filterByProjects: local.type === 'incomes' ? local.projects : ''
    });

    const projects = Meteor.subscribe('projects.all');
    const transaction = Meteor.subscribe('transactions');
    let transactionsFind = Transactions.find().fetch();
    const categories = Meteor.subscribe('categories');
    const projectExists = Counter.get('projectExists');
    const categoryExists = Counter.get('categoriesExists');
    const transactionsTotal = Counter.get('transactionsTotal');

    const transactionsLoading = !transactionsHandle.ready();
    const transactionsExists = !transactionsLoading && !!transactions;

    const transactions = Transactions.find({}, {
        limit: local.limit,
        sort:{
            transactionAt: -1
        }
    }).fetch();

    // const categoryExists = Categories.findOne({});
    // const projectExists = Projects.findOne({});
    return {
        transactionsFind,
        categories,
        categoryExists,
        projects,
        projectExists,
        local,
        transactions,
        transactionsTotal,


    };
}, TransactionsTable);
export default injectIntl(TransactionsTable);