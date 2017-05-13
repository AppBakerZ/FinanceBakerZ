import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { IconButton, Input, Button } from 'react-toolbox';

import { Link } from 'react-router'

import { Accounts } from 'meteor/accounts-base'

import theme from './theme';
import {FormattedMessage, defineMessages} from 'react-intl';


const il8n = defineMessages({
    USERNAMEOREMAIL: {
        id: 'LOGIN.USERNAMEOREMAIL'
    },
    PASSWORD: {
        id: 'LOGIN.PASSWORD'
    },
    LOGIN_BUTTON: {
        id: 'LOGIN.LOGIN_BUTTON'
    },
    REGISTER_BUTTON: {
        id: 'LOGIN.REGISTER_BUTTON'
    },
    FORGOT_PASSWORD: {
        id: 'LOGIN.FORGOT_PASSWORD'
    }
});


// App component - represents the whole app
export default class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fullName: '',
            usernameOrEmail: '',
            password: '',
            loading: false
        }
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
    }

    onClick (){
        this.props.history.push('/register');
    }

    forgotPassword (){
        this.props.history.push('/forgotPassword');
    }

    onSubmit(event){
        event.preventDefault();

        const {usernameOrEmail, password} = this.state;
        let user;
        if (typeof usernameOrEmail === 'string')
            if (usernameOrEmail.indexOf('@') === -1)
                user = {username: usernameOrEmail};
            else
                user = {email: usernameOrEmail};

        this.props.progressBarUpdate(true);

        Meteor.loginWithPassword(user, password, (err) => {
            if(err){
                this.props.showSnackbar({
                    activeSnackbar: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }else{
                this.props.showSnackbar({
                    activeSnackbar: true,
                    barMessage: 'Successfully Loggedin',
                    barIcon: 'done',
                    barType: 'accept'
                });
                var useraccount = {account: {owner: Meteor.user()._id}};
                Meteor.call('profileAssets', useraccount);
                setTimeout(() => {
                    this.props.history.push('/app/dashboard');
                }, 1000);
            }
            this.props.progressBarUpdate(false);
        });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit.bind(this)} className="login" autoComplete={'off'}>
                <div className={theme.logoWithText}>
                    <img src={'../assets/images/logo-withText.png'} alt="Logo-with-text" />
                </div>
                <Input type='text' label={<FormattedMessage {...il8n.USERNAMEOREMAIL} />}
                       name='usernameOrEmail'
                       maxLength={ 30 }
                       value={this.state.usernameOrEmail}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='password' label={<FormattedMessage {...il8n.PASSWORD} />}
                       name='password'
                       maxLength={ 20 }
                       value={this.state.password}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <div className={theme.buttonParents}>
                    <div className={theme.buttonGroup}>
                        <Button type='submit' disabled={this.props.loading} icon='lock_open'
                                label={<FormattedMessage {...il8n.LOGIN_BUTTON} />} raised primary />
                    </div>
                    <div className={theme.buttonGroup}>
                        <Button type='button' disabled={this.props.loading} onClick={this.onClick.bind(this)} icon='person_add'
                                label={<FormattedMessage {...il8n.REGISTER_BUTTON} />} raised accent />
                    </div>
                </div>
                <div className={theme.forgotGroup}>
                    <a onClick={this.forgotPassword.bind(this)} > <FormattedMessage {...il8n.FORGOT_PASSWORD} /> </a>
                </div>
            </form>
        );
    }
}