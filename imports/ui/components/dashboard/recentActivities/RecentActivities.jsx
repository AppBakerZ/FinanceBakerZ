import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Card, Table, Button } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Incomes } from '/imports/api/incomes/incomes.js';
import { Expenses } from '/imports/api/expences/expenses.js';

import { userCurrencyHelpers } from '/imports/helpers/currencyHelpers.js'

import Loader from '/imports/ui/components/loader/Loader.jsx';
import Arrow from '/imports/ui/components/arrow/Arrow.jsx';
import {FormattedMessage, FormattedNumber, defineMessages} from 'react-intl';
import theme from './theme';
import tableTheme from './tableTheme';
import tableRightTheme from './tableRightTheme';

const il8n = defineMessages({
    RECENT_INCOMES: {
        id: 'DASHBOARD.RECENT_INCOMES'
    },
    RECENT_EXPENSES: {
        id: 'DASHBOARD.RECENT_EXPENSES'
    },
    ADD_SOME_EXPENSES: {
        id: 'DASHBOARD.ADD_SOME_EXPENSES'
    },
    ADD_SOME_INCOMES: {
        id: 'DASHBOARD.ADD_SOME_INCOMES'
    },
    VIEW_ALL_INCOMES: {
        id: 'DASHBOARD.VIEW_ALL_INCOMES'
    },
    VIEW_ALL_EXPENSES: {
        id: 'DASHBOARD.VIEW_ALL_EXPENSES'
    }
});


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
    getIncomesOrAdd(){
        const model = {
            icon: {type: String},
            projects: {type: String},
            amount: {type: String},
            iconLast: {type: String}
        };
        let incomes = this.props.incomes.map(function(i){
            return {
                icon: <Arrow primary width='16px' height='16px' />,
                projects: i.type == "project" ? i.project.name || i.project : i.type,
                amount: (<span>
        <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <FormattedNumber value={i.amount}/> </span>),
                iconLast: <Arrow primary width='16px' height='16px' />
            }
        });
        const table = <Table selectable={false} heading={true} model={model} source={incomes} theme={tableTheme}/>
        const add =
            <div className={theme.errorShowIncomes}>
                <Link to={ `/app/transactions/incomes/new`}>
                <Button type='button' icon='add' raised primary  />
                <p> <FormattedMessage {...il8n.ADD_SOME_INCOMES} /> </p> </Link>
            </div>;
        return this.props.incomesExists ? table : add
    }

    renderRecentIncomes(){
        return (
            <div>
                <Card className='card' theme={theme}>
                    <h3> <FormattedMessage {...il8n.RECENT_INCOMES} /> </h3>
                    {this.props.incomesLoading ? <Loader primary /> : this.getIncomesOrAdd()}
                </Card>
                <div className={theme.tableLink}>
                    <Link to={`/app/transactions/incomes`}> <FormattedMessage {...il8n.VIEW_ALL_INCOMES} /> </Link>
                </div>
            </div>
        )
    }
    getExpensesOrAdd(){
        const model = {
            icon: {type: String},
            category: {type: String},
            amount: {type: String},
            iconLeft: {type: String}
        };
        const expenses = this.props.expenses.map(function(i){
            return {
                icon:  <i className={i.category.icon || ''}/> ,
                category: i.category.name || i.category,
                amount:(<span>
        <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <FormattedNumber value={i.amount}/> </span>),
                iconLeft: <Arrow down danger width='16px' height='16px' />
            }
        });
        const table = <Table selectable={false} heading={true} model={model} source={expenses} theme={tableRightTheme}/>
        const add =
            <div className={theme.errorShowExpenses}>
                <Link to={`/app/transactions/expenses/new`}>
                <Button type='button' icon='add' raised accent />
                <p> <FormattedMessage {...il8n.ADD_SOME_EXPENSES} /> </p> </Link>
            </div>;
        return this.props.expensesExists ? table : add
    }
    renderRecentExpenses(){
        return (
            <div>
                <Card className='card' theme={theme}>
                    <h3> <FormattedMessage {...il8n.RECENT_EXPENSES} /> </h3>
                    {this.props.expensesLoading ? <Loader accent /> : this.getExpensesOrAdd()}
                </Card>
                <div className={theme.tableLink}>
                    <Link to={`/app/transactions/expenses`}> <FormattedMessage {...il8n.VIEW_ALL_EXPENSES} /> </Link>
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
    const incomesHandle = Meteor.subscribe('incomes', 5);
    const incomesLoading = !incomesHandle.ready();
    const incomes = Incomes.find({}, {fields: {amount: 1, type: 1, project: 1}}).fetch();
    const incomesExists = !incomesLoading && !!incomes.length;


    const expensesHandle = Meteor.subscribe('expenses', 5);
    const expensesLoading = !expensesHandle.ready();
    const expenses = Expenses.find({}, {fields: {amount: 1, 'category': 1}}).fetch();
    const expensesExists = !expensesLoading && !!expenses.length;

    return {
        incomesLoading,
        incomes,
        incomesExists,

        expensesLoading,
        expenses,
        expensesExists
    };
}, RecentActivities);