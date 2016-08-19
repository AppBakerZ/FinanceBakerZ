import React, { Component } from 'react';

import { AppBar } from 'react-toolbox';
import { Layout, Panel, Input, Card, Button } from 'react-toolbox';

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
                        FinanceBakerZ
                    </AppBar>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto'}}>
                        <Card style={{width: '350px', padding: '1.8rem', margin: '25px 0 25px 0'}}>
                            <form>
                                <Input type='text' label='Username or Email'
                                       name='username-or-email'
                                       maxLength={ 30 }
                                       required
                                    />
                                <Input type='password' label='Password'
                                       name='password'
                                       maxLength={ 20 }
                                    />
                                <Button icon='person_add' label='Register' raised primary />
                            </form>
                        </Card>
                    </div>
                </Panel>
            </Layout>
        );
    }
}