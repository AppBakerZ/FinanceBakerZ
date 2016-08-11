import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from '../../ui/components/App.jsx';
import Accounts from '../../ui/components/Accounts.jsx';

Meteor.startup( () => {
    render(
        <Router history={ browserHistory }>
            <Route path="/" component={App}>
                <IndexRoute component={Accounts}/>
                <Route path="accounts" component={Accounts} />
            </Route>
        </Router>,
        document.getElementById( 'render-root' )
    );
});