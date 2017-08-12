import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';

import { Autocomplete } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { routeHelpers } from '../../../helpers/routeHelpers.js'
import theme from './theme';

import { accountHelpers } from '/imports/helpers/accountHelpers.js'
import { Accounts } from '../../../api/accounts/accounts.js';
import {intlShape, injectIntl, defineMessages} from 'react-intl';

const il8n = defineMessages({
    FILTER_BY_ACCOUNT: {
        id: 'TRANSACTIONS.FILTER_BY_ACCOUNT'
    }
});

class AccountsDD extends Component {

    constructor(props) {
        super(props);
    }
    accounts(){
        let accounts = {};
        this.props.accounts.forEach((account) => {
            accounts[account._id] = accountHelpers.alterName(account.bank);
        });
        return accounts;
    }
    filterByAccounts(accounts) {
        let { parentProps } = this.props.parentProps;
        let { location, history } = parentProps;
        let pathname = routeHelpers.resetPagination(location.pathname);
        let query = location.query;
        query.accounts = `${[accounts]}`;
        history.push({
            pathname: pathname,
            query: query
        });
        routeHelpers.changeRoute(pathname, 0, query)
    }
    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.autoCompleteParent}>
            <Autocomplete theme={theme}
                direction='down'
                onChange={this.filterByAccounts.bind(this)}
                label={formatMessage(il8n.FILTER_BY_ACCOUNT)}
                source={this.accounts()}
                value={this.props.local.accounts}
                />
            </div>
        );
    }
}


AccountsDD.propTypes = {
    accounts: PropTypes.array.isRequired,
    parentProps: PropTypes.object.isRequired
};

export default injectIntl(createContainer(() => {

    Meteor.subscribe('accounts');
    const accounts = Accounts.find({}).fetch();

    return {
        accounts,
        local: LocalCollection.findOne({
            name: 'localTransactions'
        })
    };
}, AccountsDD));