import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';

import { Card, Snackbar , Table, Button } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';

import { Projects } from '/imports/api/projects/projects.js';
import { Categories } from '/imports/api/categories/categories.js';

import { Transactions } from '/imports/api/transactions/transactions.js';

import { routeHelpers } from '../../../../helpers/routeHelpers.js'
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
    },
    PROJECTS: {
        id: 'DASHBOARD.PROJECTS'
    },
    AMOUNT: {
        id: 'DASHBOARD.AMOUNT'
    },
    EXPENSE_CATEGORY: {
        id: 'DASHBOARD.EXPENSE_CATEGORY'
    },
    EXPENSE_AMOUNT: {
        id: 'DASHBOARD.EXPENSE_AMOUNT'
    }
});


class RecentActivities extends Component {

    constructor(props) {
        super(props);

        this.state = {
            active : false
        };
    }

    addExpense(){
        if(this.props.categoriesFind && this.props.categoriesFind.length){
            routeHelpers.changeRoute('/app/transactions/expense/add/new');
        }
        else{
            this.setState({
                active: true,
                barMessage: 'You must have a single category to add expense'
            });
        }

    }

    addIncome(){
        routeHelpers.changeRoute('/app/transactions/income/add/new');
    }

    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }

    renderRecents(){
        return (
            <div className='dashboard-card-group'>
                <Snackbar
                    action='Dismiss'
                    active={this.state.active}
                    label={this.state.barMessage}
                    timeout={2000}
                    onClick={this.handleBarClick.bind(this)}
                    onTimeout={this.handleBarTimeout.bind(this)}
                />
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
            projects: {type: String, title: <FormattedMessage {...il8n.PROJECTS} />},
            amount: {type: Number, title: <FormattedMessage {...il8n.AMOUNT} />},
            iconLast: {type: String}
        };
        let incomes = this.props.incomes.map(function(i){
            return {
                icon: <Arrow primary width='16px' height='16px' />,
                projects: i.type === "project" ? i.project.name || i.project : i.type,
                amount: (<span>
        <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <FormattedNumber value={i.amount}/> </span>),
                iconLast: <Arrow primary width='16px' height='16px' />
            }
        });
        const table = <Table selectable={false} heading={true} model={model} source={incomes} theme={tableTheme}/>;
        const add =
            <div className={theme.errorShowIncomes}>
                <Button type='button' icon='add' raised primary onClick={this.addIncome.bind(this)} />
                <p> <FormattedMessage {...il8n.ADD_SOME_INCOMES} /> </p>
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
                    <Link to={`/app/transactions?type=incomes`}> <FormattedMessage {...il8n.VIEW_ALL_INCOMES} /> </Link>
                </div>
            </div>
        )
    }
    getExpensesOrAdd(){
        const model = {
            icon: {type: String},
            category: {type: String, title: <FormattedMessage {...il8n.EXPENSE_CATEGORY} />},
            amount: {type: String, title: <FormattedMessage {...il8n.EXPENSE_AMOUNT} />},
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
        const table = <Table selectable={false} heading={true} model={model} source={expenses} theme={tableRightTheme}/>;
        const add =
            <div className={theme.errorShowExpenses}>
                <Button type='button' icon='add' raised accent onClick={this.addExpense.bind(this)} />
                <p> <FormattedMessage {...il8n.ADD_SOME_EXPENSES} /> </p>
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
                    <Link to={`/app/transactions?type=expenses`}> <FormattedMessage {...il8n.VIEW_ALL_EXPENSES} /> </Link>
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
    const projects = Meteor.subscribe('projects.all');
    const category = Meteor.subscribe('categories');

    let projectsFind = Projects.find().fetch();
    let categoriesFind = Categories.find().fetch();
    const incomesHandle = Meteor.subscribe('transactions.incomes', 5);
    const incomesLoading = !incomesHandle.ready();
    const incomes = Transactions.find({
        type: 'income'
    }, {
        fields: {
            amount: 1, type: 1, project: 1
        }
    }).fetch();
    const incomesExists = !incomesLoading && !!incomes.length;


    const expensesHandle = Meteor.subscribe('transactions.expenses', 5);
    const expensesLoading = !expensesHandle.ready();
    const expenses = Transactions.find({
        type: 'expense'
    }, {
        fields: {
            amount: 1, 'category': 1
        }
    }).fetch();
    const expensesExists = !expensesLoading && !!expenses.length;

    return {
        categoriesFind,
        projectsFind,
        incomesLoading,
        incomes,
        incomesExists,

        expensesLoading,
        expenses,
        expensesExists
    };
}, RecentActivities);