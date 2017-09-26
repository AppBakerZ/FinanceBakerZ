import React, { Component } from 'react';

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';

import { Button } from 'react-toolbox';

import theme from './theme.scss';
import { routeHelpers } from '../../../helpers/routeHelpers.js';


const il8n = defineMessages({
    ADD_PROJECTS: {
        id: 'PROJECTS.ADD_PROJECT_TO_SHOW'
    },
    NO_PROJECTS_ADDED: {
        id: 'PROJECTS.NO_PROJECTS_ADDED'
    },
    NO_PROJECTS_MATCHED: {
        id: 'PROJECTS.NO_PROJECTS_MATCHED'
    },
});



class RecordsNotExists extends Component {

    constructor(props) {
        super(props);
    }

    add(){
        routeHelpers.changeRoute(this.props.route);
    }

    render() {
        return (
            <div className={theme.projectNothing}>
                <span className={theme.errorShow}><FormattedMessage {...il8n.NO_PROJECTS_ADDED} /></span>
                <div className={theme.addProjectBtn}>
                    <Button type='button' icon='add' raised primary onClick={this.add.bind(this)} />
                </div>
                <span className={theme.errorShow}><FormattedMessage {...il8n.ADD_PROJECTS} /></span>
            </div>
        );
    }
}

RecordsNotExists.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(RecordsNotExists);