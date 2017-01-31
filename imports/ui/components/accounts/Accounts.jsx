import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { List, ListItem, Button, Card, Table, Dialog } from 'react-toolbox';
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
            removeConfirmMessage: false,
            openDialog: false
        };

    }
    toggleSidebar(event){
        this.props.toggleSidebar(true);
    }
    popupTemplate(){
        return(
            <Dialog
                    active={this.state.openDialog}
                    onEscKeyDown={this.closePopup.bind(this)}
                    onOverlayClick={this.closePopup.bind(this)}
                >
                {this.renderConfirmationMessage()}
            </Dialog>
        )
    }
    openPopup (account) {
        this.setState({
            openDialog: true,
            selectedAccount: account
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
                <div className={theme.confirmText}><p>Are you sure to delete this account?</p></div>

                <div className={theme.buttonBox}>
                    <Button label='Yes' raised accent onClick={this.removeAccount.bind(this)} />
                    <Button label='No' raised accent onClick={this.closePopup.bind(this)} />
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
                this.setState({
                    openDialog: false
                });
            }
        });
    }
    renderAccount() {
        const model = {
            icon: {type: String},
            content: {type: String},
            actions: {type: String}
        };
        let accounts = this.props.accounts.map((account) => {
            return {
                icon: <img src="/assets/images/Colourful Rose Flower Wallpapers (2).jpg" alt=""/>,
                content:
                <div>
                    <div>bank: <strong>{account.name}</strong> ({account.purpose})</div>
                    <div>account number: <strong>00971222001</strong></div>
                    <div>available balance: <strong>2,50,000</strong> PKR</div>
                </div>,
                actions:
                    <div className={theme.buttonParent}>
                        <Button
                            label='Edit Info'
                            raised accent />
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
                    <h3>cards and bank accounts</h3>
                    <Button className={theme.button} icon='add' label='ACCOUNT' flat onClick={ this.toggleSidebar.bind(this)} theme={buttonTheme}/>
                </div>
                <Card theme={tableTheme}>
                    <Table
                        selectable={false}
                        heading={false}
                        model={model}
                        source={accounts}/>
                </Card>
            </div>
        );
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