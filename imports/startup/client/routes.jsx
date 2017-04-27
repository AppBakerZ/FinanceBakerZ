import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { Meteor } from 'meteor/meteor'

import AuthLayout from '../../ui/components/AuthLayout.jsx';
import AppLayout from '../../ui/components/AppLayout.jsx';

import DashboardPage from '../../ui/components/dashboard/Dashboard.jsx';

import Register from '../../ui/components/auth/Register.jsx';
import Login from '../../ui/components/auth/Login.jsx';
import ForgotPassword from '../../ui/components/auth/ForgotPassword.jsx';

import AccountsPage from '../../ui/components/accounts/Accounts.jsx';

import CategoriesPage from '../../ui/components/categories/Categories.jsx';

import SettingsPage from '../../ui/components/settings/Settings.jsx';

import ProjectPage from '../../ui/components/projects/Project.jsx';
import TransactionPage from '../../ui/components/transactions/Transactions.jsx';
import {addLocaleData} from 'react-intl';
import {injectIntl, IntlProvider, FormattedRelative,} from 'react-intl';
import localeData from '../../../data.json'
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


const language = (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage;

let languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

 const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

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
        <IntlProvider locale={languageWithoutRegionCode} messages={messages} >
            <Router history={ browserHistory }>
                <Route path="app" component={AppLayout} onEnter={requireAuth}>
                    <IndexRoute components={{ content: DashboardPage}} />
                    <Route path="dashboard" components={{ content: DashboardPage}} />
                    <Route path="accounts" components={{ content: AccountsPage }} />
                    <Route path="categories" components={{ content: CategoriesPage }} />
                    <Route path="settings" components={{ content: SettingsPage }}>
                        <Route path=":id" />
                    </Route>
                    <Route path="projects" components={{ content: ProjectPage}}>
                    </Route>
                    <Route path="transactions" components={{ content: TransactionPage}}>
                        <Route path="incomes" >
                            <Route path="new" />
                        </Route>
                        <Route path="expenses" >
                            <Route path="new" />
                        </Route>
                    </Route>
                </Route>
                <Route path="/" component={AuthLayout}>
                    <IndexRoute component={ Login} />
                    <Route path="register" component={ Register} />
                    <Route path="login" component={ Login} />
                    <Route path="forgotPassword" component={ ForgotPassword} />
                </Route>
            </Router>
        </IntlProvider>,
        document.getElementById( 'render-root' )
    );
});