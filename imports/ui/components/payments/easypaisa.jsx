import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { IconButton, Input, Button } from 'react-toolbox';

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';

import theme from './theme';
import { Card } from 'react-toolbox/lib/card';

class EasyPaisa extends Component {

    constructor(props) {
        super(props);
    }

    confirmPayment (){
        //here 2nd post back Url given which redirect after successful payment
        const postBackUrl = 'http://localhost:3000/app/easyPayCAllBack';
        let queryParams = this.props.location.query;
        window.location = `https://easypay.easypaisa.com.pk/easypay/Confirm.jsf?auth_token=${queryParams.auth_token}&postBackURL=${postBackUrl}`;
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.easyPaisaBanner}>
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