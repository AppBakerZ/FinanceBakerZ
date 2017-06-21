import React, { Component, PropTypes } from 'react';
import { Router, Route } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import { IconButton, Input, Button } from 'react-toolbox';

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';

import theme from './theme';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';

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
            <div className={theme.easyPaisaBanner}>
                {/*<a href={`easypaystg.easypaisa.com.pk/easypay/Confirm.jsf?auth_token=${this.props.location.query.auth_token}&postBackURL=${this.props.location.query.postBackURL}`}>confirm</a>*/}
                <Card className={theme.cardContent}>
                    <div className="">
                        <img src="../assets/images/download.png" alt=""/>
                        <h2>processing to <br/>easypay</h2>
                        <span className={theme.pleaseText}>please</span>
                        <Button className={theme.easyPaisaBtn} onClick={this.confirmPayment.bind(this)} label='Confirm' raised />
                    </div>
                </Card>
            </div>
        );
    }
}

EasyPaisa.propTypes = {

};

export default injectIntl(EasyPaisa);