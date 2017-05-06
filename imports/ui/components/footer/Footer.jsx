import React, { Component } from 'react';

import theme from './theme';
import {FormattedMessage, defineMessages} from 'react-intl';


const il8n = defineMessages({
    FOOTER: {
        id: 'FOOTER.MESSAGE'
    }
});


export default class Footer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={theme.appFooter}>
                <span className="margin-top-5 margin-bottom-5"> {<FormattedMessage {...il8n.FOOTER} />} </span>
            </div>
        );
    }
}