import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { List, ListItem, Button, IconButton, ListSubHeader, Dropdown, Card, Checkbox, Dialog, ProgressBar, Input, Snackbar } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';

import theme from './theme';
import cardTheme from './cardTheme';
import checkboxTheme from './checkboxTheme';
import buttonTheme from './buttonTheme';
import dialogTheme from './dialogTheme';
import { Accounts } from 'meteor/accounts-base';

import currencyIcon from '/imports/ui/currencyIcon.js';

class SettingsPage extends Component {

    constructor(props) {
        super(props);
          let userInfo = Meteor.user();
        this.state = {
            userCurrency: userInfo.profile.currency ? userInfo.profile.currency.symbol : '',
            languageSelected: userInfo.profile.language || '',
            currencies: [],
            check1: userInfo.profile.emailNotification,
            check2: !userInfo.profile.emailNotification,
            name: userInfo.profile.fullName,
            active: true,
            loading: false,
            number: userInfo.profile.contactNumber || '' ,
            username: userInfo.username || '',
            email: userInfo.emails && userInfo.emails.length ? userInfo.emails[0].address : '',
            address: userInfo.profile.address || ''
        }

        this.languages = [
            { value: 'en', label: 'English' },
            { value: 'ar', label: 'Arabic'}
        ]
    }
    handleChange (field, value) {
        if(field == 'check1') this.setState({'check2': false});
        else this.setState({'check1': false});
        this.setState({[field]: value});
        this.emailNotify();
    }

    emailNotify(){
        const {check2} = this.state;
        let useraccount = {account: {check2, owner: Meteor.user()._id}};
        Meteor.call('emailNotificaton', useraccount, (err) => {
            if(err){
                console.log(err);
            }
        });
    }

    componentWillMount() {
        Meteor.call("get.currencies",{}, (error, currencies) => {
            if(error) {
                // handle error
            } else {
                this.setState({ currencies });
            }
        });
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
        e.target.name == 'userCurrency' && this.setCurrency(val)
    }


    userRemove () {
        if(!Meteor.userId()) return;
        var user = {account: {owner: Meteor.userId()}};
        Meteor.call('userRemove', user, (err, res) => {
            if(err) {

            }
             else {
                this.props.history.push('/login');
            }
        });

    }



    setCurrency(currency){
        currencyItem = _.findWhere(this.state.currencies, {symbol: currency});
        delete currencyItem['value'];
        this.setState({currencyObj:currencyItem});
    }



    currencies(){
        return this.state.currencies.map((currency) => {
            currency.value = currency.symbol;
            return currency;
        })
    }

    currencyItem (currency) {
        return (
            <div className={theme.currencyIcons}>
                <i className= {"currency-" + currency.name.replace(" ", "-") }></i>
                <div>
                    <strong>{currency.name}</strong>
                </div>
            </div>
        );
    }

    handleLanguageChange (value){
        this.setState({languageSelected: value});
    }

    renderCategory(){
        return (
            <section>
                <Dropdown
                    auto={false}
                    source={this.currencies()}
                    name='userCurrency'
                    onChange={this.onChange.bind(this)}
                    label='Select your currency'
                    value={this.state.userCurrency}
                    template={this.currencyItem}
                    required
                    />
            </section>
        )
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


    changePassword(event){
        event.preventDefault();
        const {oldPassword, newPassword, alterPassword} = this.state;
        if(newPassword != alterPassword){
            console.log("you have entered the wrong password");
        }
        else{
            Accounts.changePassword(oldPassword, newPassword, (err)=> {
                    if(!err){
                        this.setState({oldPassword: '', newPassword: '', alterPassword: ''});
                        this.closePopup();
                    }
                }
            )
        }

    }

    updateProfile (event) {
        event.preventDefault();
        const {name, number, email, address, username} = this.state;
        let info = {users: {name, number, email, address, username}};
        Meteor.call('updateProfile', info, (err) => {
            this.closePopup();
        })
    }

    updateAccountSettings (event) {
        event.preventDefault();
        const {currencyObj, languageSelected} = this.state;
        let accountinfo = {settings: {currencyObj, languageSelected }};
           Meteor.call('updateAccountSettings', accountinfo, (err) => {
            this.closePopup();
        })
    }

    onSubmit(event){
        event.preventDefault();
        this.props.account ? this.updateAccount() : this.createAccount();
        this.setState({loading: true})
    }

    progressBarToggle (){
        return this.state.loading ? 'progress-bar' : 'progress-bar hide';
    }

    switchPopupTemplate(){
        switch (this.state.action){
            case 'remove':
                return this.renderConfirmationMessage();
                break;
            case 'personalInformation':
                return (
                    <form onSubmit={this.updateProfile.bind(this)} className={theme.addAccount}>
                        <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />
                        <h3 className={theme.titleSetting}>edit Personal Information</h3>
                        <Input type='text' label='Name'
                               name='name'
                               maxLength={ 25 }
                               value={this.state.name}
                               onChange={this.onChange.bind(this)}
                               required
                            />
                        <Input type='text' label='Contact Number'
                               name='number'
                               maxLength={ 50 }
                               value={this.state.number}
                               onChange={this.onChange.bind(this)}
                            />
                        {Meteor.user().username ?

                        <Input type='text' label='Username'
                               name= 'username'
                               value={this.state.username}
                               onChange={this.onChange.bind(this)}
                               required
                            />
                            :
                        <Input type='email' label='Email'
                               name= 'email'
                               value={this.state.email}
                               onChange={this.onChange.bind(this)}
                               required
                            />
                        }
                        <Input type='text' label='Address'
                               name='address'
                               value={this.state.address}
                               onChange={this.onChange.bind(this)}
                            />
                        <div className={theme.updateBtn}>
                            <Button type='submit' label='UPDATE' raised primary />
                        </div>

                    </form>
                );
                break;
            case 'accountSetting':
                return (
                    <form onSubmit={this.updateAccountSettings.bind(this)} className={theme.addAccount}>
                        <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />
                        <h3 className={theme.titleSetting}>edit Account Settings</h3>
                        <section>
                            <Dropdown
                                auto={false}
                                source={this.currencies()}
                                name='userCurrency'
                                onChange={this.onChange.bind(this)}
                                label='Select your currency'
                                value={this.state.userCurrency}
                                template={this.currencyItem}
                                required
                                />
                        </section>

                        <Dropdown
                            source={this.languages}
                            label='Select Language'
                            onChange={this.handleLanguageChange.bind(this)}
                            value={this.state.languageSelected}
                            />

                        <div className={theme.updateBtn}>
                            <Button type='submit' label='UPDATE' raised primary />
                        </div>
                    </form>
                );
                break;
            case 'changePassword':
                return (
                    <form onSubmit={this.changePassword.bind(this)} className={theme.addAccount}>
                        <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />
                        <h3 className={theme.titleSetting}>change password</h3>

                        <Input type='password' label='Enter Your Current Password'
                               name='oldPassword'
                               value={this.state.oldPassword}
                               onChange={this.onChange.bind(this)}
                            />

                        <Input type='password' label='Enter Your New Password'
                               name='newPassword'
                               value={this.state.newPassword}
                               onChange={this.onChange.bind(this)}
                            />

                        <Input type='password' label='Repeat Your New Password'
                               name='alterPassword'
                               value={this.state.alterPassword}
                               onChange={this.onChange.bind(this)}
                            />

                            <div className={theme.saveBtn}>
                                <Button type='submit' label='SAVE' raised primary disabled={!(this.state.oldPassword && this.state.newPassword && this.state.alterPassword)}/>
                            </div>
                    </form>
                );
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
            <div className={theme.dialogSetting}>
                <div className={theme.confirmText}>
                    <h3>remove account</h3>
                    <p>This will remove your all data</p>
                    <p>Are you sure to remove your account?</p>
                </div>

                <div className={theme.buttonBox}>
                    <Button label='GO BACK' raised primary onClick={this.closePopup.bind(this)} />
                    <Button label='YES, REMOVE' raised onClick={this.userRemove.bind(this)} theme={buttonTheme}/>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
                    <div className={theme.settingContent}>
                        <div className={theme.settingTitle}>
                            <h3>Settings</h3>
                        </div>
                        <Card theme={cardTheme}>
                            <div className={theme.cardTitle}>
                                <h5>personal information</h5>
                            </div>
                            <div className={theme.cardContent}>
                                <h6>name: <span>{Meteor.user().profile.fullName || 'Not Available'}</span></h6>
                                <h6>Contact Number: <span> {Meteor.user().profile.contactNumber || 'Not Available'}</span></h6>
                                <h6> <span> {Meteor.user().username ? 'Username:' : 'Email:' } </span> {Meteor.user().username ? Meteor.user().username : Meteor.user().emails[0].address }</h6>
                                <h6>Address: <span> {Meteor.user().profile.address || 'Not Available'}</span></h6>
                                <div className={theme.settingBtn}>
                                    <Button label='EDIT INFO' raised accent onClick={this.openPopup.bind(this, 'personalInformation')} />
                                </div>
                            </div>
                        </Card>
                        <Card theme={cardTheme}>
                            <div className={theme.cardTitle}>
                                <h5>account settings</h5>
                            </div>
                            <div className={theme.cardContent}>
                                <h6>currency: <span>{Meteor.user().profile.currency.name || 'Not Available'} </span></h6>
                                <h6>language: <span> {Meteor.user().profile.language || 'Not Available'}</span></h6>
                                <h6>
                                    email notification:
                                    <span>
                                        <Checkbox theme={checkboxTheme}
                                            checked={this.state.check1}
                                            label="On"
                                            onChange={this.handleChange.bind(this, 'check1')}
                                            />
                                         <Checkbox theme={checkboxTheme}
                                             checked={this.state.check2}
                                             label="Off"
                                             onChange={this.handleChange.bind(this, 'check2')}
                                             />
                                    </span>
                                </h6>
                                <div className={theme.settingBtn}>
                                    <Button label='EDIT INFO' raised accent onClick={this.openPopup.bind(this, 'accountSetting')} />
                                </div>
                            </div>
                        </Card>

                        <Card theme={cardTheme}>
                            <div className={theme.cardTitle}>
                                <h5>Change Password</h5>
                            </div>
                            <div className={theme.cardContent}>
                                <h6>Password: <span>*********</span></h6>
                                <div className={theme.editBtn}>
                                    <Button label='EDIT INFO' raised accent onClick={this.openPopup.bind(this, 'changePassword')} />
                                </div>
                            </div>
                        </Card>

                        <div className={theme.buttonSite}>
                            <Button
                                label='REMOVE ACCOUNT'
                                onClick={this.openPopup.bind(this, 'remove')}
                                icon=''
                                raised
                                theme={buttonTheme} />
                        </div>
                    </div>
                        {this.popupTemplate()}
                </div>
            </div>
        );
    }
}

SettingsPage.propTypes = {
    categories: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('categories');

    return {
        categories: Categories.find({}).fetch()
    };
}, SettingsPage);