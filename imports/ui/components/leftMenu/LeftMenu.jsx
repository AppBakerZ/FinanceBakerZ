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
    render() {
        return (
            <Drawer  theme={drawerTheme} active={this.state.drawerActive} onOverlayClick={ this.toggleDrawerActive.bind(this) }>
                    <List className={theme.list} selectable ripple>
                        <Link to={`/app/dashboard`}>
                            <ListItem className={this.props.location.pathname == '/app/dashboard' ? listItemTheme.active : ''} caption='Dashboard' leftIcon='dashboard' theme={listItemTheme}/>
                        </Link>
                        <Link to={`/app/projects`}>
                            <ListItem className={this.props.location.pathname == '/app/projects' ? listItemTheme.active  : ''} caption='Project' leftIcon='timeline' theme={listItemTheme}/>
                        </Link>
                        <Link to={`/app/transactions`}>
                            <ListItem className={this.props.location.pathname == '/app/transactions' ? listItemTheme.active  : ''} caption='Transactions' leftIcon='monetization_on' theme={listItemTheme}/>
                        </Link>
                        <Link to={`/app/accounts/new`}>
                            <ListItem className={this.props.location.pathname == '/app/accounts/new' ? listItemTheme.active  : ''} caption='Accounts' leftIcon='account_balance' theme={listItemTheme}/>
                        </Link>
                        <Link to={`/app/categories/new`}>
                            <ListItem className={this.props.location.pathname == '/app/categories/new' ? listItemTheme.active  : ''} caption='Categories' leftIcon='view_module' theme={listItemTheme}/>
                        </Link>
                        <Link to={`/app/settings/new`}>
                            <ListItem className={this.props.location.pathname == '/app/settings/new' ? listItemTheme.active  : ''} caption='Settings' leftIcon='settings' theme={listItemTheme}/>
                        </Link>
                        <ListItem caption='Logout' leftIcon='power_settings_new' onClick={this.logout.bind(this)} theme={listItemTheme}/>
                    </List>
            </Drawer>
        );
    }
}