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
        this.state = {
            params: props.location.query
        };

    }

    confirmPayment (props){
        let queryParams = this.props.location.query;
    }

    render() {
        const { formatMessage } = this.props.intl;
        let params = this.state.params;
        return (
            <div className={theme.easyPaisaBanner}>
                <Card className={theme.cardContent}>
                    <div className="">
                        <img className={theme.easyPaisaImg} src="../assets/images/download.png" alt=""/>
                        <span className={theme.succesful}>your transaction was succesful</span>
                        <div className={theme.transactionId}>
                            <span>Transaction ID</span>
                            <span>{params.transactionRefNumber}</span>
                        </div>
                        <div className={theme.transactionId}>
                            <span>Amount</span>
                            <span>{params.amount}</span>
                        </div>
                        {/*currently no message or desc return from Easy Pay so not show it here*/}
                        {/*<div className={theme.transactionId}>*/}
                            {/*<span>Description</span>*/}
                            {/*<span>{params.message}</span>*/}
                        {/*</div>*/}
                        <Link to="/app">
                            <Button className={theme.easyPaisaBtn} label='Go to Home' raised />
                        </Link>
                    </div>

                    {/*the below div will be shown on error but till on on error fall back Url not provided by Easy Pag*/}

                    {/*<div className="">*/}
                        {/*<img className={theme.easyPaisaImg} src="../assets/images/download.png" alt=""/>*/}
                        {/*<p className={theme.errorText}>Your transaction could not be processed due to a technical error. please try again</p>*/}
                        {/*<Link to="/app">*/}
                            {/*<Button className={theme.easyPaisaBtn} label='Go Back' raised />*/}
                        {/*</Link>*/}
                    {/*</div>*/}

                </Card>
            </div>
        );
    }
}

EasyPaisaCallBack.propTypes = {

};

export default injectIntl(EasyPaisaCallBack);