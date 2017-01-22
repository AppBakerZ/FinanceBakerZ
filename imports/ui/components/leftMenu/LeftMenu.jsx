import React, { Component } from 'react';
import { Drawer, List, ListItem, FontIcon } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor'

import theme from './theme';
import listItemTheme from './listItemTheme';
import drawerTheme from './drawerTheme';

export default class LeftMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerActive: false
        };
    }
    toggleDrawerActive() {
        this.setState({
            drawerActive: !this.state.drawerActive
        });
        this.props.toggleDrawerActive();
    }
    logout(){
        Meteor.logout(() => {
            this.props.history.push('/login')
        })
    }
    componentWillReceiveProps(props) {
        this.setState({
            drawerActive: props.drawerActive
        });
    }
    isActive(path){
        return this.props.location.pathname == `/app/${path}` ? listItemTheme.active : ''
    }
    render() {
        return (
            <Drawer  theme={drawerTheme} active={this.state.drawerActive} onOverlayClick={ this.toggleDrawerActive.bind(this) }>
                    <List className={theme.list} selectable ripple>
                        <Link to={`/app/dashboard`}>
                            <ListItem className={this.isActive('dashboard')} caption='Dashboard' leftIcon='dashboard' theme={listItemTheme}/>
                        </Link>
                        <Link to={`/app/projects`}>
                            <ListItem className={this.isActive('projects')} caption='Project' leftIcon='timeline' theme={listItemTheme}/>
                        </Link>
                        <Link to={`/app/transactions`}>
                            <ListItem className={this.isActive('transactions')} caption='Transactions' leftIcon='monetization_on' theme={listItemTheme}/>
                        </Link>
                        <Link to={`/app/accounts/new`}>
                            <ListItem className={this.isActive('accounts/new')} caption='Accounts' leftIcon='account_balance' theme={listItemTheme}/>
                        </Link>
                        <Link to={`/app/categories/new`}>
                            <ListItem className={this.isActive('categories/new')} caption='Categories' leftIcon='view_module' theme={listItemTheme}/>
                        </Link>
                        <Link to={`/app/settings/new`}>
                            <ListItem className={this.isActive('settings/new')} caption='Settings' leftIcon='settings' theme={listItemTheme}/>
                        </Link>
                        <ListItem caption='Logout' leftIcon='power_settings_new' onClick={this.logout.bind(this)} theme={listItemTheme}/>
                    </List>
            </Drawer>
        );
    }
}