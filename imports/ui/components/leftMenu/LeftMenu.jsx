import React, { Component } from 'react';
import { Drawer, List, ListItem, FontIcon } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor'

import theme from './theme';
import listItemTheme from './listItemTheme';
import drawerTheme from './drawerTheme';
import {FormattedMessage, defineMessages} from 'react-intl';


const il8n = defineMessages({
    DASHBOARD: {
        id: 'LEFTMENU.DASHBOARD'
    },
    PROJECTS: {
        id: 'LEFTMENU.PROJECTS'
    },
    TRANSACTIONS: {
        id: 'LEFTMENU.TRANSACTIONS'
    },
    ACCOUNTS: {
        id: 'LEFTMENU.ACCOUNTS'
    },
    CATEGORIES: {
        id: 'LEFTMENU.CATEGORIES'
    },
    REPORTS: {
        id: 'LEFTMENU.REPORTS'
    },
    SETTINGS: {
        id: 'LEFTMENU.SETTINGS'
    },
    LOGOUT_BUTTON: {
        id: 'LEFTMENU.LOGOUT_BUTTON'
    }
});



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
            <Drawer type="right" theme={drawerTheme} active={this.state.drawerActive} onOverlayClick={ this.toggleDrawerActive.bind(this) }>
                <List className={theme.list} selectable ripple>
                    <Link to={`/app/dashboard`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('dashboard')} caption= {<FormattedMessage {...il8n.DASHBOARD} />} leftIcon='dashboard' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/projects`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('projects')} caption= {<FormattedMessage {...il8n.PROJECTS} />} leftIcon='timeline' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/transactions`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('transa•••ctions')} caption= {<FormattedMessage {...il8n.TRANSACTIONS} />} leftIcon='monetization_on' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/accounts`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('accounts')} caption= {<FormattedMessage {...il8n.ACCOUNTS} />} leftIcon='account_balance' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/categories`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('categories')} caption= {<FormattedMessage {...il8n.CATEGORIES} />} leftIcon='view_module' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/reports`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('reports')} caption= {<FormattedMessage {...il8n.REPORTS} />} leftIcon='description' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/settings`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('settings')} caption= {<FormattedMessage {...il8n.SETTINGS} />} leftIcon='settings' theme={listItemTheme}/>
                    </Link>
                    <ListItem caption= {<FormattedMessage {...il8n.LOGOUT_BUTTON} />} leftIcon='power_settings_new' onClick={this.logout.bind(this)} theme={listItemTheme}/>
                </List>
            </Drawer>
        );
    }
}