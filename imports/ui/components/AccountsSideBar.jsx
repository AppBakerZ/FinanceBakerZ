import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Button, ProgressBar, Snackbar } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';

export default class AccountsSideBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            account: {
                name: '',
                purpose: '',
                icon: ''
            },
            active: false,
            isActiveRoute: this.props.history.isActive('accounts/new')
        };

        if(this.state.isActiveRoute){
            this.resetAccount()
        }
    }

    resetAccount(){
        this.setState({
            account: {
                name: '',
                purpose: '',
                icon: ''
            }
        })
    }

    onSubmit(event){
        event.preventDefault();
        this.createAccount();
    }

    createAccount(){
        Meteor.call('accounts.insert', {account: this.state.account}, (err, response) => {
            if(response){
                this.setState({
                    active: true,
                    barMessage: 'Account created successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
                this.resetAccount();
            }else{

            }
        });
    }

    updateAccount(){

    }

    onChange (val, e) {
        this.state.account[e.target.name] = val;
        this.setState({account: this.state.account});
    }

    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit.bind(this)} className="add-account">

                <ProgressBar type="linear" mode="indeterminate" multicolor />

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

                <Input type='text' label='Name'
                       name='name'
                       maxLength={ 25 }
                       value={this.state.account.name}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='text' label='Purpose'
                       name='purpose'
                       maxLength={ 50 }
                       value={this.state.account.purpose}
                       onChange={this.onChange.bind(this)}
                    />
                <Input type='text' label='Icon'
                       name='icon'
                       value={this.state.account.icon}
                       onChange={this.onChange.bind(this)}
                    />
                <Button icon='add' label='Add Account' raised primary />
            </form>
        );
    }
}