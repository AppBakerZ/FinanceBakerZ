import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { IconButton, Input, Button } from 'react-toolbox';

import { Link } from 'react-router'

import { Accounts } from 'meteor/accounts-base'

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
                setTimeout(() => {
                    this.props.history.push('/app/dashboard');
                }, 1000);
                this.props.progressBarUpdate(false);
            }
        });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit.bind(this)} className="login">
                <Input type='text' label='Username or Email'
                       name='usernameOrEmail'
                       maxLength={ 30 }
                       value={this.state.usernameOrEmail}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='password' label='Password'
                       name='password'
                       maxLength={ 20 }
                       value={this.state.password}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Button disabled={this.props.loading} icon='lock_open' label='Login' raised primary />
                <Link
                    className='float-right'
                    to={`/register`}>
                    <Button icon='person_add' label='Register' />
                </Link>
            </form>
        );
    }
}