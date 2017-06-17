import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Autocomplete } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';

import { accountHelpers } from '/imports/helpers/accountHelpers.js'
import { Accounts } from '../../../api/accounts/accounts.js';

class AccountsDD extends Component {

    constructor(props) {
        super(props);

        this.state = {};
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
        return (
            <Autocomplete
                direction='down'
                onChange={this.filterByAccounts.bind(this)}
                label='Accounts'
                source={this.accounts()}
                value={this.props.local.accounts}
                />
        );
    }
}

AccountsDD.propTypes = {
    accounts: PropTypes.array.isRequired
};

export default createContainer(() => {

    Meteor.subscribe('accounts');
    const accounts = Accounts.find({}).fetch();

    return {
        accounts,
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, AccountsDD);