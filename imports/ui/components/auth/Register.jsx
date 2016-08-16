import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { AppBar, IconButton, List, ListItem, Sidebar } from 'react-toolbox';
import { Layout, NavDrawer, Panel, Card, CardTitle, Input, Button } from 'react-toolbox';

// App component - represents the whole app
export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            drawerActive: false,
            sidebarPinned: true
        }
    }

    toggleDrawerActive() {
        this.setState({
            drawerActive: !this.state.drawerActive
        });
    }

    toggleSidebar (stopToggle) {
        this.setState({
            sidebarPinned: stopToggle ? true : !this.state.sidebarPinned
        });
    }

    render() {
        return (
            <section>
                Register
            </section>
        );
    }
}