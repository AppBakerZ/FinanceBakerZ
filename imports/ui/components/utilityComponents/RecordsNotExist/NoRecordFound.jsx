import React, { Component } from 'react';

import buttonTheme from '../../projects/buttonTheme.scss';

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';

import { routeHelpers } from '../../../../helpers/routeHelpers';

import PropTypes from 'prop-types';

import { Button } from 'react-toolbox';

import theme from './theme.scss';

const il8n = defineMessages({

    NO_RECORD_EXISTS:{
        id: 'UTILITY_COMPONENTS.NO_RECORD_EXISTS'
    },
    GO_BACK:{
        id: 'UTILITY_COMPONENTS.GO_BACK'
    }
});

class NoRecordFound extends Component {

    constructor(props) {
        super(props);
    }

    goBack(){
        routeHelpers.changeRoute(this.props.route);
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.projectNothing}>
                <span className={theme.errorShow}>{formatMessage(il8n.NO_RECORD_EXISTS)}</span>
                    <div className={theme.goback}>
                    <Button
                            type='button'
                            raised theme={buttonTheme}
                            label={formatMessage(il8n.GO_BACK)}
                            onClick={this.goBack.bind(this)}/>
                    </div>
            </div>
        );
    }
}

NoRecordFound.propTypes = {
    route: PropTypes.string.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(NoRecordFound);