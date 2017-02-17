import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Card, Table, Button } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Incomes } from '/imports/api/incomes/incomes.js';
import { Expenses } from '/imports/api/expences/expenses.js';

import { currencyFormatHelpers, userCurrencyHelpers } from '/imports/helpers/currencyHelpers.js'

import Loader from '/imports/ui/components/loader/Loader.jsx';
import Arrow from '/imports/ui/components/arrow/Arrow.jsx';

import theme from './theme';
import tableTheme from './tableTheme';
import tableRightTheme from './tableRightTheme';

class RecentActivities extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    renderRecents(){
        return (
            <div className='dashboard-card-group'>
                <div className={theme.recentIncomeWrapper}>
                    {this.renderRecentIncomes()}
                </div>

                <div className={theme.recentExpensesWrapper}>
                    {this.renderRecentExpenses()}
                </div>
            </div>
        )
    }
    renderRecentIncomes(){
        const model = {
            icon: {type: String},
            type: {type: String},
            amount: {type: String},
            iconLast: {type: String}
        };
        let incomes = this.props.incomes.map(function(i){
            return {
                icon: <Arrow primary width='16px' height='16px' />,
                type: i.type == "project" ? i.project.name || i.project : i.type,
                amount: userCurrencyHelpers.loggedUserCurrency() + currencyFormatHelpers.currencyStandardFormat(i.amount),
                iconLast: <Arrow primary width='16px' height='16px' />
            }
        });
        return (
            <div>
                <Card className='card' theme={theme}>
                    <h3>Recent Incomes</h3>
                    {this.props.incomes.length ? <Table selectable={false} heading={false} model={model} source={incomes} theme={tableTheme}/> : <Loader primary />}
                    <div className={theme.errorShowIncomes}>
                        <Button type='button' icon='add' raised primary />
                        <p>add something to show</p>
                    </div>
                </Card>
                <div className={theme.tableLink}>
                    <Link to={`/app/transactions/incomes`}> View All </Link>
                </div>
            </div>
        )
    }
    renderRecentExpenses(){
        const model = {
            icon: {type: String},
            category: {type: String},
            amount: {type: String},
            iconLeft: {type: String}
        };
        let expenses = this.props.expenses.map(function(i){
            return {
                icon:  <i className={i.category.icon || ''}/> ,
                category: i.category.name || i.category,
                amount: userCurrencyHelpers.loggedUserCurrency() + currencyFormatHelpers.currencyStandardFormat(i.amount),
                iconLeft: <Arrow down danger width='16px' height='16px' />
            }
        });
        console.log('this.props.expenses', this.props.expenses);
        return (
            <div>
                <Card className='card' theme={theme}>
                    <h3>Recent Expenses</h3>
                    {this.props.expenses.length ? <Table selectable={false} heading={false} model={model} source={expenses} theme={tableRightTheme}/> : <Loader accent />}
                    <div className={theme.errorShowExpenses}>
                        <Button type='button' icon='add' raised accent />
                        <p>add something to show</p>
                    </div>
                </Card>
                <div className={theme.tableLink}>
                    <Link to={`/app/transactions/expenses`}> View All </Link>
                </div>
            </div>
        )
    }
    render() {
        return this.renderRecents();
    }
}

RecentActivities.propTypes = {
    incomes: PropTypes.array.isRequired,
    expenses: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('incomes', 5);
    Meteor.subscribe('expenses', 5);

    return {
        incomes: Incomes.find({}, {fields: {amount: 1, type: 1, project: 1}}).fetch(),
        expenses: Expenses.find({}, {fields: {amount: 1, 'category': 1}}).fetch()
    };
}, RecentActivities);
