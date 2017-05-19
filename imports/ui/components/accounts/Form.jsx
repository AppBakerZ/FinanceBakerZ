import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { Input, Button, ProgressBar, Snackbar, Dropdown } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';

import theme from './theme';
import dropdownTheme from './dropdownTheme';

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


class Form extends Component {

    constructor(props) {
        super(props);

        this.state = {
            country: 'PK',
            number: '',
            bank: '',
            active: false,
            loading: false
        };

        //get all countries that have banks.
        let availableBankCountries = Object.keys(bankFonts);

        //filter country according to availableBankCountries.
        let bankCountries = countries.filter((obj) => {
           return availableBankCountries.includes(obj.value)
        });

        //sort countries in alphabetically order.
        this.countries = _.sortBy(bankCountries, 'label');
        this.countries = [{value: 'All', label: 'All Countries'}, ...this.countries];
        this.setBanks(this.state.country)
    }
    setBanks(country){

        let bankIcons = country == 'All' ? Object.values(bankFonts).reduce((prev, curr) => [...prev, ...curr]) : bankFonts[country];
        this.banks = bankIcons.map((font, index) => {

            index++;
            //delete pre keys if attach.
            delete font.removeRightBorder;
            delete font.removeBottomBorder;
            if(index % 3 == 0){
                font.removeRightBorder = true
            }
            let lastItems = bankIcons.length % 3 == 0 ? 3 : bankIcons.length % 3;
            if(index > bankIcons.length - lastItems){
                font.removeBottomBorder = true
            }

            return font
        });
    }
    onSubmit(event){
        event.preventDefault();
        this.props.account ? this.updateAccount() : this.createAccount();
        this.setState({loading: true})
    }
    createAccount(){
        const {country, number, bank} = this.state;
        Meteor.call('accounts.insert', {
            account: {
                country,
                number,
                bank
            }
        }, (err, response) => {
            if(response){
                this.setState({
                    active: true,
                    barMessage: 'Account created successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
                setTimeout(()=> {
                    this.props.closePopup();
                }, 1000)
            }else{
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
            this.setState({loading: false})
        });
    }
    updateAccount(){
        const {_id, country, number, bank} = this.state;
        Meteor.call('accounts.update', {
            account: {
                _id,
                country,
                number,
                bank
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
                this.setState({
                    active: true,
                    barMessage: 'Account updated successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
                this.props.closePopup();
            }
            this.setState({loading: false})
        });
    }
    onChange (val, e) {
        this.setState({[e.target.name]: val});
        if(e.target.name == 'country')
            this.setBanks(val)
    }
    bankIcons(bank){
        let parentClass = '';

        if(bank.removeRightBorder){
            parentClass = dropdownTheme['removeRightBorder']
        }

        if(bank.removeBottomBorder){
            parentClass = dropdownTheme['removeBottomBorder']
        }

        return (
            <div className={parentClass}>
                <i className={bank.value}/>
            </div>
        );
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
    componentDidMount (){
        this.setState(this.props.account);
    }
    renderButton (){
        const { formatMessage } = this.props.intl;
        let button;
        if(!this.props.account){
            button = <div className={theme.addBtn}><Button type='submit' icon='add' label={formatMessage(il8n.ADD_ACCOUNTS_BUTTON)} raised primary /></div>
        }else{
            button = <div className={theme.addBtn}><Button type='submit' icon='mode_edit' label={formatMessage(il8n.UPDATE_ACCOUNTS_BUTTON)} raised primary /></div>
        }
        return button;
    }
    render() {
        const { formatMessage } = this.props.intl;
        return (
            <form onSubmit={this.onSubmit.bind(this)} className={theme.addAccount}>
                <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />

                <h3 className={theme.titleAccount}> <FormattedMessage {...il8n.ADD_ACCOUNTS} /> </h3>

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

                <Dropdown
                    source={this.countries}
                    name='country'
                    onChange={this.onChange.bind(this)}
                    label={formatMessage(il8n.SELECT_COUNTRY)}
                    value={this.state.country}
                    />
                <Dropdown theme={dropdownTheme}
                          source={this.banks}
                          name='bank'
                          onChange={this.onChange.bind(this)}
                          value={this.state.bank}
                          label={formatMessage(il8n.SELECT_BANK)}
                          template={this.bankIcons}
                          required
                    />
                <Input type='text' label={formatMessage(il8n.SELECT_ACCOUNT_NUMBER)}
                       name='number'
                       value={this.state.number}
                       onChange={this.onChange.bind(this)}
                    />
                {this.renderButton()}
            </form>
        );
    }
}

Form.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(Form);