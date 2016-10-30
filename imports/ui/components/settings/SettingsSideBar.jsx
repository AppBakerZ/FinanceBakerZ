import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { List, ListItem, Button, IconButton, ListSubHeader } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';

import iScroll from 'iscroll'
import ReactIScroll from 'react-iscroll'

const iScrollOptions = {
    mouseWheel: true,
    scrollbars: true,
    scrollX: true
};

export default class SettingsSideBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userCurrency : Meteor.user().profile.currency,
            currencies : [],
            y: 0,
            isScrolling: false
        };
    }

    onScrollStart (){
        console.log('on Scroll start');
        //this.setState({isScrolling: true})
    };

    onScrollEnd  (iScrollInstance) {
        console.log('on Scroll end', iScrollInstance);

        this.setState({isScrolling: false, y: iScrollInstance.y})
    };

    componentWillMount() {
        Meteor.call("get.currencies",{}, (error, currencies) => {
            if(error) {
                // handle error
            } else {
                this.setState({ currencies });
            }
        });
    }

    progressBarToggle (){
        return this.props.loading || this.state.loading ? 'progress-bar' : 'progress-bar hide';
    }

    setCurrentRoute(){
    }

    componentWillReceiveProps (p){
        this.setCurrentRoute();
    }

    renderList() {
        const { currencies } = this.state;
        return currencies.map((currency, i)=> {
            return  (<ListItem
                    key={i}
                    className={this.state.userCurrency && this.state.userCurrency.code == currency.code ? 'active' : ''}
                    caption={currency.name}
                    legend={currency.symbol}
                    rightIcon  = {this.state.userCurrency && this.state.userCurrency.code == currency.code ? 'done' : ''}
                    onClick={ this.setCurrency.bind(this, currency)}
                    />
            );

        });
    }


    setCurrency(currency){
        Meteor.call('setUserCurrency', {currency}, (err, res) => {
            if(res){
                this.setState({
                    userCurrency : Meteor.user().profile.currency
                })
            }
        });
    }

    render() {
        return (
            <ReactIScroll iScroll={iScroll} options={iScrollOptions}>
                <List selectable ripple>
                    <ListSubHeader caption='Currencies' />
                    {this.renderList()}
                </List>
            </ReactIScroll>
        );
    }
}

SettingsSideBar.propTypes = {
    params : PropTypes.object.isRequired
};

export default createContainer((props) => {
    return {
        params: props.params
    };
}, SettingsSideBar);