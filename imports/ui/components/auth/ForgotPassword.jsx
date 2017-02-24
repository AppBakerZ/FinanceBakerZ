import React, { Component, PropTypes } from 'react';

import { Input, Button } from 'react-toolbox';

import theme from './theme';

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
            <Input type='text' label='Enter your email'
                   name='EnterEmail'
                   maxLength={ 30 }
                   required
                />
                <Button type='submit' disabled={this.props.loading} icon='lock_open'
                        label='submit' raised primary />
            </form>

        )
    }


    showPassword(){
        return(
            <form  onSubmit={this.onSubmit.bind(this)}  className="login" autoComplete={'off'}>
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