import React, { Component, PropTypes } from 'react';

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import moment from 'moment';
import { Table } from 'react-toolbox';
import {defineMessages, FormattedMessage, FormattedNumber} from 'react-intl';

import Arrow from '/imports/ui/components/arrow/Arrow.jsx';

import { Expenses } from '../../../api/expences/expenses.js';
import { Incomes } from '../../../api/incomes/incomes.js';

import { userCurrencyHelpers } from '../../../helpers/currencyHelpers.js'

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
            return {
                leftIcon: transaction.receivedAt ? <Arrow primary right width='16px' height='16px' /> : <Arrow danger left width='16px' height='16px' />,
                date: moment(transaction.receivedAt || transaction.spentAt).format("DD-MMM-YY"),
                category: transaction.receivedAt ?
                    (transaction.type == "project" ?
                        (transaction.project && transaction.project.name || transaction.project) : transaction.type) :
                    (transaction.category.name || transaction.category),
                amount: (<span>
        <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <FormattedNumber value={transaction.amount}/>  </span>),
                rightIcon: transaction.receivedAt ? <Arrow primary width='16px' height='16px' /> : <Arrow danger down width='16px' height='16px' />
            }
        });

        return (
            <Table model={this.getTableModel()}
                   source={data}
                   onRowClick={this.selectItem.bind(this)}
                   selectable={false}
                   heading={true}
            />
        );
    }
}


TransactionsTable.propTypes = {
    transactions: PropTypes.array.isRequired
};

export default createContainer(() => {

    const transactionsHandle = Meteor.subscribe('transactions', {
        limit : 10,
        accounts: [],
        dateFilter: '',
        type: ''
    });

    const transactionsLoading = !transactionsHandle.ready();
    const transactionsExists = !transactionsLoading && !!transactions;

    const expenses = Expenses.find().fetch();
    const incomes = Incomes.find().fetch();

    const transactions = _.sortBy(incomes.concat(expenses), function(transaction){
        return transaction.receivedAt || transaction.spentAt
    }).reverse();

    return {
        local: LocalCollection.findOne({
            name: 'reports'
        }),
        transactions
    };
}, TransactionsTable);