import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Button, Table, FontIcon, Autocomplete, Dropdown, DatePicker, Dialog, Input, ProgressBar } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'

import { Expenses } from '../../../api/expences/expenses.js';
import { Incomes } from '../../../api/incomes/incomes.js';
import { Accounts } from '../../../api/accounts/accounts.js';
import { dateHelpers } from '../../../helpers/dateHelpers.js'
import IncomesSideBar from '../incomes/IncomesSideBar.jsx'
import ExpensesSideBar from '../expenses/ExpensesSideBar.jsx'

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
            filterBy: '',
            type: this.props.routes[2] ? this.props.routes[2].path : '',
            openDialog: false
        };
        this.months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        if(this.props.routes[2]){
            let copyQuery = query.get();
            copyQuery['type'] = this.props.routes[2].path;
            copyQuery['dateFilters'] = '';
            query.set(copyQuery);
        }
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

    /*************** Filter by type ***************/
    type(){
        return [
            {
                name: 'Both',
                value: ''
            },
            {
                name: 'Incomes',
                value: 'incomes'
            },
            {
                name: 'Expenses',
                value: 'expenses'
            }
        ];
    }


    /*************** Filter by dates ***************/
    filters(){
        return [
            {
                name: 'All',
                value: ''
            },
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

    /*************** add/edit incomes popup ***************/
    openedPopup (showForm, e) {
        this.setState({showForm, model: e.target.name, openDialog: true, deleteConfirmMessage: false});
    }

    closePopup () {
        this.setState({openDialog:false, updateForm : false});
    }

    popupTemplate(){
        return(
            <Dialog
                className='dialog-box tiny-scroll'
                active={this.state.openDialog}
                onEscKeyDown={this.closePopup.bind(this)}
                onOverlayClick={this.closePopup.bind(this)}
                >
                <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />
                {this.templateRender()}
            </Dialog>
        )
    }

    progressBarToggle (){
        return  this.state.loading ? 'progress-bar' : 'progress-bar hide';
    }

    templateRender(){
        return this.state.showForm ? this.renderAddForm() : '';
    }

    /*************** form template ***************/
    renderAddForm(){
        let {updateForm, model} = this.state;

        return(
            <div>
                <h4>{'Add New ' + model}</h4>
                {model == 'Income' ?
                    <IncomesSideBar params="" isNewRoute={!updateForm}/> :
                    <ExpensesSideBar params="" isNewRoute={!updateForm}/>}
            </div>
        )
    }


    /*************** on dropdown options change ***************/
    onChange (val, e) {
        this.setState({[e.target.name]: val});
        let copyQuery = query.get();
        if(['filterBy', 'dateFrom', 'dateTo'].includes(e.target.name)){
            copyQuery['dateFilter'] = val ? dateHelpers.filterByDate(e.target.name == "filterBy" ? val : this.state.filterBy, {[e.target.name]: val}, this) : '';
            query.set(copyQuery);
        }
        else if(e.target.name == "type"){
            copyQuery['type'] = val;
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

    /*************** table DateRange ***************/

    renderDateRange(){
        let dropDowns = (
            <div className='dashboard-dropdown'>
                <DatePicker
                    label='Date From'
                    name='dateFrom'
                    onChange={this.onChange.bind(this)}
                    value={this.state.dateFrom}
                    />

                <DatePicker
                    label='Date To'
                    name='dateTo'
                    onChange={this.onChange.bind(this)}
                    value={this.state.dateTo}
                    />
            </div>
        );
        return (
            this.state.filterBy == 'range' ?  dropDowns : null
        )
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
                    <div className='flex'>
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
                            source={this.type()}
                            name='type'
                            onChange={this.onChange.bind(this)}
                            label='Filter By Type'
                            value={this.state.type}
                            template={this.filterItem}
                            />
                        <Dropdown
                            className='dashboard-dropdown'
                            auto={false}
                            source={this.filters()}
                            name='filterBy'
                            onChange={this.onChange.bind(this)}
                            label='Filter By'
                            value={this.state.filterBy}
                            template={this.filterItem}
                            />
                        {this.renderDateRange()}
                    </div>
                    <div className="page-title">
                        <h3>Transactions</h3>
                        <div>
                            <Button
                                className='header-buttons'
                                icon='add'
                                label='INCOME'
                                name='Income'
                                onClick={this.openedPopup.bind(this, true)}
                                flat />
                            <Button
                                className='header-buttons'
                                icon='add'
                                label='EXPENSE'
                                name='Expense'
                                onClick={this.openedPopup.bind(this, true)}
                                flat />
                            {this.popupTemplate()}
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