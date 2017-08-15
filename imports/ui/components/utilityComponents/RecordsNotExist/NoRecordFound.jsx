import React, { Component } from 'react';

import buttonTheme from '../../projects/buttonTheme.scss';

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';

import { routeHelpers } from '../../../../helpers/routeHelpers';

import PropTypes from 'prop-types';

import { Button } from 'react-toolbox';

import theme from './theme.scss';

class NoRecordFound extends Component {

    constructor(props) {
        super(props);
    }

    goBack(){
        routeHelpers.changeRoute(this.props.route);
    }

    render() {
        return (
            <div className={theme.projectNothing}>
                <span className={theme.errorShow}>No Records Are Exist</span>
                    <div className={theme.goback}>
                    <Button
                            type='button'
                            raised theme={buttonTheme}
                            label="Go Back"
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