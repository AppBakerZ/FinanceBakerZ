import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router'

import { AppBar, IconButton, List, ListItem, Sidebar } from 'react-toolbox';
import { Layout, NavDrawer, Panel, Card, CardTitle, Button } from 'react-toolbox';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
export default class AppLayout extends Component {

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
            <Layout>
                <NavDrawer active={this.state.drawerActive} onOverlayClick={ this.toggleDrawerActive.bind(this) }>
                    <div>
                        <Card style={{width: '350px'}}>
                            <CardTitle
                                avatar="https://placeimg.com/80/80/animals"
                                title="Kamran Masood"
                                subtitle="Crocodile of Manghopir"
                                />
                        </Card>
                        <List selectable ripple>
                            <Link
                                to={`/app/dashboard`}>
                                <ListItem caption='Dashboard' leftIcon='dashboard' />
                            </Link>
                            <Link
                                to={`/app/expenses/new`}>
                                <ListItem caption='Expenses' leftIcon='content_cut' />
                            </Link>
                            <Link
                                to={`/app/incomes/new`}>
                                <ListItem caption='Income' leftIcon='monetization_on' />
                            </Link>
                            <Link
                                to={`/app/accounts/new`}>
                                <ListItem caption='Accounts' leftIcon='account_balance' />
                            </Link>
                            <ListItem caption='Categories' leftIcon='border_all' />
                            <ListItem caption='Settings' leftIcon='settings' />
                        </List>
                    </div>
                </NavDrawer>
                <Panel>
                    <AppBar>
                        <IconButton icon='menu' inverse={ true } onClick={ this.toggleDrawerActive.bind(this) }/>
                        <AccountsUIWrapper />
                    </AppBar>
                    <div style={{ flex: 1, display: 'flex' }}>
                        {React.cloneElement(this.props.content, {toggleSidebar: this.toggleSidebar.bind(this)})}
                    </div>
                </Panel>
                <Sidebar pinned={this.state.sidebarPinned} width={ 6 }>
                    <div>
                        <IconButton icon='close' onClick={ this.toggleSidebar.bind(this, false) }/>
                    </div>
                    <div style={{ flex: 1, padding: '1.8rem' }}>
                        {this.props.sidebar}
                    </div>
                </Sidebar>
            </Layout>
        );
    }
}