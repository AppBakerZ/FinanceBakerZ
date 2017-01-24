import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Card, CardTitle, Button, DatePicker, FontIcon, Autocomplete, Dropdown, Table, Fonticon } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';
import { Incomes } from '../../../api/incomes/incomes.js';
import { Expenses } from '../../../api/expences/expenses.js';
import { dateHelpers } from '../../../helpers/dateHelpers.js'
import { currencyFormatHelpers, userCurrencyHelpers } from '../../../helpers/currencyHelpers.js'

import Graph from './Graph.jsx';
import Loader from '../loader/Loader.jsx';
import Arrow from '../arrow/Arrow.jsx';

import theme from './theme';
import autocompleteTheme from './autocompleteTheme';
import cardTheme from './cardTheme';
import datePickerTheme from './datePickerTheme';
import dropdownTheme from './dropdownTheme';
import cardBackgroundTheme from './cardBackgroundTheme';

class DashboardPage extends Component {

    constructor(props) {
        super(props);

        let datetime = new Date();

        this.state = {
            totalIncomes: null,
            totalExpenses: null,
            availableBalance: null,
            multiple: [],
            filterBy: 'month',
            dateFrom: datetime,
            dateTo: datetime
        };
    }

    componentDidMount(){
        this.setDefaultAccounts(this.props);
    }

    setDefaultAccounts (props){
        let multiple = [];
        props.accounts.forEach((account) => {
            multiple.push(account._id);
        });
        this.setState({multiple});
        this.updateByAccount(multiple)
    }

    updateByAccount(accounts){
        this.getAvailableBalance(accounts);
        this.getTotalIncomesAndExpenses(accounts);
    }

    getAvailableBalance (accounts){
        Meteor.call('statistics.availableBalance', {accounts}, (err, ab) => {
            if(ab){
                this.setState({
                    availableBalance: ab
                })
            }else{
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
        });
    }

    getTotalIncomesAndExpenses (accounts, filterBy, range){
        let date = dateHelpers.filterByDate(filterBy || this.state.filterBy, range || {}, this);
        this.setState({
            totalIncomes: null,
            totalExpenses: null
        });
        Meteor.call('statistics.totalIncomesAndExpenses', {accounts, date}, (err, totals) => {
            if(totals){
                this.setState({
                    totalIncomes: totals.incomes,
                    totalExpenses: totals.expenses
                })
            }else{
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
        });
    }

    handleMultipleChange (value) {
        console.log('handleMultipleChange ', value)
        this.setState({multiple: value});
        this.updateByAccount(value)
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

    onChange (val, e) {
        this.setState({[e.target.name]: val});
        this.getTotalIncomesAndExpenses(this.state.multiple, e.target.name == 'filterBy' ? val : null, {[e.target.name]: val});
    }

    accounts(){
        let accounts = {};
        this.props.accounts.forEach((account) => {
            accounts[account._id] = account.name;
        });
        return accounts;
    }

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

    generatePdf(report){

        let params = {
            multiple : this.state.multiple,
            filterBy : this.state.filterBy,
            date : dateHelpers.filterByDate(this.state.filterBy, {}, this),
            report : report
        };

        Meteor.call('statistics.generateReport', {params } , function(err, res){
            if (err) {
                console.error(err);
            } else if (res) {
                window.open("data:application/pdf;base64, " + res);
            }
        })
    }

    renderDateRange(){
        let dropDowns = (
            <div className={theme.dashboardDropdown}>
                <DatePicker className='demo' theme={datePickerTheme}
                    label='Date From'
                    name='dateFrom'
                    onChange={this.onChange.bind(this)}
                    value={this.state.dateFrom}
                    />

                <DatePicker theme={datePickerTheme}
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
    renderRecents(){
        return (
            <div className='dashboard-card-group'>
                <div className="recent-incomes-wrapper margin-right">
                    {this.renderRecentIncomes()}
                </div>

                <div className="recent-expenses-wrapper margin-left">
                    {this.renderRecentExpenses()}
                </div>
            </div>
        )
    }
    renderRecentIncomes(){
        const model = {
            icon: {type: String},
            type: {type: String},
            amount: {type: String}
        };
        let incomes = this.props.incomes.map(function(i){
            return {
                icon: <img src={'http://www.clasesdeperiodismo.com/wp-content/uploads/2012/02/radiohead-in-rainbows.png'} width={'32'} height={'32'} alt='Logo-with-text' />,
                type: i.type == "project" ? i.project.name || i.project : i.type,
                amount: userCurrencyHelpers.loggedUserCurrency() + currencyFormatHelpers.currencyStandardFormat(i.amount)
            }
        });
        return (
            <Card className='card'>
                <h3>Recent Incomes</h3>
                <Table selectable={false} heading={false} model={model} source={incomes}/>
                <Link
                    to={`/app/transactions/incomes`}>
                    View All
                </Link>            
            </Card>
        )
    }
    renderRecentExpenses(){
        const model = {
            icon: {type: String},
            category: {type: String},
            amount: {type: String}
        };
        let expenses = this.props.expenses.map(function(i){
            return {
                icon: <img src={'http://www.clasesdeperiodismo.com/wp-content/uploads/2012/02/radiohead-in-rainbows.png'} width={'32'} height={'32'} alt='Logo-with-text' />,
                category: i.category.name || i.category,
                amount: userCurrencyHelpers.loggedUserCurrency() + currencyFormatHelpers.currencyStandardFormat(i.amount)
            }
        });
        return (
            <Card className='card'>
                <h3>Recent Expenses</h3>
                <Table selectable={false} heading={false} model={model} source={expenses}/>
                <Link
                    to={`/app/transactions/expenses`}>
                    View All
                </Link>
            </Card>
        )
    }
    renderTotalIncomes(){
        return (
            <div className={theme.incomeBox}>
                <div>Your Total Incomes are</div>
                <h2>
                    {userCurrencyHelpers.loggedUserCurrency() + currencyFormatHelpers.currencyStandardFormat(this.state.totalIncomes)}
                    <Arrow primary />
                </h2>
                {(!this.state.totalIncomes ||
                    <div className={theme.reportBtn} onClick={this.generatePdf.bind(this, 'incomes')}>
                        <Button icon='description' label='Income Report' flat />
                    </div>
                )}
            </div>
        )
    }
    renderTotalExpenses(){
        return (
            <div className={theme.expensesBox}>
                <div>Your Total Expenses are</div>
                <h2>
                    {userCurrencyHelpers.loggedUserCurrency() + currencyFormatHelpers.currencyStandardFormat(this.state.totalExpenses)}
                    <Arrow down danger/>
                </h2>
                {(!this.state.totalExpenses ||
                    <div className={theme.reportBtn} onClick={this.generatePdf.bind(this, 'expenses')}>
                        <Button icon='description' label='Expences Report' flat />
                    </div>
                )}
            </div>
        )
    }
    availableBalance(){
        return (
            <div>
                <Card theme={cardBackgroundTheme}>
                    <div style={{margin: "0 auto"}}>
                        <div className={theme.availableTitle}> Your Available Balance is</div>
                        <h2 className="available-amount">
                            {userCurrencyHelpers.loggedUserCurrency() + currencyFormatHelpers.currencyStandardFormat(this.state.availableBalance)}
                            <Arrow />
                        </h2>
                    </div>
                </Card>
            </div>
        )
    }
    render() {
        return (
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', padding: '1%'}}>
                    <div className={theme.dashboardSection}>
                        <Card className={theme.cardBox}>
                            <div className='dashboard-card-group'>
                                <Card theme={cardTheme}>
                                    <Autocomplete theme={autocompleteTheme}
                                        direction='down'
                                        name='multiple'
                                        onChange={this.handleMultipleChange.bind(this)}
                                        label='Filter By Account'
                                        source={this.accounts()}
                                        value={this.state.multiple}
                                        />

                                    <Dropdown theme={dropdownTheme}
                                        auto={false}
                                        source={this.filters()}
                                        name='filterBy'
                                        onChange={this.onChange.bind(this)}
                                        label='Filter By'
                                        value={this.state.filterBy}
                                        template={this.filterItem}
                                        required
                                        />
                                        {this.renderDateRange()}
                                </Card>
                                <Card theme={theme}>
                                    {this.state.totalIncomes != null ? this.renderTotalIncomes() : <Loader primary />}
                                </Card>
                                <Card theme={theme}>
                                    {this.state.totalExpenses != null ? this.renderTotalExpenses() : <Loader danger />}
                                </Card>
                            </div>
                        </Card>
                    </div>
                    <div className={theme.bg}>
                        <div className={theme.availableSection}>
                            <Card className="card-box">
                                {this.state.availableBalance != null ? this.availableBalance() : <Loader />}
                            </Card>
                        </div>

                        <div className="recent-activities-wrapper">
                            {this.renderRecents()}
                        </div>
                        <div className="income-overview-wrapper">
                            <Graph />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DashboardPage.propTypes = {
    accounts: PropTypes.array.isRequired,
    incomes: PropTypes.array.isRequired,
    expenses: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('accounts');
    Meteor.subscribe('incomes', 5);
    Meteor.subscribe('expenses', 5);

    return {
        accounts: Accounts.find({}).fetch(),
        incomes: Incomes.find({}, {fields: {amount: 1, type: 1, project: 1}}).fetch(),
        expenses: Expenses.find({}, {fields: {amount: 1, 'category': 1}}).fetch()
    };
}, DashboardPage);
