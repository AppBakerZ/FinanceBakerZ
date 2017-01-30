import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { List, ListItem, ListDivider, Button, Card, Table } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';

import theme from './theme';
import tableTheme from './tableTheme';
import buttonTheme from './buttonTheme';

class AccountsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
    }

    account() {
        const model = {
            icon: {type: String},
            content: {type: String},
            actions: {type: String}
        };
        let accounts = this.props.accounts.map(function(i){
            return {
                icon: <img src="/assets/images/Colourful Rose Flower Wallpapers (2).jpg" alt=""/>,
                content:
                <div>
                    <div>bank: <strong>standard chartered</strong></div>
                    <div>account number: <strong>00971222001</strong></div>
                    <div>available balance: <strong>2,50,000</strong> PKR</div>
                </div>,
                actions:
                    <div className={theme.buttonParent}>
                        <Button label='Edit Info' raised accent />
                        <Button label='' icon='close' raised theme={buttonTheme} />
                    </div>
            }
        });
        return (
            <div className={theme.accountContent}>
                <div className={theme.accountTitle}>
                    <h3>cards and bank accounts</h3>
                </div>
                <Card theme={tableTheme}>
                    <Table selectable={false} heading={false} model={model} source={accounts}/>
                </Card>
            </div>
        );
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
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                <Link
                    to={`/app/accounts/new`}>
                    <Button onClick={ this.toggleSidebar.bind(this) } icon='add' floating accent className='add-button' />
                </Link>
                <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
                    <List ripple>
                        {this.account()}
                        {this.renderAccount()}
                    </List>
                </div>
            </div>
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