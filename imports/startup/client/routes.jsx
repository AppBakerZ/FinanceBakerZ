import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { Meteor } from 'meteor/meteor'

import AuthLayout from '../../ui/components/AuthLayout.jsx';
import AppLayout from '../../ui/components/AppLayout.jsx';

import DashboardPage from '../../ui/components/dashboard/Dashboard.jsx';

import Register from '../../ui/components/auth/Register.jsx';
import Login from '../../ui/components/auth/Login.jsx';

import AccountsPage from '../../ui/components/accounts/Accounts.jsx';
import AccountsSideBar from '../../ui/components/accounts/AccountsSideBar.jsx';

import IncomesPage from '../../ui/components/incomes/Incomes.jsx';
import IncomesSideBar from '../../ui/components/incomes/IncomesSideBar.jsx';

import ExpensesPage from '../../ui/components/expenses/Expenses.jsx';
import ExpensesSideBar from '../../ui/components/expenses/ExpensesSideBar.jsx';

import CategoriesPage from '../../ui/components/categories/Categories.jsx';
import CategoriesSideBar from '../../ui/components/categories/CategoriesSideBar.jsx';

import SettingsPage from '../../ui/components/settings/Settings.jsx';
import SettingsSideBar from '../../ui/components/settings/SettingsSideBar.jsx';

import ProjectPage from '../../ui/components/projects/Project.jsx';



let checkAuth = (nextState, replace, next, setIntervalHandel) => {
    clearInterval(setIntervalHandel);
    if (! Meteor.user() ) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        });
        next()
    }else{
        next()
    }
};

let requireAuth = (nextState, replace, next) => {
    let setIntervalHandel;
    setIntervalHandel = setInterval(() => {
        if (Meteor.user() !== undefined){
            checkAuth(nextState, replace, next, setIntervalHandel)
        }
    }, 1)

};

Meteor.startup( () => {
    render(
        <Router history={ browserHistory }>
            <Route path="app" component={AppLayout} onEnter={requireAuth}>
                <IndexRoute components={{ content: DashboardPage}} />
                <Route path="dashboard" components={{ content: DashboardPage}} />
                <Route path="accounts" components={{ content: AccountsPage, sidebar: AccountsSideBar }}>
                    <Route path="new" />
                    <Route path=":id" />
                </Route>
                <Route path="incomes" components={{ content: IncomesPage, sidebar: IncomesSideBar }}>
                    <Route path="new" />
                    <Route path=":id" />
                </Route>
                <Route path="expenses" components={{ content: ExpensesPage, sidebar: ExpensesSideBar }}>
                    <Route path="new" />
                    <Route path=":id" />
                </Route>
                <Route path="categories" components={{ content: CategoriesPage, sidebar: CategoriesSideBar }}>
                    <Route path="new" />
                    <Route path=":id" />
                </Route>
                <Route path="settings" components={{ content: SettingsPage, sidebar: SettingsSideBar }}>
                    <Route path="new" />
                    <Route path=":id" />
                </Route>
                <Route path="projects" components={{ content: ProjectPage}}>
                </Route>
            </Route>
            <Route path="/" component={AuthLayout}>
                <IndexRoute component={ Login} />
                <Route path="register" component={ Register} />
                <Route path="login" component={ Login} />
            </Route>
            </Router>,
        document.getElementById( 'render-root' )
    );
});