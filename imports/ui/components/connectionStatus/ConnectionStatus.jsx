import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Snackbar } from 'react-toolbox';
import theme from './theme';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';


const il8n = defineMessages({
    INTERNET_ERROR: {
        id: 'ERRORS.INTERNET_ERROR'
    },
});

let computation;
class ConnectionStatus extends Component {
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
        this.connectionStatus.bind(this);
    }

    componentDidMount(){//check for connection status
        this.connectionStatus();
    }
    connectionStatus(){
        const { formatMessage } = this.props.intl;
        //TODO: Remove jQuery selector when upgrade to toolbox 2.0
        let $body = $('body');
        computation = Tracker.autorun(() => {
            let status = Meteor.status().status;

            if(status !== 'connected') {
                $body.addClass('disconnected');
                this.setState({
                    connectionBar: true,
                    barMessage: formatMessage(il8n.INTERNET_ERROR)
                });
            }
            else {
                this.setState({ connectionBar: false });
                setTimeout(() => {
                    $body.removeClass('disconnected');
                }, 3000)
            }
        });
    }

    componentWillUnmount(){
        computation.stop()
    }
    render() {
        const { formatMessage } = this.props.intl;
        return (
            <Snackbar
                theme={theme}
                active={this.state.connectionBar}
                label={formatMessage(il8n.INTERNET_ERROR)}
                />
        )}
}

ConnectionStatus.propTypes = {
    intl: intlShape.isRequired
};

ConnectionStatus = createContainer(() => {
    return {
        test: 'best'
    }
}, ConnectionStatus);

export default injectIntl(ConnectionStatus);