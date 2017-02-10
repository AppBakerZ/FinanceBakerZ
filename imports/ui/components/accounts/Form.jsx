import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { Input, Button, ProgressBar, Snackbar, Dropdown } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';

import theme from './theme';
import dropdownTheme from './dropdownTheme';

import bankFonts from '/imports/ui/bankFonts.js';

export default class Form extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            purpose: '',
            number: '',
            icon: '',
            active: false,
            loading: false,
            countrySelected: 'EN-gb'
        };
        this.countries = [
            { value: 'EN-gb', label: 'England' },
            { value: 'ES-es', label: 'Spain'},
            { value: 'TH-th', label: 'Thailand', disabled: true },
            { value: 'EN-en', label: 'USA'}
        ];

        this.icons = bankFonts.map((font, index) => {

            index++;
            if(index % 3 == 0){
                font.removeRightBorder = true
            }
            let lastItems = bankFonts.length % 3 == 0 ? 3 : bankFonts.length % 3;
            if(index > bankFonts.length - lastItems){
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
        const {name, purpose, number, icon} = this.state;
        Meteor.call('accounts.insert', {
            account: {
                name,
                purpose,
                number,
                icon
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
        const {_id, name, purpose, number, icon} = this.state;
        Meteor.call('accounts.update', {
            account: {
                _id,
                name,
                purpose,
                number,
                icon
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
    }
    onChangeParentCategory (val) {
        this.setState({parent: val});
    }
    accounts(){
        let cats = [{value: 'one', label: 'one', icon: ''}];
        return cats
    }
    categoryIcons(icon){
        let parentClass = '';

        if(icon.removeRightBorder){
            parentClass = dropdownTheme['removeRightBorder']
        }

        if(icon.removeBottomBorder){
            parentClass = dropdownTheme['removeBottomBorder']
        }

        return (
            <div className={parentClass}>
                <i className={icon.value}/>
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

    handleCountryChange (value) {
        this.setState({countrySelected: value});
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
                    onChange={this.handleCountryChange.bind(this)}
                    label='Select Country'
                    value={this.state.countrySelected}
                    />
                <Dropdown theme={dropdownTheme}
                          source={this.icons}
                          name='icon'
                          onChange={this.onChange.bind(this)}
                          value={this.state.icon}
                          label='Select Icon'
                          template={this.categoryIcons}
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