import React, { Component } from 'react';
import { NavDrawer, List, ListItem, Card, CardTitle, FontIcon } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor'

import theme from './theme';

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
            <NavDrawer className="side-menu-wrapper" active={this.state.drawerActive} onOverlayClick={ this.toggleDrawerActive.bind(this) }>
                <div>
                    <Card style={{width: '350px'}}>
                        <CardTitle
                            avatar={<FontIcon className='dashboard-card-icon' value='account_balance_wallet'/>}
                            title={this.props.name()}
                            />
                    </Card>
                    <List selectable ripple>
                        <Link className={this.props.location.pathname == '/app/dashboard' ? 'active' : ''}
                              to={`/app/dashboard`}>
                            <ListItem caption='Dashboard' leftIcon='dashboard' />
                        </Link>
                        <Link className={this.props.location.pathname == '/app/projects' ? 'active' : ''}
                              to={`/app/projects`}>
                            <ListItem caption='Project' leftIcon='content_cut' />
                        </Link>
                        <Link className={this.props.location.pathname == '/app/transactions' ? 'active' : ''}
                              to={`/app/transactions`}>
                            <ListItem caption='Transactions' leftIcon='swap_horiz' />
                        </Link>
                        <Link className={this.props.location.pathname == '/app/accounts/new' ? 'active' : ''}
                              to={`/app/accounts/new`}>
                            <ListItem caption='Accounts' leftIcon='account_balance' />
                        </Link>
                        <Link className={this.props.location.pathname == '/app/categories/new' ? 'active' : ''}
                              to={`/app/categories/new`}>
                            <ListItem caption='Categories' leftIcon='border_all' />
                        </Link>
                        <Link className={this.props.location.pathname == '/app/settings/new' ? 'active' : ''}
                              to={`/app/settings/new`}>
                            <ListItem caption='Settings' leftIcon='settings' />
                        </Link>
                        <ListItem caption='Logout' leftIcon='lock' onClick={this.logout.bind(this)} />
                    </List>
                </div>
            </NavDrawer>
        );
    }
}