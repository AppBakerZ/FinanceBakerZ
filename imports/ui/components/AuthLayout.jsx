import React, { Component } from 'react';

import { AppBar } from 'react-toolbox';
import { Layout, Panel, Input, Card, Button, Snackbar, ProgressBar } from 'react-toolbox';

import { Link } from 'react-router'

// App component - represents the whole app
export default class AuthLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSnackbar: false,
            barIcon: '',
            barMessage: '',
            barType: '',
            loading: false
        }
    }

    showSnackbar(options){
        this.setState(options);
    }

    handleBarClick (event, instance) {
        this.setState({ activeSnackbar: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ activeSnackbar: false });
    }

    progressBarToggle (){
        return this.state.loading ? 'progress-bar auth' : 'progress-bar hide';
    }

    progressBarUpdate (value){
        this.setState({
            loading: value
        })
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
                        <ProgressBar type='circular' mode='indeterminate' multicolor className={this.progressBarToggle()} />
                        <Snackbar
                            action='Dismiss'
                            active={this.state.activeSnackbar}
                            icon={this.state.barIcon}
                            label={this.state.barMessage}
                            timeout={2000}
                            onClick={this.handleBarClick.bind(this)}
                            onTimeout={this.handleBarTimeout.bind(this)}
                            type={this.state.barType}
                            />
                        <Card style={{width: '350px', padding: '1.8rem', margin: '25px 0 25px 0'}}>
                            {React.cloneElement(this.props.children, {
                                showSnackbar: this.showSnackbar.bind(this),
                                progressBarUpdate: this.progressBarUpdate.bind(this),
                                loading: this.state.loading
                            })}
                        </Card>
                    </div>
                </Panel>
            </Layout>
        );
    }
}