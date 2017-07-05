import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import { IconButton, Input, Button } from 'react-toolbox';

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';

import theme from './theme';
import { Card } from 'react-toolbox/lib/card';

// App component - represents the whole app
class EasyPaisaCallBack extends Component {

    constructor(props) {
        super(props);
    }

    confirmPayment (props){
        let queryParams = this.props.location.query;
        console.log(queryParams)
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
                        <Link to="/app">
                            <Button className={theme.easyPaisaBtn} label='Go to Home' raised />
                        </Link>

                    </div>
                </Card>
            </div>
        );
    }
}

EasyPaisaCallBack.propTypes = {

};

export default injectIntl(EasyPaisaCallBack);