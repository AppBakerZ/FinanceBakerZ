import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';
import { routeHelpers } from '../../../../helpers/routeHelpers.js'

import { Input, Button, ProgressBar, Snackbar, Dropdown } from 'react-toolbox';
import { Card} from 'react-toolbox/lib/card';

import { Meteor } from 'meteor/meteor';

import theme from './theme';
// import dropdownTheme from './dropdownTheme.scss';
import dropdownTheme from '../dropdownTheme.scss'
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



class newAccountPage extends Component {

    constructor(props) {
        super(props);

        const {formatMessage} = this.props.intl;

        this.state = {
            loading: false,
            disableButton: false,
            parentId: null,
            iconSelected: 'en',
            isNew: false,
            selectedAccount: null,
            country: 'PK',
            number: '',
            bank: '',
            active: false,
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

    setCurrentRoute(value){
        this.setState({
            isNew: value
        })
    }

    componentDidMount (){
        this.updateAccountProps(this.props)
    }

    componentWillReceiveProps (p){
        this.updateAccountProps(p)
    }

    updateAccountProps(p){
        let { account } = p;
        let { id } = p.params;
        let isNew = id === 'new';
        if( !isNew ){
            this.setState(account);
        }
        this.setCurrentRoute(isNew);
    }
    setBanks(country){

        let bankIcons = country === 'All' ? Object.values(bankFonts).reduce((prev, curr) => [...prev, ...curr]) : bankFonts[country];
        this.banks = bankIcons.map((font, index) => {

            index++;
            //delete pre keys if attach.
            delete font.removeRightBorder;
            delete font.removeBottomBorder;
            if(index % 5 === 0){
                font.removeRightBorder = true
            }
            let lastItems = bankIcons.length % 5 === 0 ? 5 : bankIcons.length % 5;
            if(index > bankIcons.length - lastItems){
                font.removeBottomBorder = true
            }

            return font
        });
    }
    onSubmit(event){
        event.preventDefault();
        this.setState({
            disableButton: true,
            loading: true
        });
        this.state.isNew ? this.createAccount() : this.updateAccount();
    }
    createAccount(){
        const {country, number, bank} = this.state;
        if(bank) {
            Meteor.call('accounts.insert', {
                account: {
                    country,
                    number,
                    bank
                }
            }, (err, response) => {
                if (response) {
                    routeHelpers.changeRoute('/app/accounts', 1200);
                    this.setState({
                        active: true,
                        barMessage: 'Account created successfully',
                        barIcon: 'done',
                        barType: 'accept'
                    });
                } else {
                    this.setState({
                        disableButton: false,
                        active: true,
                        barMessage: err.reason,
                        barIcon: 'error_outline',
                        barType: 'cancel'
                    });
                }
                this.setState({loading: false})
            });
        }
        else{
            this.setState({
                disableButton: false,
                active: true,
                barMessage: 'You must have to add the bank'
            });
        }

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
                    disableButton: false,
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }else{
                routeHelpers.changeRoute('/app/accounts', 1200);
                this.setState({
                    active: true,
                    barMessage: 'Account updated successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
            this.setState({loading: false})
        });
    }
    onChange (val, e) {
        this.setState({[e.target.name]: val});
        if(e.target.name === 'country')
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
    renderButton (){
        const { formatMessage } = this.props.intl;
        let button;
        if(this.state.isNew){
            button = <div className={theme.addBtn}><Button type='submit' icon='add' label={formatMessage(il8n.ADD_ACCOUNTS_BUTTON)} raised primary disabled={this.state.disableButton}/></div>
        }else{
            button = <div className={theme.addBtn}><Button type='submit' icon='mode_edit' label={formatMessage(il8n.UPDATE_ACCOUNTS_BUTTON)} raised primary disabled={this.state.disableButton}/></div>
        }
        return button;
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.incomeCard}>
                <Card theme={theme}>
                    <h3>{this.state.isNew ? <FormattedMessage {...il8n.ADD_ACCOUNTS_BUTTON} /> : <FormattedMessage {...il8n.UPDATE_ACCOUNTS_BUTTON} />}</h3>
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

                        <Dropdown theme={theme} className={theme.projectStatus}
                                  source={this.countries}
                                  name='country'
                                  onChange={this.onChange.bind(this)}
                                  label={formatMessage(il8n.SELECT_COUNTRY)}
                                  value={this.state.country}
                        />

                        <Dropdown theme={dropdownTheme}
                                  auto
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
                </Card>
            </div>
        );
    }
}

newAccountPage.propTypes = {
    account: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

newAccountPage = createContainer((props) => {
    const { id } = props.params;
    const accountsHandle = Meteor.subscribe('accounts');
    const accountsLoading = !accountsHandle.ready();
    const account = Accounts.findOne({_id: id});

    return {
        account: account ? account : {}
    };
}, newAccountPage);

export default injectIntl(newAccountPage);
