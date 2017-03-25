import React, { Component } from 'react';

import { Layout, Panel, Input, Card, Button, Snackbar, ProgressBar } from 'react-toolbox';
import theme from './theme';




export default class ConnectionStatus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSnackbar: false,
            barIcon: '',
            barMessage: '',
            barType: '',
            loading: false
        };

        //check for connection status
        this.connectionStatus();
    }



    connectionStatus(){
        Tracker.autorun(() => {
            let status = Meteor.status().status;

            if(status != 'connected') {
                this.setState({
                    connectionBar: true,
                    barMessage: "Unable to connect to the internet. Please check your network settings."
                });
            }
            else {
                this.setState({ connectionBar: false });
            }
        });
    }



    render() {
        console.log("connection status");
        return (
            <Snackbar
                active={this.state.connectionBar}
                label={this.state.barMessage}
                />
        )}

}