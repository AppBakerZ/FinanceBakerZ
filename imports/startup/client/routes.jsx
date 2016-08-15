import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from '../../ui/components/App.jsx';
import AccountsPage from '../../ui/components/Accounts.jsx';
import AccountsSideBar from '../../ui/components/AccountsSideBar.jsx';

Meteor.startup( () => {
    render(
        <Router history={ browserHistory }>
            <Route path="/" component={App}>
                <IndexRoute components={{ content: AccountsPage, sidebar: AccountsSideBar }} />
                <Route path="accounts" components={{ content: AccountsPage, sidebar: AccountsSideBar }}>
                    <Route path="new" />
                    <Route path=":id" />
                </Route>
            </Route>
        </Router>,
        document.getElementById( 'render-root' )
    );
});