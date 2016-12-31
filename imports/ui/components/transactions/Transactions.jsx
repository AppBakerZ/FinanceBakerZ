import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Button, Table, FontIcon, Autocomplete } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'

import { Expenses } from '../../../api/expences/expenses.js';
import { Incomes } from '../../../api/incomes/incomes.js';
import { Accounts } from '../../../api/accounts/accounts.js';

const RECORDS_PER_PAGE = 8;

let pageNumber = 1,
    query = new ReactiveVar({
        limit : RECORDS_PER_PAGE * pageNumber,
        accounts: []
    });


class TransactionPage extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.props.toggleSidebar(false);
    }

    /*************** Filter by accounts ***************/
    accounts(){
        let accounts = {};
        this.props.accounts.forEach((account) => {
            accounts[account._id] = account.name;
        });
        return accounts;
    }


    filterByAccounts(value, e) {
        this.setState({multiple: value});
        let copyQuery = query.get();
        copyQuery['accounts'] = value;
        query.set(copyQuery);
    }


    /*************** Infinite scroll ***************/
    handleScroll(event) {
        let infiniteState = event.nativeEvent;
        if((infiniteState.srcElement.scrollTop + infiniteState.srcElement.offsetHeight) > (infiniteState.srcElement.scrollHeight -1)){
            let copyQuery = query.get();
            pageNumber = pageNumber + 1;
            copyQuery.limit  = RECORDS_PER_PAGE * pageNumber;
            query.set(copyQuery);
        }
    }

    /*************** table template ***************/
    renderProjectTable() {
        let transactions = this.props.transactions;
        let data = transactions.map(function(transaction){
            return {
                type: transaction.receivedAt ? <FontIcon className='forward-icon' value='forward' /> : <FontIcon className='backward-icon' value='forward' />,
                date: moment(transaction.receivedAt || transaction.spentAt).format("DD-MMM-YY"),
                category: transaction.receivedAt ? (transaction.project ? (transaction.project.name || transaction.project) : transaction.type) : (transaction.category.name || transaction.category),
                amount: 'Rs. ' + transaction.amount
            }
        });
        let tableModel = {
            type: {type: String},
            date: {type: Date},
            category:{type: String},
            amount: {type: String}
        };
        return ( <Table
                model={tableModel}
                source={data}
                selectable={false}
                heading={false}
                />
        )
    }

    /*************** template render ***************/
    render() {
        return (
            <div className="projects" onScroll={this.handleScroll}>
                <div className="container">
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <Autocomplete
                            className='dashboard-autocomplete'
                            direction='down'
                            name='multiple'
                            onChange={this.filterByAccounts.bind(this)}
                            label='Filter By Account'
                            source={this.accounts()}
                            value={this.state.multiple}
                            />
                    </div>
                    <div className="page-title">
                        <h3>Transactions</h3>
                        <div>
                            <Button className='header-buttons' icon='add' label='INCOME' flat />
                            <Button className='header-buttons' icon='add' label='EXPENSE' flat />
                        </div>
                    </div>
                    {this.renderProjectTable()}
                </div>
            </div>

        );
    }
}

TransactionPage.propTypes = {
    transactions: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('transactions', query.get());
    Meteor.subscribe('accounts');
    let expenses = Expenses.find().fetch(),
    incomes = Incomes.find().fetch();
    return {
        transactions: _.sortBy(incomes.concat(expenses), function(transaction){return transaction.receivedAt || transaction.spentAt }).reverse(),
        accounts: Accounts.find({}).fetch()
    };
}, TransactionPage);