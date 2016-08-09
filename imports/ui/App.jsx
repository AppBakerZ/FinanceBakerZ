import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Navigation from 'react-toolbox/lib/navigation';

import { AppBar, IconButton, List, ListItem } from 'react-toolbox';
import { Layout, NavDrawer, Panel, Card, CardTitle } from 'react-toolbox';

// App component - represents the whole app
export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            drawerActive: false
        }
    }

    toggleDrawerActive() {
        this.setState({
            drawerActive: !this.state.drawerActive
        });
    }

    render() {
        return (
            <Layout>
                <NavDrawer active={this.state.drawerActive} onOverlayClick={ this.toggleDrawerActive.bind(this) }>
                    <div>
                        <Card small style={{width: '350px'}}>
                            <CardTitle
                                avatar="https://placeimg.com/80/80/animals"
                                title="Kamran Masood"
                                subtitle="Crocodile of Manghopir"
                                />
                        </Card>
                        <List selectable ripple>
                            <ListItem caption='Accounts' leftIcon='account_balance' />
                            <ListItem caption='Transactions' leftIcon='loop' />
                            <ListItem caption='Settings' leftIcon='settings' />
                            <ListItem caption='Categories' leftIcon='border_all' />
                        </List>
                    </div>
                </NavDrawer>
                <Panel>
                    <AppBar>
                        <IconButton icon='menu' inverse={ true } onClick={ this.toggleDrawerActive.bind(this) }/>
                    </AppBar>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
                        <h1>Main Content</h1>
                    </div>
                </Panel>
            </Layout>
        );
    }
}