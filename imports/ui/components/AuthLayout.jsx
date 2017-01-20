import React, { Component } from 'react';

import { Layout, Panel, Input, Card, Button, Snackbar, ProgressBar } from 'react-toolbox';
import Footer from './footer/Footer.jsx'
import AppBarExtended from './appBarExtended/AppBarExtended.jsx'
import { Link } from 'react-router'

import theme from './theme';

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
                    <AppBarExtended>
                        <Link
                            to={`/`}>
                            //FinanceBakerZ
                            <img src={'../assets/images/logo.png'} alt="Logo" className="header-logo"/>
                        </Link>
                    </AppBarExtended>
                    <div className={theme.appBody}>
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
                        <Card className="login-card" style={{width: '300px', padding: '1.8rem', margin: '25px 0 25px 0'}}>
                            {React.cloneElement(this.props.children, {
                                showSnackbar: this.showSnackbar.bind(this),
                                progressBarUpdate: this.progressBarUpdate.bind(this),
                                loading: this.state.loading
                            })}
                        </Card>
                    </div>
                    <Footer />
                </Panel>
            </Layout>
        );
    }
}