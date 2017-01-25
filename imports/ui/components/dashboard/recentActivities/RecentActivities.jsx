import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Card, Table } from 'react-toolbox';
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
                    <Table selectable={false} heading={false} model={model} source={incomes} theme={tableTheme}/>
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
                icon: <img src={'http://www.clasesdeperiodismo.com/wp-content/uploads/2012/02/radiohead-in-rainbows.png'} width={'32'} height={'32'} alt='Logo-with-text' />,
                category: i.category.name || i.category,
                amount: userCurrencyHelpers.loggedUserCurrency() + currencyFormatHelpers.currencyStandardFormat(i.amount),
                iconLeft: <Arrow down danger width='16px' height='16px' />
            }
        });
        return (
            <div>
                <Card className='card' theme={theme}>
                    <h3>Recent Expenses</h3>
                    <Table selectable={false} heading={false} model={model} source={expenses} theme={tableRightTheme}/>
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
