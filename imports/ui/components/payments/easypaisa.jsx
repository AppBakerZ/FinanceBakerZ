import React, { Component, PropTypes } from 'react';
import { Router, Route } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import { IconButton, Input, Button } from 'react-toolbox';

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';


// App component - represents the whole app
class EasyPaisa extends Component {

    constructor(props) {
        super(props);

        this.state = {
            confirmLink: ''
        }
    }

    // componentDidMount(){
    //     this.justcheck(this.props);
    // }

    confirmPayment (props){
        let queryParams = this.props.location.query;
        let externalLink = `https://easypay.easypaisa.com.pk/easypay/Confirm.jsf?auth_token=${queryParams.auth_token}&postBackURL=${queryParams.postBackURL}`;
        window.location = externalLink;
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div>
                {/*<a href={`easypaystg.easypaisa.com.pk/easypay/Confirm.jsf?auth_token=${this.props.location.query.auth_token}&postBackURL=${this.props.location.query.postBackURL}`}>confirm</a>*/}
                <a onClick={this.confirmPayment.bind(this)}>confirm</a>
            </div>
        );
    }
}

EasyPaisa.propTypes = {

};

export default injectIntl(EasyPaisa);