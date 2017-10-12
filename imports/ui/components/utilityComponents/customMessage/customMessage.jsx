import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';

import { Button } from 'react-toolbox';

import theme from './theme.scss';


const il8n = defineMessages({
    GENERALIZED_FILTER: {
        id: 'PROJECTS.GENERALIZED_FILTER'
    },
    NO_PROJECTS_MATCHED: {
        id: 'PROJECTS.NO_PROJECTS_MATCHED'
    },
});



class CustomMessage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { message, message1 } = this.props;
        return (
            <div className={theme.projectNothing}>
                <span className={theme.errorShow}>{message}</span>
                {message1 ? <span className={theme.errorShow}>{message1}</span> : ''}
            </div>
        );
    }
}

CustomMessage.propTypes = {
    message: PropTypes.string.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(CustomMessage);