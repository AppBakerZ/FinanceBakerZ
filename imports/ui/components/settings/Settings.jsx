import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { List, ListItem, Button, IconButton, ListSubHeader, Dropdown } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';

class SettingsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userCurrency: Meteor.user().profile.currency ? Meteor.user().profile.currency.symbol : '',
            currencies: []
        }

    }

    componentWillMount() {
        Meteor.call("get.currencies",{}, (error, currencies) => {
            if(error) {
                // handle error
            } else {
                this.setState({ currencies });
            }
        });
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
        e.target.name == 'userCurrency' && this.setCurrency(val)
    }

    setCurrency(currency){
        currency = _.findWhere(this.state.currencies, {symbol: currency});
        delete currency.value;
        Meteor.call('setUserCurrency', {currency}, (err, res) => {
            if(res){
                this.setState({
                    userCurrency : Meteor.user().profile.currency ? Meteor.user().profile.currency.symbol : ''
                })
            }
        });
    }

    currencies(){
        return this.state.currencies.map((currency) => {
            currency.value = currency.symbol;
            return currency;
        })
    }

    currencyItem (currency) {
        const containerStyle = {
            display: 'flex',
            flexDirection: 'row'
        };

        const imageStyle = {
            width: '40px',
            height: '32px',
            textAlign: 'center',
            paddingTop: '8px',
            flexGrow: 0,
            marginRight: '8px',
            backgroundColor: '#ccc'
        };

        const contentStyle = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 2
        };

        return (
            <div style={containerStyle}>
                <span style={imageStyle}>{currency.symbol}</span>
                <div style={contentStyle}>
                    <strong>{currency.name}</strong>
                </div>
            </div>
        );
    }
    renderCategory(){
        return (
            <section>
                <Dropdown
                    auto={false}
                    source={this.currencies()}
                    name='userCurrency'
                    onChange={this.onChange.bind(this)}
                    label='Select your currency'
                    value={this.state.userCurrency}
                    template={this.currencyItem}
                    required
                    />
            </section>
        )
    }

    render() {
        return (
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
                    <List ripple className='list'>
                        {this.renderCategory()}
                    </List>
                </div>
            </div>
        );
    }
}

SettingsPage.propTypes = {
    categories: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('categories');

    return {
        categories: Categories.find({}).fetch()
    };
}, SettingsPage);