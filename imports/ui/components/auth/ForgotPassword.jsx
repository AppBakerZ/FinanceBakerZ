import React, { Component, PropTypes } from 'react';

import { Input, Button } from 'react-toolbox';
import { Link } from 'react-router'

import theme from './theme';
import {FormattedMessage, defineMessages} from 'react-intl';


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



export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isPassword: false,
            loading: false
        }
    }

    showEmail(){
        return(
            <form  onSubmit={this.onSubmit.bind(this)}  className="login" autoComplete={'off'}>
                <div className={theme.logoWithText}>
                    <img src={'../assets/images/logo-withText.png'} alt="Logo-with-text" />
                </div>
                <Input type='text' label={<FormattedMessage {...il8n.EMAIL} />}
                       name='EnterEmail'
                       maxLength={ 30 }
                       required
                    />
                <div className={theme.forgotBtn}>
                    <Button type='submit' disabled={this.props.loading}
                            label={<FormattedMessage {...il8n.SUBMIT_BUTTON} />} raised primary />
                    <Link to={`/`}>
                        <Button type='button'
                                label={<FormattedMessage {...il8n.BACK_BUTTON} />} raised accent />
                    </Link>
                </div>
            </form>
        )
    }

    showPassword(){
        return(
            <form  onSubmit={this.onSubmit.bind(this)}  className="login" autoComplete={'off'}>
                <div className={theme.logoWithText}>
                    <img src={'../assets/images/logo-withText.png'} alt="Logo-with-text" />
                </div>
                <Input type='password' label={<FormattedMessage {...il8n.ENTER_PASSWORD} />}
                       name='EnterNewPassword'
                       maxLength={ 30 }
                       required
                    />
                <Input type='password' label={<FormattedMessage {...il8n.RE_ENTER_PASSWORD} />}
                       name='Re-Enter New Password'
                       maxLength={ 30 }
                       required
                    />
                <div className={theme.forgotBtn}>
                    <Button type='button'
                            label={<FormattedMessage {...il8n.SAVE_BUTTON} />} raised primary />
                </div>
            </form>
        )
    }

    onSubmit(event){
        event.preventDefault();
        this.setState({isPassword: true});
    }

    render()
    {
        return (
            <div>
                {this.state.isPassword == false ? this.showEmail() : this.showPassword()}
            </div>
        )
    }

}