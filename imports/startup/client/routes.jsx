import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
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
import newAccountPage from '../../ui/components/accounts/childs/newAccountPage.jsx';

import CategoriesPage from '../../ui/components/categories/Categories.jsx';
import categoryDetail from '../../ui/components/categories/childs/CategoryDetails.jsx';
import newCategoryPage from '../../ui/components/categories/childs/newCategoryPage.jsx';

import ReportsPage from '../../ui/components/reports/Reports.jsx';

import SettingsPage from '../../ui/components/settings/Settings.jsx';
import editSettingsPage from '../../ui/components/settings/childs/editSettings.jsx';

import ProjectPage from '../../ui/components/projects/Project.jsx';
import ProjectDetail  from '../../ui/components/projects/childs/ProjectDetail'
import NewProjectPage from '../../ui/components/projects/childs/newProject'

import TransactionPage from '../../ui/components/transactions/Transactions.jsx';
import NewIncome from '../../ui/components/transactions/childs/NewIncome';
import NewExpense from '../../ui/components/transactions/childs/NewExpense';
import viewIncome from '../../ui/components/transactions/childs/viewIncome';
import viewExpense from '../../ui/components/transactions/childs/viewExpense';



import EasyPaisa from '../../ui/components/payments/easypaisa';
import EasyPayCallBack from '../../ui/components/payments/EasyPayCallBack';
import PaymentPage from '../../ui/components/payments/payments';
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


let requireAuth = (nextState, replace, next) => {
    let setIntervalHandel;
    setIntervalHandel = Meteor.setInterval(() => {
        if (Meteor.user() !== undefined){
            checkAuth(nextState, replace, next, setIntervalHandel)
        }
    }, 1)

};

class Il8n extends Component {
    constructor(props) {
        super(props);

        const language = (navigator.languages && navigator.languages[0]) ||
            navigator.language ||
            navigator.userLanguage;

        let languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
        const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

        this.state = {
            lang: { label: 'English', value: 'en', direction: 'ltr' },
            messages
        };
    }
    componentDidUpdate(){
        $('body').attr('dir', this.getUserLang().direction).attr('lang', this.getUserLang().value)
    }
    getUserLang(){
        return this.props.user && this.props.user.profile && this.props.user.profile.language || this.state.lang;
    }
    getMessages(){
        return localeData[this.getUserLang().value] || this.state.messages;
    }
    render() {
        return (
            <IntlProvider locale={this.getUserLang().value} messages={this.getMessages()} >
                {/* below key with Math.random is a fix of router warning*/}
                {/*<Warning: [react-router] You cannot change <Router routes>; it will be ignored*/}
                <Router history={ browserHistory } key={Math.random()}>
                    <Route path="app" component={AppLayout} onEnter={requireAuth}>
                        <IndexRoute components={{ content: DashboardPage}} />
                        <Route path="dashboard" components={{ content: DashboardPage}} />
                        <Route path="accounts" components={{ content: AccountsPage }} />
                        <Route path="accounts(/:type)(/:id)" components={{ content: newAccountPage}} />
                        <Route path="categories" components={{ content: CategoriesPage }} />
                        <Route path="categoryDetail(/:id)" components={{ content: categoryDetail}} />
                        <Route path="categories(/:type)(/:id)" components={{ content: newCategoryPage}} />
                        <Route path="reports(/paginate)(/:number)" components={{ content: ReportsPage }} />

                        <Route path="settings" components={{ content: SettingsPage }} />
                        <Route path="settings/edit" components={{ content: editSettingsPage}} />
                        <Route path="projectDetail(/:id)" components={{ content: ProjectDetail}} />
                        <Route path="projects(/paginate)(/:number)" components={{ content: ProjectPage}}>
                        </Route>
                        <Route path="projects(/:type)(/:id)" components={{ content: NewProjectPage}} />
                        <Route path="transactions(/paginate)(/:number)" components={{ content: TransactionPage}}>
                            <Route path="incomes" >
                            </Route>
                            <Route path="expenses" >
                            </Route>
                        </Route>
                        <Route path="transactions/income(/:id)" components={{content: viewIncome}} />
                        <Route path="transactions/expense(/:id)" components={{content: viewExpense}} />
                        <Route path="transactions/income(/:type)(/:id)" components={{content: NewIncome}}/>
                        <Route path="transactions/expense(/:type)(/:id)" components={{content: NewExpense}}/>
                        <Route path="easyPaisa" components={{ content: EasyPaisa}} />
                        <Route path="EasyPayCallBack" components={{ content: EasyPayCallBack}} />
                        <Route path="payments" components={{ content: PaymentPage}} />
                    </Route>
                    <Route path="/" component={AuthLayout}>
                        <IndexRoute component={ Login} />
                        <Route path="register" component={ Register} />
                        <Route path="login" component={ Login} />
                        <Route path="forgotPassword(/:token)" component={ ForgotPassword} />
                    </Route>
                </Router>
            </IntlProvider>
        );
    }
}

const Root = createContainer(() => {
    return {
        user: Meteor.user()
    };
}, Il8n);

Meteor.startup( () => {
    render(
        <Root />,
        document.getElementById( 'render-root' )
    );
});