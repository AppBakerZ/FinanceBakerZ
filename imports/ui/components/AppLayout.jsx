import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router'

import { IconButton, List, ListItem, Sidebar } from 'react-toolbox';
import { Layout, Panel, Card, CardTitle, Button, FontIcon } from 'react-toolbox';
import LeftMenu from './leftMenu/LeftMenu.jsx'
import AppBarExtended from './appBarExtended/AppBarExtended.jsx'

import { Meteor } from 'meteor/meteor'

import theme from './theme';

// App component - represents the whole app
export default class AppLayout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sidebarPinned: false,
            drawerActive: false
        };

    }
    toggleDrawerActive(){
        this.setState({
            drawerActive: !this.state.drawerActive
        });
    }
    toggleSidebar (stopToggle) {
        this.setState({
            sidebarPinned: stopToggle
        });
    }

    name(){
        let user = Meteor.user();
        name = user.profile && user.profile.fullName ? user.profile.fullName : user.username || user.emails[0].address;
        return name;
    }

    render() {
        let {props} = this;
        props = {...props, name: this.name, drawerActive: this.state.drawerActive};
        return (
            <Layout>
                <LeftMenu {...props}/>
                <Panel>
                    <AppBarExtended>
                        <IconButton icon='menu' accent inverse={ true } onClick={ this.toggleDrawerActive.bind(this) }/>
                        <div className={theme.headerGreeting}>
                            <span>Welcome <b>{this.name()}</b></span>
                        </div>
                    </AppBarExtended>
                    <div className="page-content-wrapper" style={{ flex: 1, display: 'flex' }}>
                        {React.cloneElement(this.props.content, {toggleSidebar: this.toggleSidebar.bind(this)})}
                    </div>
                </Panel>
                <Sidebar pinned={this.state.sidebarPinned} width={ 6 }>
                    <div>
                        <IconButton icon='close' onClick={ this.toggleSidebar.bind(this, false) }/>
                    </div>
                    <div style={{ flex: 1, padding: '1.8rem ', overflowY: 'auto' }}>
                        {this.props.sidebar}
                    </div>
                </Sidebar>
            </Layout>
        );
    }
}