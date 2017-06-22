import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Autocomplete } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
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
        updateFilter('reports', 'accounts', accounts)
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
    accounts: PropTypes.array.isRequired
};

export default injectIntl(createContainer(() => {

    Meteor.subscribe('accounts');
    const accounts = Accounts.find({}).fetch();

    return {
        accounts,
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, AccountsDD));