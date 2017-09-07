import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Input, Button, ProgressBar, Snackbar, Dropdown, Checkbox } from 'react-toolbox';
import { Card} from 'react-toolbox/lib/card';

import { Meteor } from 'meteor/meteor';

import theme from './theme';
import checkboxTheme from './checkboxTheme.scss';
import { Accounts } from 'meteor/accounts-base';
import currencyIcon from '/imports/ui/currencyIcon.js';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';

const il8n = defineMessages({
    TITLE: {
        id: 'SETTINGS.TITLE'
    },
    PERSONAL_INFORMATION: {
        id: 'SETTINGS.PERSONAL_INFORMATION'
    },
    ACCOUNT_SETTINGS: {
        id: 'SETTINGS.ACCOUNT_SETTINGS'
    },
    CHANGE_PASSWORD: {
        id: 'SETTINGS.CHANGE_PASSWORD'
    },
    REMOVE_ACCOUNT: {
        id: 'SETTINGS.REMOVE_ACCOUNT'
    },
    INFORM_MESSAGE: {
        id: 'SETTINGS.INFORM_MESSAGE'
    },
    CONFIRMATION_MESSAGE: {
        id: 'SETTINGS.CONFIRMATION_MESSAGE'
    },
    BACK_BUTTON: {
        id: 'SETTINGS.BACK_BUTTON'
    },
    REMOVE_BUTTON: {
        id: 'SETTINGS.REMOVE_BUTTON'
    },
    SELECT_CURRENCY:{
        id: 'SETTINGS.SELECT_CURRENCY'
    },
    SELECT_LANGUAGE:{
        id: 'SETTINGS.SELECT_LANGUAGE'
    },
    UPDATE_BUTTON:{
        id: 'SETTINGS.UPDATE_BUTTON'
    },
    NAME:{
        id: 'SETTINGS.NAME'
    },
    CONTACT_NUMBER:{
        id: 'SETTINGS.CONTACT_NUMBER'
    },
    USER:{
        id: 'SETTINGS.USER_NAME'
    },
    EMAIL:{
        id: 'SETTINGS.EMAIL'
    },
    ADDRESS:{
        id: 'SETTINGS.ADDRESS'
    },
    EDIT_INFO:{
        id: 'SETTINGS.EDIT_INFO'
    },
    CURRENCY:{
        id: 'SETTINGS.CURRENCY'
    },
    LANGUAGE:{
        id: 'SETTINGS.LANGUAGE'
    },
    EMAIL_NOTIFICATION:{
        id: 'SETTINGS.EMAIL_NOTIFICATION'
    },
    REMOVE_ACCOUNT_BUTTON:{
        id: 'SETTINGS.REMOVE_ACCOUNT_BUTTON'
    },
    PASSWORD:{
        id: 'SETTINGS.PASSWORD'
    },
    USER_NAME:{
        id: 'SETTINGS.USERNAME'
    },
    USER_CONTACT_NUMBER:{
        id: 'SETTINGS.USER_CONTACT_NUMBER'
    },
    USER_USER_NAME:{
        id: 'SETTINGS.USER_USER_NAME'
    },
    USER_EMAIL:{
        id: 'SETTINGS.USER_EMAIL'
    },
    USER_ADDRESS:{
        id: 'SETTINGS.USER_ADDRESS'
    },
    EDIT_PERSONAL_INFO:{
        id: 'SETTINGS.EDIT_PERSONAL_INFO'
    },
    EDIT_ACCOUNT_SETTINGS:{
        id: 'SETTINGS.EDIT_ACCOUNT_SETTINGS'
    },
    CHANGE_USER_PASSWORD:{
        id: 'SETTINGS.CHANGE_USER_PASSWORD'
    },
    CURRENT_PASSWORD:{
        id: 'SETTINGS.CURRENT_PASSWORD'
    },
    NEW_PASSWORD:{
        id: 'SETTINGS.NEW_PASSWORD'
    },
    REPEAT_NEW_PASSWORD:{
        id: 'SETTINGS.REPEAT_NEW_PASSWORD'
    },
    SAVE_BUTTON:{
        id: 'SETTINGS.SAVE_BUTTON'
    },
    EDIT_IMAGE_BUTTON:{
        id: 'SETTINGS.EDIT_IMAGE_BUTTON'
    },
    EDIT_ACCOUNT_SETTINGS_BUTTON:{
        id: 'SETTINGS.EDIT_ACCOUNT_SETTINGS_BUTTON'
    }
});



class editSettingsPage extends Component {

    constructor(props) {
        super(props);

        let { userInfo } = props;

        this.state = {
            active: false,
            loading: false,
            disableButton: false,
            currency: userInfo.profile.currency || '',
            language: userInfo.profile.language || '',
            check1: userInfo.profile.emailNotification,
            check2: !userInfo.profile.emailNotification,
            name: userInfo.profile.fullName,
            number: userInfo.profile.contactNumber || '',
            username: userInfo.username ? userInfo.username :'',
            email: userInfo.emails ? userInfo.emails[0].address :'',
            address: userInfo.profile.address || '',
            imageUrl: ''

        };

        this.languages = [
            { label: 'English', value: 'en', direction: 'ltr' },
            { label: 'Urdu', value: 'ur', direction: 'rtl' }
        ]
    }

    setLanguage (value){
        const language = _.findWhere(this.languages, {value: value});
        this.setState({language});
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
        this.setState({loading: true});
        const { passwordChanged } = this.state;
        if( passwordChanged ){
            const { oldPassword, newPassword, alterPassword} = this.state;
            if(newPassword !== alterPassword){
                this.setState({
                    active: true,
                    barMessage: 'Passwords do not match',
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
            Accounts.changePassword(oldPassword, newPassword, (err)=> {
                this.setState({
                    passwordChanged : false
                });
                if(!err){
                    this.setState({oldPassword: '', newPassword: '', alterPassword: ''});
                }
                else{
                    this.setState({
                        active: true,
                        barMessage: err.reason,
                        barIcon: 'done',
                        barType: 'accept'
                    });
                    return false;
                }
                this.updateUserProfile();
            })
        }
        else{
            this.updateUserProfile();
        }
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
    }

    handleChange (field, value) {
        if(field === 'check1') this.setState({'check2': false});
        else this.setState({'check1': false});
        this.setState({[field]: value});
    }

    passwordChange (field, value) {
        this.setState({
            passwordChanged : true
        });
        this.setState({[field]: value});
    }

    updateUserProfile () {
        //TODO: image implementation remaining
        const { name, number, email, address, username, currency, language, check1 } = this.state;
        let info = {users: {
            name, number, email, address, username, currency, language, check1
        }};

        Meteor.call('settings.updateUserProfile', info, (err) => {
            if(err){
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
            else{
                this.setState({
                    active: true,
                    barMessage: 'Profile updated successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
            this.setState({loading: false});
        });
    }

    setCurrency(currency){
        currencyItem = _.findWhere(currencyIcon, {value: currency});
        this.setState({currency: currencyItem});
    }

    CurrencyChange (val, e) {
        this.setState({[e.target.name]: val});
        e.target.name === 'currency' && this.setCurrency(val)
    }

    currencyItem (currency) {
        return (
            <div className={theme.currencyIcons}>
                <i className= {currency.value}></i>
                <div>
                    <strong>{currency.label}</strong>
                </div>
            </div>
        );
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.incomeCard}>
                <Card theme={theme}>
                    {/*<h3>{this.state.isNew ? <FormattedMessage {...il8n.ADD_ACCOUNTS_BUTTON} /> : <FormattedMessage {...il8n.UPDATE_ACCOUNTS_BUTTON} />}</h3>*/}
                    <h3>Settings Update</h3>
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

                        <h4 className={theme.clientHeading}><FormattedMessage {...il8n.PERSONAL_INFORMATION} /></h4>

                        <Input type='text' label={<FormattedMessage {...il8n.NAME} />}
                               name='name'
                               value={this.state.name}
                               onChange={this.onChange.bind(this)}
                        />

                        <Input type='text' label={<FormattedMessage {...il8n.CONTACT_NUMBER} />}
                               name='number'
                               value={this.state.number}
                               onChange={this.onChange.bind(this)}
                        />

                        <Input type='text' label={<FormattedMessage {...il8n.USER} />}
                               name='username'
                               value={this.state.username}
                               onChange={this.onChange.bind(this)}
                        />

                        <Input type='text' label={<FormattedMessage {...il8n.EMAIL} />}
                               name='email'
                               value={this.state.email}
                               onChange={this.onChange.bind(this)}
                        />

                        <Input type='text' label={<FormattedMessage {...il8n.ADDRESS} />}
                               name='address'
                               value={this.state.address}
                               onChange={this.onChange.bind(this)}
                        />

                        <h4 className={theme.clientHeading}><FormattedMessage {...il8n.ACCOUNT_SETTINGS} /></h4>

                        <Dropdown theme={theme} className={theme.projectStatus}
                                  auto={false}
                                  source={currencyIcon}
                                  name='currency'
                                  onChange={this.CurrencyChange.bind(this)}
                                  label={formatMessage(il8n.SELECT_CURRENCY)}
                                  value={this.state.currency.value}
                                  template={this.currencyItem}
                                  required
                        />

                        <Dropdown theme={theme} className={theme.projectStatus}
                                  source={this.languages}
                                  label={formatMessage(il8n.SELECT_LANGUAGE)}
                                  onChange={this.setLanguage.bind(this)}
                                  value={this.state.language.value}
                                  template={this.languageItem}
                        />

                        <div>
                            <h6 className={theme.emailNotification}>
                                <FormattedMessage {...il8n.EMAIL_NOTIFICATION} />
                                <span>
                                        <Checkbox theme={checkboxTheme} className={theme.notificationCheckbox}
                                                  checked={this.state.check1}
                                                  label="On"
                                                  onChange={this.handleChange.bind(this, 'check1')}
                                        />
                                         <Checkbox theme={checkboxTheme} className={theme.notificationCheckbox}
                                                   checked={this.state.check2}
                                                   label="Off"
                                                   onChange={this.handleChange.bind(this, 'check2')}
                                         />
                                    </span>
                            </h6>
                        </div>

                        <h4 className={theme.clientHeading}><FormattedMessage {...il8n.CHANGE_PASSWORD} /></h4>

                        <Input type='password' label={formatMessage(il8n.CURRENT_PASSWORD)}
                               name='oldPassword'
                               value={this.state.oldPassword}
                               onChange={this.passwordChange.bind(this, 'oldPassword')}
                        />

                        <Input type='password' label={formatMessage(il8n.NEW_PASSWORD)}
                               name='newPassword'
                               value={this.state.newPassword}
                               onChange={this.passwordChange.bind(this, 'newPassword')}
                        />

                        <Input type='password' label={formatMessage(il8n.REPEAT_NEW_PASSWORD)}
                               name='alterPassword'
                               value={this.state.alterPassword}
                               onChange={this.passwordChange.bind(this, 'alterPassword')}
                        />

                        <div className={theme.addBtn}><Button type='submit' icon='mode_edit' label={formatMessage(il8n.UPDATE_BUTTON)} raised primary /></div>

                    </form>
                </Card>
            </div>
        );
    }
}

editSettingsPage.propTypes = {
    intl: intlShape.isRequired
};

editSettingsPage = createContainer((props) => {
    const user = Meteor.user();
    return {
        userInfo: user ? user : {}
    };
}, editSettingsPage);

export default injectIntl(editSettingsPage);
