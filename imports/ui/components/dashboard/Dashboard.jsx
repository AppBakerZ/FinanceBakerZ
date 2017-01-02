import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Card, CardTitle, Button, DatePicker, FontIcon, Autocomplete, Dropdown, Table } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';
import { Incomes } from '../../../api/incomes/incomes.js';
import { Expenses } from '../../../api/expences/expenses.js';
import { dateHelpers } from '../../../helpers/dateHelpers.js'

import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

class DashboardPage extends Component {

    constructor(props) {
        super(props);

        let datetime = new Date();

        this.state = {
            index: 0,
            totalIncomes: 0,
            totalExpenses: 0,
            availableBalance: 0,
            multiple: [],
            filterBy: 'month',
            dateFrom: datetime,
            dateTo: datetime,
            graph: null
        };

        this.months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
    }

    formatNumber(num){
        return new Intl.NumberFormat().format(num);
    }

    toggleSidebar(event){
        this.props.toggleSidebar(false);
    }


    componentWillReceiveProps (p){
        this.setDefaultAccounts(p);
    }

    componentWillMount(){
        this.toggleSidebar();
        this.setDefaultAccounts(this.props);
        this.getGraphData()
    }

    getGraphData(){
        Meteor.call('statistics.incomesGroupByMonth', {}, (error, res) => {
            if(!error){
                this.setState({graph: res})
            }
        })
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

    renderAreaChart(){
        let chart = (
            <div className="area-chart">
                <ResponsiveContainer>
                    <AreaChart data={this.state.graph}
                               margin={{top: 10, right: 0, left: 40, bottom: 0}}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#008148" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#008148" stopOpacity={0.2}/>
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#e0b255" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#e0b255" stopOpacity={0.2}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="_id" tickFormatter={(tick) => {
                        return `${this.months[tick - 1]}`;
                        }}/>
                        <YAxis tickFormatter={(tick) => {
                        return `Rs${tick}K`;
                        }}/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Area type='monotone' dataKey='income' stroke="#008148" fill="url(#colorIncome)" fillOpacity={1} />
                        <Area type='monotone' dataKey='expense' stroke='#e0b255' fill="url(#colorExpense)" fillOpacity={1} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
        return this.state.graph ? chart : null
    }
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
    renderRecents(){
        return (
            <div className='recents'>{this.renderRecentIncomes()}
                {this.renderRecentExpenses()}</div>
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
                amount: 'Rs. ' + i.amount
            }
        });
        return (
            <div>
                <h3>Recent Incomes</h3>
                <Table selectable={false} heading={false} model={model} source={incomes}/>
                <a href='#'>View All</a>
            </div>
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
                amount: 'Rs. ' + i.amount
            }
        });
        return (
            <div>
                <h3>Recent Expenses</h3>
                <Table selectable={false} heading={false} model={model} source={expenses}/>
                <a href='#'>View All</a>
            </div>
        )
    }
    render() {
        return (
            <div style={{ flex: 1, padding: '0 1.8rem 1.8rem 0', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Autocomplete
                        className='dashboard-autocomplete'
                        direction='down'
                        name='multiple'
                        onChange={this.handleMultipleChange.bind(this)}
                        label='Filter By Account'
                        source={this.accounts()}
                        value={this.state.multiple}
                        />
                    <Card className='dashboard-card'>
                        <CardTitle
                            title={'' + this.formatNumber(this.state.availableBalance)}
                            subtitle='Available Balance'
                            />
                    </Card>
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

                    {this.renderDateRange()}

                    <div className='dashboard-card-group'>
                        <Card className='card'>
                            <CardTitle
                                title={'' + this.formatNumber(this.state.totalIncomes)}
                                subtitle='Total Incomes'
                                />
                        </Card>
                        <Card className='card'>
                            <CardTitle
                                title={'' + this.formatNumber(this.state.totalExpenses)}
                                subtitle='Total Expenses'
                                />
                        </Card>
                        <Card className='card'>
                            <CardTitle
                                title={'' + this.formatNumber(this.state.totalIncomes  - this.state.totalExpenses)}
                                subtitle='Remaining Amount'
                                />
                        </Card>
                    </div>
                    <div className='pdf-generator'>
                        {(!this.state.totalIncomes ||
                            <div className='report-btn' onClick={this.generatePdf.bind(this, 'incomes')}>
                                <Button icon='add' label='Income Report' raised primary />
                            </div>
                        )}
                        {(!this.state.totalExpenses ||
                            <div className='report-btn' onClick={this.generatePdf.bind(this, 'expenses')}>
                                <Button icon='add' label='Expences Report' raised primary />
                            </div>
                        )}
                    </div>

                    {this.renderRecents()}
                    {this.renderAreaChart()}

                </div>
            </div>
        );
    }
}

DashboardPage.propTypes = {
    accounts: PropTypes.array.isRequired
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
