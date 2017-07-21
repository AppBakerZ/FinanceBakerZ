import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Drawer, List, ListItem, FontIcon } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor'

import theme from './theme';
import listItemTheme from './listItemTheme';
import drawerTheme from './drawerTheme';
import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';


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



class LeftMenu extends Component {
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
        //TODO: not working with custom queryParams (reports page)
        window.location.reload();
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
        return this.props.location.pathname === `/app/${path}` ? listItemTheme.active : ''
    }
    getUserLang(){
        return this.props.user && this.props.user.profile && this.props.user.profile.language || '';
    }
    setDirection(){
        let dir = this.getUserLang() ? this.getUserLang().direction : 'ltr';
        return dir === 'ltr' ? 'left' : 'right'
    }
    render() {
        const { formatMessage } = this.props.intl;
        return (
            <Drawer type={this.setDirection()} theme={drawerTheme} active={this.state.drawerActive} onOverlayClick={ this.toggleDrawerActive.bind(this) }>
                <List className={theme.list} selectable ripple>
                    <Link to={`/app/dashboard`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('dashboard')} caption= {formatMessage(il8n.DASHBOARD)} leftIcon='dashboard' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/projects`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('projects')} caption= {formatMessage(il8n.PROJECTS)} leftIcon='timeline' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/transactions`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('transa•••ctions')} caption= {formatMessage(il8n.TRANSACTIONS)} leftIcon='monetization_on' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/accounts`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('accounts')} caption= {formatMessage(il8n.ACCOUNTS)} leftIcon='account_balance' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/categories`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('categories')} caption= {formatMessage(il8n.CATEGORIES)} leftIcon='view_module' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/reports`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('reports')} caption= {formatMessage(il8n.REPORTS)} leftIcon='description' theme={listItemTheme}/>
                    </Link>
                    <Link to={`/app/settings`} onClick={this.toggleDrawerActive.bind(this)}>
                        <ListItem className={this.isActive('settings')} caption= {formatMessage(il8n.SETTINGS)} leftIcon='settings' theme={listItemTheme}/>
                    </Link>
                    <ListItem caption= {formatMessage(il8n.LOGOUT_BUTTON)} leftIcon='power_settings_new' onClick={this.logout.bind(this)} theme={listItemTheme}/>
                </List>
            </Drawer>
        );
    }
}

LeftMenu.propTypes = {
    intl: intlShape.isRequired
};


LeftMenu =  createContainer(() => {
    return {
        user: Meteor.user()
    };
}, LeftMenu);

export default injectIntl(LeftMenu);