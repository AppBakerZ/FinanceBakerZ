import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { Input, Button, ProgressBar, Snackbar } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Currencies } from '../../../../api/currencies/currencies.js';
import { Accounts } from '../../../../api/accounts/accounts.js';

export default class CurrencySideBar extends Component {

    constructor(props) {
        super(props);

        let datetime = new Date();

        this.state = {
            name: '',
            icon: '',
            active: false,
            loading: false
        };
    }

    setCurrentRoute(){
        this.setState({
            isNewRoute: this.props.history.isActive('app/currency/new')
        })
    }

    resetCurrency(){
        this.setState({
            name: '',
            icon: ''
        })
    }

    onSubmit(event){
        event.preventDefault();
        this.state.isNewRoute ? this.createCurrency() : this.updateCurrency();
        this.setState({loading: true})
    }

    createCurrency(){
        let {name, icon} = this.state;

        Meteor.call('currencies.insert', {
            currency: {
                name,
                icon
            }
        }, (err, response) => {
            if(response){
                this.setState({
                    active: true,
                    barMessage: 'Currency created successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
                this.resetCurrency();
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

    updateCurrency(){
        let {_id, name, icon} = this.state;

        Meteor.call('currencies.update', {
            currency: {
                _id,
                name,
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
                    barMessage: 'Currency updated successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
            this.setState({loading: false})
        });
    }

    removeCurrency(){
        const {_id} = this.state;
        Meteor.call('currencies.remove', {
            currency: {
                _id
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
                this.props.history.replace('/app/currency/new');
                this.setState({
                    active: true,
                    barMessage: 'Currency deleted successfully',
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
        this.setState(p.currency);
        this.setCurrentRoute();
        if(this.state.isNewRoute){
            this.resetCurrency()
        }
    }

    renderButton (){
        let button;
        if(this.state.isNewRoute){
            button = <div className='sidebar-buttons-group'>
                <Button icon='add' label='Add Currency' raised primary />
            </div>
        }else{
            button = <div className='sidebar-buttons-group'>
                <Button icon='mode_edit' label='Update Currency' raised primary />
                <Button
                    onClick={this.removeCurrency.bind(this)}
                    type='button'
                    icon='delete'
                    label='Remove Currency'
                    className='float-right'
                    accent />
            </div>
        }
        return button;
    }

    render() {
        return (
            <form onSubmit={this.onSubmit.bind(this)} className="add-category">

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
                       maxLength={ 50 }
                       value={this.state.name}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='text' label='Icon'
                       name='icon'
                       maxLength={ 50 }
                       value={this.state.icon}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                {this.renderButton()}
            </form>
        );
    }
}

CurrencySideBar.propTypes = {
    currency: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    currencyExists: PropTypes.bool.isRequired
};

export default createContainer((props) => {
    const { id } = props.params;
    const currencyHandle = Meteor.subscribe('currencies.single', id);
    const loading = !currencyHandle.ready();
    const currency = Currencies.findOne(id);
    const currencyExists = !loading && !!currency;
    return {
        loading,
        currencyExists,
        currency: currencyExists ? currency : {}
    };
}, CurrencySideBar);