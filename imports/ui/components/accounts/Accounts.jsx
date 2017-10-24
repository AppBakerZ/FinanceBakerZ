import React, { Component,  } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';
import { routeHelpers } from '../../../helpers/routeHelpers.js'

import { List, ListItem, Button, Card, Table, Dialog, Snackbar } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';
import { userCurrencyHelpers } from '/imports/helpers/currencyHelpers.js'
import { accountHelpers } from '/imports/helpers/accountHelpers.js'

import Loader from '/imports/ui/components/loader/Loader.jsx';
import ConfirmationMessage from '../utilityComponents/ConfirmationMessage/ConfirmationMessage';

import theme from './theme';
import tableTheme from './tableTheme';
import buttonTheme from './buttonTheme';

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
            action: null,
            active: false,
            loading: false,
        };

    }
    openPopup (account) {
        this.setState({
            openDialog: true,
            selectedAccount: account || null
        });
    }
    closePopup () {
        this.setState({
            openDialog: false
        });
    }
    removeAccount(){
        this.setState({
            openDialog: false
        });
        const {_id} = this.state.selectedAccount;
        Meteor.call('accounts.remove', {
            account: {
                _id
            }
        }, (err, response) => {
            if(err){
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });

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

    openDialog (e) {
        if(e){
            e.stopPropagation();
            e.preventDefault();
        }
        this.setState({
            openDialog: true,
        });
    }

    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
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
                            onClick={this.openPopup.bind(this, account)}
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
        const { formatMessage } = this.props.intl;
        let { openDialog } = this.state;
        return (
            <div className={theme.accountTableResponsive} style={{ flex: 1, display: 'flex', position: 'relative' }}>
                <Snackbar
                    action='Dismiss'
                    active={this.state.active}
                    icon={this.state.barIcon}
                    label={this.state.barMessage}
                    timeout={2000}
                    onClick={this.handleBarClick.bind(this)}
                    onTimeout={this.handleBarTimeout.bind(this)}
                    type={this.state.barType}
                />
                <div className={theme.accountResponsive} style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
                    <List ripple>
                        {this.renderAccount()}
                    </List>
                </div>
                <ConfirmationMessage
                    heading={formatMessage(il8n.BANK_ACCOUNT)}
                    information={formatMessage(il8n.INFORM_MESSAGE)}
                    confirmation={formatMessage(il8n.CONFIRMATION_MESSAGE)}
                    open={openDialog}
                    route="/app/accounts"
                    defaultAction={this.removeAccount.bind(this)}
                    close={this.closePopup.bind(this)}
                />
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