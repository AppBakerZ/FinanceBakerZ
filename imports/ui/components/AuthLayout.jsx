import React, { Component } from 'react';

import { AppBar } from 'react-toolbox';
import { Layout, Panel, Input } from 'react-toolbox';

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
                    <div style={{ flex: 1, display: 'flex' }}>
                        <Input type='text' label='Name'
                               name='name'
                               maxLength={ 25 }
                               required
                            />
                        <Input type='text' label='Purpose'
                               name='purpose'
                               maxLength={ 50 }
                            />
                    </div>
                </Panel>
            </Layout>
        );
    }
}