import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Button, Table, FontIcon, Autocomplete, Dropdown } from 'react-toolbox';
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
        this.state = {
            filterBy: ''
        };
        this.months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
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

    /*************** Filter by dates ***************/
    filters(){
        return [
            {
                name: 'Today',
                value: 'day'
            },
            {
                name: 'This Week',
                value: 'week'
            },
            {
                name: 'This Month',
                value: 'month'
            },
            {
                name: 'Last Month',
                value: 'months'
            },
            {
                name: 'This Year',
                value: 'year'
            },
            {
                name: 'Date Range',
                value: 'range'
            }
        ];
    }


    filterItem (account) {
        const containerStyle = {
            display: 'flex',
            flexDirection: 'row'
        };

        const contentStyle = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 2
        };

        return (
            <div style={containerStyle}>
                <div style={contentStyle}>
                    <strong>{account.name}</strong>
                </div>
            </div>
        );
    }

    filterByDate(filter, range){
        let date = {};
        if(filter == 'months'){
            date.start = moment().subtract(1, 'months').startOf('month').format();
            date.end = moment().subtract(1, 'months').endOf('month').format();
        }
        else if(filter == 'range'){
            date.start = moment(range.dateFrom || this.state.dateFrom).startOf('day').format();
            date.end = moment(range.dateTo || this.state.dateTo).endOf('day').format();
        }
        else{
            date.start = moment().startOf(filter).format();
            date.end = moment().endOf(filter).format();
        }
        return date
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
        if( e.target.name == 'filterBy'){
            let copyQuery = query.get();
            copyQuery['dateFilter'] = this.filterByDate(val, null);
            query.set(copyQuery);
        }
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
                    <div className='flex'>
                        <Dropdown
                            className='dashboard-dropdown'
                            auto={false}
                            source={this.filters()}
                            name='filterBy'
                            onChange={this.onChange.bind(this)}
                            label='Filter By'
                            value={this.state.filterBy}
                            template={this.filterItem}
                            required
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