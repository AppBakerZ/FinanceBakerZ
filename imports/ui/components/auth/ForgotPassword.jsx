import React, { Component, PropTypes } from 'react';

import { Input, Button } from 'react-toolbox';

import theme from './theme';

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

render()
{
    return (
        <form className="login" autoComplete={'off'}>
            <div className={theme.logoWithText}>
                <img src={'../assets/images/logo-withText.png'} alt="Logo-with-text" />
            </div>
            <Input type='password' label='Enter New Password'
                   name='EnterNewPassword'
                   maxLength={ 30 }
                   required
                />
            <Input type='password' label='Re-Enter New Password'
                   name='Re-Enter New Password'
                   maxLength={ 30 }
                   required
                />
            <div className={theme.forgotBtn}>
                <Button type='button'
                        label='Save' raised primary />
            </div>
        </form>
    );
}

}