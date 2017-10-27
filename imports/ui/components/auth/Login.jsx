import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { routeHelpers } from '../../../helpers/routeHelpers'

import { IconButton, Input, Button } from 'react-toolbox';

import theme from './theme';
import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';


const il8n = defineMessages({
    USERNAMEOREMAIL: {
        id: 'SETTINGS.EMAIL'
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
class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fullName: '',
            email: '',
            password: '',
            loading: false
        }
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
    }

    onClick (){
        routeHelpers.changeRoute('/register');
    }

    forgotPassword (){
        routeHelpers.changeRoute('/forgotPassword');
    }

    onSubmit(event){
        event.preventDefault();

        const {email, password} = this.state;

        this.props.progressBarUpdate(true);

        Meteor.loginWithPassword({email}, password, (err) => {
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
                let useraccount = {account: {owner: Meteor.user()._id}};
                Meteor.call('profileAssets', useraccount);
                setTimeout(() => {
                    routeHelpers.changeRoute('/app/dashboard');
                }, 1000);
            }
            this.props.progressBarUpdate(false);
        });
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <form onSubmit={this.onSubmit.bind(this)} className="login" autoComplete={'off'}>
                <div className={theme.logoWithText}>
                    <img src={'../assets/images/logo-withText.png'} alt="Logo-with-text" />
                </div>
                <Input type='text' label={formatMessage(il8n.USERNAMEOREMAIL)}
                       name='email'
                       maxLength={ 30 }
                       value={this.state.email}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='password' label={formatMessage(il8n.PASSWORD)}
                       name='password'
                       maxLength={ 20 }
                       value={this.state.password}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <div className={theme.buttonParents}>
                    <div className={theme.buttonGroup}>
                        <Button type='submit' disabled={this.props.loading} icon='lock_open'
                                label={formatMessage(il8n.LOGIN_BUTTON)} raised primary />
                    </div>
                    <div className={theme.buttonGroup}>
                        <Button type='button' disabled={this.props.loading} onClick={this.onClick.bind(this)} icon='person_add'
                                label={formatMessage(il8n.REGISTER_BUTTON)} raised accent />
                    </div>
                </div>
                <div className={theme.forgotGroup}>
                    <a onClick={this.forgotPassword.bind(this)} > <FormattedMessage {...il8n.FORGOT_PASSWORD} /> </a>
                </div>
            </form>
        );
    }
}

Register.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(Register);