import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { List, ListItem, Button, Card, Table, Dialog } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';
import { currencyFormatHelpers, userCurrencyHelpers } from '/imports/helpers/currencyHelpers.js'

import Form from './Form.jsx';
import Loader from '/imports/ui/components/loader/Loader.jsx';

import theme from './theme';
import tableTheme from './tableTheme';
import buttonTheme from './buttonTheme';
import dialogTheme from './dialogTheme';

import bankFonts from '/imports/ui/bankFonts.js';
import countries from '/imports/ui/countries.js';

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
    toggleSidebar(event){
        this.props.toggleSidebar(true);
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
        return (
            <div className={theme.dialogAccount}>
                <div className={theme.confirmText}>
                    <h3>bank account</h3>
                    <p>This will remove your all data</p>
                    <p>Are you sure to remove your bank account?</p>
                </div>

                <div className={theme.buttonBox}>
                    <Button label='GO BACK' raised primary onClick={this.closePopup.bind(this)} />
                    <Button label='YES, REMOVE' raised onClick={this.removeAccount.bind(this)} theme={buttonTheme}/>
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
        return userCurrencyHelpers.loggedUserCurrency() + currencyFormatHelpers.currencyStandardFormat(balance)
    }
    renderAccount() {
        const model = {
            icon: {type: String},
            content: {type: String},
            actions: {type: String}
        };
        let accounts = this.props.accounts.map((account, index) => {
            return {
                icon: <i className="bank-banks_BANK-ISLAMI"></i>,
                content:
                    <div>
                        <div>Bank: <strong>{account.name}</strong> ({account.purpose})</div>
                        <div>Account number: <strong>{account.number || 'Not Available'}</strong></div>
                        {this.getAvailableBalance([account._id], index)}
                        <div>Available balance: <strong>{this.getFormattedCurrency(account.availableBalance) || 'Loading ...'}</strong></div>
                    </div>,
                actions:
                    <div className={theme.buttonParent}>
                        <Button
                            label='Edit Info'
                            raised
                            onClick={this.openPopup.bind(this, 'edit', account)}
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
                    <h3>cards and bank accounts</h3>
                    <Button
                        className={theme.button}
                        icon='add'
                        label='ACCOUNT'
                        flat
                        onClick={this.openPopup.bind(this, 'add')}
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
    accounts: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('accounts');

    return {
        accounts: Accounts.find({}).fetch()
    };
}, AccountsPage);