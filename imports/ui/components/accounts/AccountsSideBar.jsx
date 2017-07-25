import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';

import { Input, Button, ProgressBar, Snackbar } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';
import {FormattedMessage, defineMessages} from 'react-intl';


const il8n = defineMessages({
    ADD_ACCOUNTS_BUTTON: {
        id: 'ACCOUNTS.ADD_ACCOUNTS_BUTTON'
    },
    REMOVE_ACCOUNTS_BUTTON: {
        id: 'ACCOUNTS.REMOVE_ACCOUNTS_BUTTON'
    },
    UPDATE_ACCOUNTS_BUTTON: {
        id: 'ACCOUNTS.UPDATE_ACCOUNTS_BUTTON'
    }
});


class AccountsSideBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            purpose: '',
            icon: '',
            active: false,
            loading: false
        };
    }

    setCurrentRoute(){
        this.setState({
            isNewRoute: this.props.history.isActive('app/accounts/new')
        })
    }

    resetAccount(){
        this.setState({
            name: '',
            purpose: '',
            icon: ''
        })
    }


    onSubmit(event){
        event.preventDefault();
        this.state.isNewRoute ? this.createAccount() : this.updateAccount();
        this.setState({loading: true})
    }

    createAccount(){
        const {name, purpose, icon} = this.state;
            Meteor.call('accounts.insert', {
            account: {
                name,
                purpose,
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
                this.resetAccount();
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
        const {_id, name, purpose, icon} = this.state;
        Meteor.call('accounts.update', {
            account: {
                _id,
                name,
                purpose,
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
            }
            this.setState({loading: false})
        });
    }

    removeAccount() {
        const {_id} = this.state;
            Meteor.call('accounts.remove', {
                account: {
                    _id
                }
            }, (err, response) => {
                if (err) {
                    this.setState({
                        active: true,
                        barMessage: err.reason,
                        barIcon: 'error_outline',
                        barType: 'cancel'
                    });
                }

                else {
                    this.props.history.replace('/app/accounts/new');
                    this.setState({
                        active: true,
                        barMessage: 'Account deleted successfully',
                        barIcon: 'done',
                        barType: 'accept'
                    });
                }
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
        return this.props.loading || this.state.loading ? 'progress-bar' : 'progress-bar hide';
    }

    componentWillReceiveProps (p){
        this.setState(p.account);
        this.setCurrentRoute();
        if(this.state.isNewRoute){
            this.resetAccount()
        }
    }

    renderButton (){
        let button;
        if(this.state.isNewRoute){
            button = <div className='sidebar-buttons-group'>
                <Button type='submit' icon='add' label={<FormattedMessage {...il8n.EDIT_ACCOUNTS_BUTTON} />} raised primary />
            </div>
        }else{
            button = <div className='sidebar-buttons-group'>
                <Button type='submit' icon='mode_edit' label={<FormattedMessage {...il8n.UPDATE_ACCOUNTS_BUTTON} />} raised primary />
                <Button
                    onClick={this.removeAccount.bind(this)}
                    type='button'
                    icon='delete'
                    label={<FormattedMessage {...il8n.REMOVE_ACCOUNTS_BUTTON} />}
                    className='float-right'
                    accent />
            </div>
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

AccountsSideBar.propTypes = {
    account: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    accountExists: PropTypes.bool.isRequired
};

export default createContainer((props) => {
    const { id } = props.params;
    const accountHandle = Meteor.subscribe('accounts.single', id);
    const loading = !accountHandle.ready();
    const account = Accounts.findOne(id);
    const accountExists = !loading && !!account;
    return {
        loading,
        accountExists,
        account: accountExists ? account : {}
    };
}, AccountsSideBar);