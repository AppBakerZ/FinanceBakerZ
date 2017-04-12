import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router'

import { Layout, Panel, IconButton, Sidebar, Snackbar } from 'react-toolbox';
import LeftMenu from './leftMenu/LeftMenu.jsx'
import AppBarExtended from './appBarExtended/AppBarExtended.jsx'
import ConnectionStatus from '/imports/ui/components/connectionStatus/ConnectionStatus.jsx'

import { Meteor } from 'meteor/meteor'

import theme from './theme';

// App component - represents the whole app
class AppLayout extends Component {

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
    logout(){
        Meteor.logout(() => {
            this.props.history.push('/login')
        })
    }
    render() {
        let {props} = this, gravatar, user = Meteor.user();
        props = {...props,
            name: this.name,
            toggleDrawerActive: this.toggleDrawerActive.bind(this),
            drawerActive: this.state.drawerActive
        };
        if(user && user.profile.md5hash) {
            gravatar = Gravatar.imageUrl(user.profile.md5hash, {
                secure: true,
                size: "48",
                d: 'mm',
                rating: 'pg'
            });
        }
        let profileImage = this.props.user.profile.avatar || gravatar || "/assets/images/HQ3YU7n.gif";
        return (
            <Layout>
                <LeftMenu {...props}/>
                <Panel>
                    <AppBarExtended>
                        <IconButton icon='menu' accent inverse={ true } onClick={ this.toggleDrawerActive.bind(this) }/>
                        <div className={theme.headerGreeting}>
                            <span>Welcome <b>{this.name()}</b> <img src = { profileImage } width="45" height="45" /><i className="material-icons" onClick={this.logout.bind(this)}>&#xE8AC;</i></span>
                        </div>
                    </AppBarExtended>
                    <div className="page-content-wrapper" style={{ flex: 1, display: 'flex' }}>
                        {React.cloneElement(this.props.content, {toggleSidebar: this.toggleSidebar.bind(this)})}
                        <ConnectionStatus />
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

export default createContainer(() => {
    return {
        user: Meteor.user()
    };
}, AppLayout);