import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { List, ListItem, ListDivider, Button } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../api/accounts/accounts.js';

class AccountsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    toggleSidebar(){
        this.props.toggleSidebar();
    }

    renderAccount(){
        return this.props.accounts.map((account) => {
            return <ListItem
                key={account._id}
                onClick={ this.toggleSidebar.bind(this) }
                avatar='https://dl.dropboxusercontent.com/u/2247264/assets/m.jpg'
                caption={account.name}
                legend={account.purpose}
                rightIcon='mode_edit'
                />
        })
    }

    render() {
        return (
            <List selectable ripple>
                <Button icon='add' floating accent className='add-button' />
                {this.renderAccount()}
            </List>
        );
    }
}

AccountsPage.propTypes = {
    accounts: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('accounts');

    return {
        accounts: Accounts.find({}).fetch()
    };
}, AccountsPage);