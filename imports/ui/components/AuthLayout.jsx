import React, { Component } from 'react';

import { AppBar } from 'react-toolbox';
import { Layout, Panel, Input, Card, Button } from 'react-toolbox';

import { Link } from 'react-router'

// App component - represents the whole app
export default class AuthLayout extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                <Panel>
                    <AppBar>
                        <Link
                            to={`/`}>
                            FinanceBakerZ
                        </Link>
                    </AppBar>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto'}}>
                        <Card style={{width: '350px', padding: '1.8rem', margin: '25px 0 25px 0'}}>
                            {this.props.children}
                        </Card>
                    </div>
                </Panel>
            </Layout>
        );
    }
}