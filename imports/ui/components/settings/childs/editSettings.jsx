import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';
import { routeHelpers } from '../../../../helpers/routeHelpers.js'

import { Input, Button, ProgressBar, Snackbar, Dropdown } from 'react-toolbox';
import { Card} from 'react-toolbox/lib/card';

import { Meteor } from 'meteor/meteor';

import theme from './theme';
// import dropdownTheme from './dropdownTheme.scss';
import { Accounts } from '../../../../api/accounts/accounts.js';
import bankFonts from '/imports/ui/bankFonts.js';
import countries from '/imports/ui/countries.js';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';

const il8n = defineMessages({
    ADD_ACCOUNTS_BUTTON: {
        id: 'ACCOUNTS.ADD_ACCOUNTS_BUTTON'
    },
    UPDATE_ACCOUNTS_BUTTON: {
        id: 'ACCOUNTS.UPDATE_ACCOUNTS_BUTTON'
    },
    ADD_ACCOUNTS: {
        id: 'ACCOUNTS.ADD_ACCOUNT'
    },
    SELECT_COUNTRY: {
        id: 'ACCOUNTS.SELECT_COUNTRY'
    },
    SELECT_BANK: {
        id: 'ACCOUNTS.SELECT_BANK'
    },
    SELECT_ACCOUNT_NUMBER: {
        id: 'ACCOUNTS.ACCOUNT_NUMBER'
    }
});



class editSettingsPage extends Component {

    constructor(props) {
        super(props);

        const {formatMessage} = this.props.intl;

        this.state = {
            active: false
        };
    }

    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }

    progressBarToggle (){
        return this.state.loading ? 'progress-bar' : 'progress-bar hide';
    }

    onSubmit(event){
        event.preventDefault();
        this.state.isNew ? this.createAccount() : this.updateAccount();
        this.setState({loading: true});
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.incomeCard}>
                <Card theme={theme}>
                    {/*<h3>{this.state.isNew ? <FormattedMessage {...il8n.ADD_ACCOUNTS_BUTTON} /> : <FormattedMessage {...il8n.UPDATE_ACCOUNTS_BUTTON} />}</h3>*/}
                    <h3>Update Settings</h3>
                    <form onSubmit={this.onSubmit.bind(this)} className={theme.incomeForm}>

                        <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />

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

                        {/*<Dropdown theme={theme} className={theme.projectStatus}*/}
                                  {/*source={this.countries}*/}
                                  {/*name='country'*/}
                                  {/*onChange={this.onChange.bind(this)}*/}
                                  {/*label={formatMessage(il8n.SELECT_COUNTRY)}*/}
                                  {/*value={this.state.country}*/}
                        {/*/>*/}

                        {/*<Dropdown theme={dropdownTheme} className={theme.projectStatus}*/}
                                  {/*auto*/}
                                  {/*source={this.banks}*/}
                                  {/*name='bank'*/}
                                  {/*onChange={this.onChange.bind(this)}*/}
                                  {/*value={this.state.bank}*/}
                                  {/*label={formatMessage(il8n.SELECT_BANK)}*/}
                                  {/*template={this.bankIcons}*/}
                                  {/*required*/}
                        {/*/>*/}

                        <Input type='text' label="name"
                               name='number'
                               value={this.state.number}
                               onChange={this.onChange.bind(this)}
                        />

                        {/*{this.renderButton()}*/}
                    </form>
                </Card>
            </div>
        );
    }
}

editSettingsPage.propTypes = {
    account: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

editSettingsPage = createContainer((props) => {
    const { id } = props.params;
    const accountsHandle = Meteor.subscribe('accounts');
    const accountsLoading = !accountsHandle.ready();
    const account = Accounts.findOne({_id: id});

    return {
        account: account ? account : {}
    };
}, editSettingsPage);

export default injectIntl(editSettingsPage);
