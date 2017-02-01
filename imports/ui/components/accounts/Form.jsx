import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { Input, Button, ProgressBar, Snackbar } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';

export default class Form extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            purpose: '',
            number: '',
            icon: '',
            active: false,
            loading: false
        };
    }
    onSubmit(event){
        event.preventDefault();
        this.props.account ? this.updateAccount() : this.createAccount();
        this.setState({loading: true})
    }
    createAccount(){
        const {name, purpose, number, icon} = this.state;
        Meteor.call('accounts.insert', {
            account: {
                name,
                purpose,
                number,
                icon
            }
        }, (err, response) => {
            if(response){
                this.setState({
                    active: true,
                    barMessage: 'Account created successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
                setTimeout(()=> {
                    this.props.closePopup();
                }, 1000)
            }else{
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
            this.setState({loading: false})
        });
    }
    updateAccount(){
        const {_id, name, purpose, number, icon} = this.state;
        Meteor.call('accounts.update', {
            account: {
                _id,
                name,
                purpose,
                number,
                icon
            }
        }, (err, response) => {
            if(err){
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }else{
                this.setState({
                    active: true,
                    barMessage: 'Account updated successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
                this.props.closePopup();
            }
            this.setState({loading: false})
        });
    }
    onChange (val, e) {
        this.setState({[e.target.name]: val});
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
    componentDidMount (){
        this.setState(this.props.account);
    }
    renderButton (){
        let button;
        if(!this.props.account){
            button = <Button type='submit' icon='add' label='Add Account' raised primary />
        }else{
            button = <Button type='submit' icon='mode_edit' label='Update Account' raised primary />
        }
        return button;
    }
    render() {
        return (
            <form onSubmit={this.onSubmit.bind(this)} className="add-account">
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

                <Input type='text' label='Name'
                       name='name'
                       maxLength={ 25 }
                       value={this.state.name}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='text' label='Purpose'
                       name='purpose'
                       maxLength={ 50 }
                       value={this.state.purpose}
                       onChange={this.onChange.bind(this)}
                    />
                <Input type='text' label='Number'
                       name='number'
                       value={this.state.number}
                       onChange={this.onChange.bind(this)}
                    />
                <Input type='text' label='Icon'
                       name='icon'
                       value={this.state.icon}
                       onChange={this.onChange.bind(this)}
                    />
                {this.renderButton()}
            </form>
        );
    }
}