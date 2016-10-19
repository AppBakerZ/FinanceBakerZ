import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { List, ListItem, ListDivider, Button } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';

import iScroll from 'iscroll'
import ReactIScroll from 'react-iscroll'

const iScrollOptions = {
    mouseWheel: true,
    scrollbars: true,
    scrollX: true,
    click : true
};


class AccountsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
    }

    renderAccount(){
        return this.props.accounts.map((account) => {
            return <Link
                key={account._id}
                activeClassName='active'
                to={`/app/accounts/${account._id}`}>
                <ListItem
                    selectable
                    onClick={ this.toggleSidebar.bind(this) }
                    caption={account.name}
                    legend={account.purpose}
                    leftIcon='account_balance'
                    rightIcon='mode_edit'
                    />
            </Link>
        })
    }

    render() {
        return (
            <ReactIScroll iScroll={iScroll} options={iScrollOptions}>
                <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                    <Link
                        to={`/app/accounts/new`}>
                        <Button onClick={ this.toggleSidebar.bind(this) } icon='add' floating accent className='add-button' />
                    </Link>
                    <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
                        <List ripple>
                            {this.renderAccount()}
                        </List>
                    </div>
                </div>
            </ReactIScroll>
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