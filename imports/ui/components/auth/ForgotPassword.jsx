import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base'
import { routeHelpers } from '/imports/helpers/routeHelpers'

import { Input, Button, ProgressBar, Snackbar} from 'react-toolbox';
import { Link } from 'react-router'

import theme from './theme';
import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';


const il8n = defineMessages({
    EMAIL: {
        id: 'FORGOTPASSWORD.EMAIL'
    },
    SUBMIT_BUTTON: {
        id: 'FORGOTPASSWORD.SUBMIT_BUTTON'
    },
    BACK_BUTTON: {
        id: 'FORGOTPASSWORD.BACK_BUTTON'
    },
    ENTER_PASSWORD: {
        id: 'FORGOTPASSWORD.ENTER_PASSWORD'
    },
    RE_ENTER_PASSWORD: {
        id: 'FORGOTPASSWORD.RE_ENTER_PASSWORD'
    },
    SAVE_BUTTON: {
        id: 'FORGOTPASSWORD.SAVE_BUTTON'
    }
});



class ForgotPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            newPassword: '',
            confirmPassword: '',
            isToken: props.params.token || false,
            loading: false,
            active: false,
        }
    }

    showEmail(){
        const { formatMessage } = this.props.intl;
        return(
            <form  onSubmit={this.onSubmit.bind(this, 'forgotPassword')}  className="login" autoComplete={'off'}>
                <div className={theme.logoWithText}>
                    <img src={'../assets/images/logo-withText.png'} alt="Logo-with-text" />
                </div>
                <Input type='email' label={formatMessage(il8n.EMAIL)}
                       default
                       name='email'
                       value={this.state.email}
                       onChange={this.onChange.bind(this)}
                       maxLength={ 30 }
                       required
                    />
                <div className={theme.forgotBtn}>
                    <Button type='submit' disabled={this.state.loading}
                            label={formatMessage(il8n.SUBMIT_BUTTON)} raised primary />
                    <Link to={`/`}>
                        <Button type='button'
                                label={formatMessage(il8n.BACK_BUTTON)} raised accent />
                    </Link>
                </div>
            </form>
        )
    }

    showPassword(){
        const { formatMessage } = this.props.intl;
        return(
            <form onSubmit={this.onSubmit.bind(this, 'resetPassword')}  className="login" autoComplete={'off'}>
                <div className={theme.logoWithText}>
                    <img src={'../assets/images/logo-withText.png'} alt="Logo-with-text" />
                </div>
                <Input type='password' label={formatMessage(il8n.ENTER_PASSWORD)}
                       name='newPassword'
                       value={this.state.newPassword}
                       onChange={this.onChange.bind(this)}
                       maxLength={ 30 }
                       required
                    />
                <Input type='password' label={formatMessage(il8n.RE_ENTER_PASSWORD)}
                       name='confirmPassword'
                       value={this.state.confirmPassword}
                       onChange={this.onChange.bind(this)}
                       maxLength={ 30 }
                       required
                    />
                <div className={theme.forgotBtn}>
                    <Button type='submit' disabled={this.state.loading}
                            label={formatMessage(il8n.SAVE_BUTTON)} raised primary />
                </div>
            </form>
        )
    }

    forgotPassword(){
        let { email } = this.state;

        Accounts.forgotPassword({email}, (err, response) => {
            if(!err){
                this.setState({
                    active: true,
                    barMessage: 'A confirmation email sent to your email address.',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }else{
                this.setState({
                    disableButton: false,
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
            this.setState({
                loading: false,
                email: ''
            });
        });
    }

    resetPassword(){
        let { newPassword, confirmPassword, isToken} = this.state;
        if(newPassword !== confirmPassword){
            this.setState({
                disableButton: false,
                active: true,
                loading: false,
                barMessage: 'Passwords do not match',
                barIcon: 'error_outline',
                barType: 'cancel'
            });
            return false;
        }
        Accounts.resetPassword(isToken, newPassword, (err, response) => {
            console.log(err);
            console.log(response);
            if(!err){
                let obj = {
                    email: {
                        to: 'raza2022@gmail.com',
                        subject: 'Password Changed',
                        template: 'passwordChanged.html',
                    }
                };
                Meteor.call('emails.send', obj, function(err, res){
                    console.log(err)
                    console.log(res)
                });
                routeHelpers.changeRoute('/login', 1200);
                this.setState({
                    active: true,
                    barMessage: 'Password updated successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }else{
                this.setState({
                    disableButton: false,
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
            this.setState({
                loading: false,
                newPassword: '',
                confirmPassword: ''
            });
        });
    }

    onSubmit(type, event){
        this.setState({
            loading: true
        });
        event.preventDefault();
        type === 'forgotPassword' ? this.forgotPassword() : this.resetPassword();
    }

    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
    }

    render()
    {
        return (
            <div>
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
                {this.state.isToken === false ? this.showEmail() : this.showPassword()}
            </div>
        )
    }

}

ForgotPassword.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(ForgotPassword);