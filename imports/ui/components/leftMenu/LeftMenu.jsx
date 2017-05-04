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
                    <Link to={`/app/dashboard`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('dashboard')} caption='Dashboard' leftIcon='dashboard' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/projects`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('projects')} caption='Projects' leftIcon='timeline' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/transactions`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('transa•••ctions')} caption='Transactions' leftIcon='monetization_on' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/accounts`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('accounts')} caption='Accounts' leftIcon='account_balance' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/categories`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('categories')} caption='Categories' leftIcon='view_module' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/settings`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('settings')} caption='Settings' leftIcon='settings' theme={listItemTheme}/>
                    </Link>
                    <ListItem caption='Logout' leftIcon='power_settings_new' onClick={this.logout.bind(this)} theme={listItemTheme}/>
                </List>
            </Drawer>
        );
    }
}