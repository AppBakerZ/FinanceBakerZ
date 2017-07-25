import React, { Component } from 'react';

import { Snackbar } from 'react-toolbox';
import theme from './theme';




export default class ConnectionStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectionBar: false,
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
        //TODO: Remove jQuery selector when upgrade to toolbox 2.0
        let $body = $('body');
        Tracker.autorun(() => {

            let status = Meteor.status().status;
            //added extra checks to remove warnings
            if(status !== 'connected' && this.state) {
                $body.addClass('disconnected');
                this.setState({
                    connectionBar: true,
                    barMessage: "Unable to connect to the internet. Please check your network settings."
                });
            }
            else if(this.state.connectionBar){
                this.setState({ connectionBar: false });
                setTimeout(() => {
                    $body.removeClass('disconnected');
                }, 3000)
            }
        });
    }
    render() {
        return (
            <Snackbar
                theme={theme}
                active={this.state.connectionBar}
                label={this.state.barMessage}
                />
        )}
}