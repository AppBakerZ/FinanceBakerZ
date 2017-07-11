import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Card } from 'react-toolbox/lib/card';
import {Button, IconButton} from 'react-toolbox/lib/button';

import moment from 'moment';
import { Table } from 'react-toolbox';
import {defineMessages, FormattedMessage, FormattedNumber} from 'react-intl';

import Arrow from '/imports/ui/components/arrow/Arrow.jsx';
import transactionsTable from './transactionsTable';

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
    }
});

class TransactionsTable extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }
    selectItem(index){
        let selectedProject =  this.props.transactions[index] ;
        console.log('selectedProject', selectedProject)
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
    render() {

        let transactions = this.props.transactions;
        let data = transactions.map(function(transaction){
            //didn't find why directly nested key not work in template ?? :(
            let { project, category } = transaction;
            let ProjectOrCategory = project || category;
            return {
                leftIcon: transaction.type === "income" ? <Arrow primary right width='16px' height='16px' /> : <Arrow danger left width='16px' height='16px' />,
                date: moment(transaction.transactionAt).format("DD-MMM-YY"),
                // project or category name
                category: ProjectOrCategory.name,
                amount: (<span>
        <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <FormattedNumber value={transaction.amount}/>  </span>),
                rightIcon: transaction.type === "income" ? <Arrow primary width='16px' height='16px' /> : <Arrow danger down width='16px' height='16px' />
            }
        });

        return (
            <Card className={transactionsTable.cardReport}>
                <div className={transactionsTable.titleBg}>
                    <h3>Transactions</h3>
                    <div className={transactionsTable.rightButtons}>
                        <Link to="app/transactions/incomes/new">
                            <Button
                                className='header-buttons'
                                icon='add'
                                label="income"
                                name='Income'
                                flat />
                        </Link>
                        <Link to="app/transactions/expenses/new">
                            <Button
                                className='header-buttons'
                                icon='add'
                                label="expense"
                                name='Expense'
                                flat />
                        </Link>


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
        dateFilter: dateHelpers.filterByDate(local.filter, {
            dateFrom: local.dateFrom,
            dateTo: local.dateTo
        }),
        type: local.type,
        filterByCategory: local.type === 'expenses' ? local.categories : '',
        filterByProjects: local.type === 'incomes' ? local.projects : ''
    });

    const transactionsLoading = !transactionsHandle.ready();
    const transactionsExists = !transactionsLoading && !!transactions;

    const transactions = Transactions.find({}, {
        limit: local.limit,
        sort:{
            transactionAt: -1
        }
    }).fetch();

    return {
        local,
        transactions
    };
}, TransactionsTable);