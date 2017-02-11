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

export default class Form extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            purpose: '',
            number: '',
            bank: '',
            active: false,
            loading: false,
            country: 'PK'
        };

        this.countries = _.sortBy(countries, 'label');
        this.setBanks()
    }
    setBanks(country){
        let bankIcons = bankFonts[country || this.state.country] || [];
        this.banks = bankIcons.map((font, index) => {

            index++;
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
        const {name, purpose, number, bank} = this.state;
        Meteor.call('accounts.insert', {
            account: {
                name,
                purpose,
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
        const {_id, name, purpose, number, bank} = this.state;
        Meteor.call('accounts.update', {
            account: {
                _id,
                name,
                purpose,
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
        let button;
        if(!this.props.account){
            button = <div className={theme.addBtn}><Button type='submit' icon='add' label='Add Account' raised primary /></div>
        }else{
            button = <div className={theme.addBtn}><Button type='submit' icon='mode_edit' label='Update Account' raised primary /></div>
        }
        return button;
    }
    render() {
        return (
            <form onSubmit={this.onSubmit.bind(this)} className={theme.addAccount}>
                <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />

                <h3 className={theme.titleAccount}>add account</h3>

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
                    label='Select Country'
                    value={this.state.country}
                    />
                <Dropdown theme={dropdownTheme}
                          source={this.banks}
                          name='bank'
                          onChange={this.onChange.bind(this)}
                          value={this.state.bank}
                          label='Select Bank/Card'
                          template={this.bankIcons}
                          required
                    />
                <Input type='text' label='Enter Account Number'
                       name='purpose'
                       maxLength={ 50 }
                       value={this.state.purpose}
                       onChange={this.onChange.bind(this)}
                    />
                {this.renderButton()}
            </form>
        );
    }
}