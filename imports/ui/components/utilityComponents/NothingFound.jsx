import React, { Component } from 'react';
import PropTypes from 'prop-types'

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



class NothingFound extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={theme.projectNothing}>
                <span className={theme.errorShow}><FormattedMessage {...il8n.NO_PROJECTS_MATCHED} /></span>
                <div className={theme.addProjectBtn}>
                    <Button type='button' icon='search' raised primary />
                </div>
                <span className={theme.errorShow}><FormattedMessage {...il8n.GENERALIZED_FILTER} /></span>
            </div>
        );
    }
}

NothingFound.propTypes = {
    route: PropTypes.string.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(NothingFound);