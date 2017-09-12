import React, { Component,  } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';
import { routeHelpers } from '../../../helpers/routeHelpers.js'

import { List, ListItem, Button, Card, Table, Dialog } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';
import { userCurrencyHelpers } from '/imports/helpers/currencyHelpers.js'
import { accountHelpers } from '/imports/helpers/accountHelpers.js'

import Loader from '/imports/ui/components/loader/Loader.jsx';

import theme from './theme';
import tableTheme from './tableTheme';
import buttonTheme from './buttonTheme';
import dialogTheme from './dialogTheme';

import {FormattedMessage, intlShape, injectIntl, FormattedNumber ,defineMessages} from 'react-intl';


const il8n = defineMessages({
    BANK_ACCOUNTS: {
        id: 'ACCOUNTS.BANK_ACCOUNTS'
    },
    ADD_ACCOUNT_BUTTON: {
        id: 'ACCOUNTS.ADD_ACCOUNTS_BUTTON'
    },
    EDIT_ACCOUNTS_BUTTON: {
        id: 'ACCOUNTS.EDIT_ACCOUNTS_INFO_BUTTON'
    },
    BANK_ACCOUNT: {
        id: 'ACCOUNTS.BANK_ACCOUNT'
    },
    INFORM_MESSAGE: {
        id: 'ACCOUNTS.INFORM_MESSAGE'
    },
    CONFIRMATION_MESSAGE: {
        id: 'ACCOUNTS.CONFIRMATION_MESSAGE'
    },
    BACK_BUTTON: {
        id: 'ACCOUNTS.BACK_BUTTON'
    },
    REMOVE_BUTTON: {
        id: 'ACCOUNTS.REMOVE_BUTTON'
    },
    BANK: {
        id: 'ACCOUNTS.BANK'
    },
    ACCOUNT_NUMBER: {
        id: 'ACCOUNTS.ACCOUNT_NUMBER'
    },
    AVAILABLE_BALANCE: {
        id: 'ACCOUNTS.AVAILABLE_BALANCE'
    },
    NOT_AVAILABLE: {
        id: 'ACCOUNTS.NOT_AVAILABLE'
    }
});

class AccountsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            removeConfirmMessage: false,
            openDialog: false,
            selectedAccount: null,
            action: null
        };

    }
    popupTemplate(){
        return(
            <Dialog theme={dialogTheme}
                active={this.state.openDialog}
                onEscKeyDown={this.closePopup.bind(this)}
                onOverlayClick={this.closePopup.bind(this)}
                >
                {this.switchPopupTemplate()}
            </Dialog>
        )
    }
    switchPopupTemplate(){
        switch (this.state.action){
            case 'remove':
                return this.renderConfirmationMessage();
                break;
            case 'edit':
                return <Form account={this.state.selectedAccount} closePopup={this.closePopup.bind(this)} />;
                break;
            case 'add':
                return <Form closePopup={this.closePopup.bind(this)} />;
                break;
        }

    }
    openPopup (action, account) {
        this.setState({
            openDialog: true,
            action,
            selectedAccount: account || null
        });
    }
    closePopup () {
        this.setState({
            openDialog: false
        });
    }
    renderConfirmationMessage(){
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.dialogAccount}>
                <div className={theme.confirmText}>
                    <h3> <FormattedMessage {...il8n.BANK_ACCOUNT} /> </h3>
                    <p> <FormattedMessage {...il8n.INFORM_MESSAGE} /> </p>
                    <p> <FormattedMessage {...il8n.CONFIRMATION_MESSAGE} /> </p>
                </div>

                <div className={theme.buttonBox}>
                    <Button label={formatMessage(il8n.BACK_BUTTON)} raised primary onClick={this.closePopup.bind(this)} />
                    <Button label={formatMessage(il8n.REMOVE_BUTTON)} raised onClick={this.removeAccount.bind(this)} theme={buttonTheme}/>
                </div>
            </div>
        )
    }
    removeAccount(){
        const {_id} = this.state.selectedAccount;
        Meteor.call('accounts.remove', {
            account: {
                _id
            }
        }, (err, response) => {
            if(err){

            }else{

            }
        });
        // Close Popup
        this.setState({
            openDialog: false
        });
    }

    addAccount(){
        routeHelpers.changeRoute('/app/accounts/add/new');
    }

    editAccount(account){
        routeHelpers.changeRoute(`/app/accounts/edit/${account._id}`);
    }

    getAvailableBalance (accounts, index){
        Meteor.call('statistics.availableBalance', {accounts}, (err, ab) => {
            if(ab){
                this.props.accounts[index].availableBalance = ab;
                this.setState({index: accounts[0] + index })
            }else{

            }
        });
    }
    getFormattedCurrency(balance){
        return  (<span>
        <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <FormattedNumber value={balance}/> </span>
        )
    }
    renderAccount() {
        const { formatMessage } = this.props.intl;
        const model = {
            icon: {type: String},
            content: {type: String},
            actions: {type: String}
        };
        let accounts = this.props.accounts.map((account, index) => {
            return {
                icon: <i className={account.bank}></i>,
                content:
                    <div>
                        <div> <FormattedMessage {...il8n.BANK} />  <strong>{accountHelpers.alterName(account.bank)}</strong></div>
                        <div> <FormattedMessage {...il8n.ACCOUNT_NUMBER} /> <strong>{account.number || formatMessage(il8n.NOT_AVAILABLE)}</strong></div>
                        {this.getAvailableBalance([account._id], index)}
                        <div> <FormattedMessage {...il8n.AVAILABLE_BALANCE} /> <strong>{this.getFormattedCurrency(account.availableBalance || 0) || 'Loading ...'}</strong></div>
                    </div>,
                actions:
                    <div className={theme.buttonParent}>
                        <Button
                            label={formatMessage(il8n.EDIT_ACCOUNTS_BUTTON)}
                            raised
                            onClick={this.editAccount.bind(this, account)}
                            accent />
                        <Button
                            label=''
                            icon='close'
                            raised
                            onClick={this.openPopup.bind(this, 'remove', account)}
                            theme={buttonTheme} />
                    </div>
            }
        });
        return (
            <div className={theme.accountContent}>
                <div className={theme.accountTitle}>
                    <h3> <FormattedMessage {...il8n.BANK_ACCOUNTS} /> </h3>
                    <Button
                        className={theme.button}
                        icon='add'
                        label={formatMessage(il8n.ADD_ACCOUNT_BUTTON)}
                        flat
                        onClick={this.addAccount.bind(this)}
                        theme={buttonTheme}/>
                </div>
                <Card theme={tableTheme}>
                    { this.props.accounts.length ? <Table
                        selectable={false}
                        heading={false}
                        model={model}
                        source={accounts}/> : <Loader primary />}

                </Card>
            </div>
        );
    }

    render() {
        return (
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
                    <List ripple>
                        {this.renderAccount()}
                    </List>
                </div>
                {this.popupTemplate()}
            </div>
        );
    }
}

AccountsPage.propTypes = {
    accounts: PropTypes.array.isRequired,
    intl: intlShape.isRequired
};

AccountsPage =  createContainer(() => {
    Meteor.subscribe('accounts');

    return {
        accounts: Accounts.find({}).fetch()
    };
}, AccountsPage);

export default injectIntl(AccountsPage);