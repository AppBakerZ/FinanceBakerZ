import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { routeHelpers } from '../../../../helpers/routeHelpers.js';
import { userCurrencyHelpers } from '../../../../helpers/currencyHelpers';
import { stringHelpers } from '../../../../helpers/stringHelpers';
import { Projects } from '../../../../api/projects/projects.js';

import RecordsNotExists from '../../utilityComponents/RecordsNotExist/NoRecordFound';
import ConfirmationMessage from '../../utilityComponents/ConfirmationMessage/ConfirmationMessage';

import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';
import { Button, Snackbar, Dialog } from 'react-toolbox';

import theme from './theme';

const il8n = defineMessages({
    EDIT: {
        id: 'COMMON.EDIT'
    },
    DELETE: {
        id: 'COMMON.DELETE'
    },
    INFORM_MESSAGE: {
        id: 'PROJECTS.INFORM_MESSAGE'
    },
    CONFIRMATION_MESSAGE: {
        id: 'PROJECTS.CONFIRMATION_MESSAGE'
    },
    CLIENT_NAME: {
        id: 'PROJECTS.CLIENT_NAME'
    },
    PROJECT_DESCRIPTION: {
        id: 'PROJECTS.PROJECT_DESCRIPTION'
    },
    AMOUNT_AGREED: {
        id: 'PROJECTS.AMOUNT_AGREED'
    },
    AMOUNT_PAID: {
        id: 'PROJECTS.AMOUNT_PAID'
    },
    AMOUNT_REMAINING: {
        id: 'PROJECTS.AMOUNT_REMAINING'
    },
    PROJECT_STATUS: {
        id: 'PROJECTS.STATUS'
    },
    EDIT_INFORMATION: {
        id: 'PROJECTS.EDIT_INFORMATION'
    },
    REMOVE_PROJECT: {
        id: 'PROJECTS.REMOVE_PROJECT'
    }
});

class ProjectDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            active: false,
            amountPaid: null,
            openDialog: false,
        };

        this.getPaidAmountOfProject(props.params.id)
    }
    getPaidAmountOfProject(id){
        Meteor.call('statistics.incomesGroupByProject', {
            project: {
                _id: id
            }
        }, (err, project) => {
            if (!err) {
                this.setState({
                    amountPaid: project.total
                });
            }
        });
    }

    editProject(){
        routeHelpers.changeRoute(`/app/projects/edit/${this.props.params.id}`);
    }
    openDialog (e) {
        if(e){
            e.stopPropagation();
            e.preventDefault();
        }
        this.setState({
            openDialog: true,
        });
    }

    removeProject(){
        this.setState({
            openDialog: false
        });
        const { id } = this.props.params;
        Meteor.call('projects.remove', {
            project: {
                _id: id
            }
        }, (err, response) => {
            if(err){
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }else{
                routeHelpers.changeRoute('/app/projects', 1200, {}, true);
                this.setState({
                    active: true,
                    barMessage: 'Project deleted successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
        });
    }

    closePopup () {
        this.setState({
            openDialog: false
        });
    }

    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }
    /*************** template render ***************/
    render() {
        const { formatMessage } = this.props.intl;
        let { project } = this.props;
        let {_id, startAt, amount, status, description } = project;
        let { amountPaid, openDialog} = this.state;
        let date = moment(startAt).format('DD-MMM-YYYY');
        return (
            <div className={theme.viewExpense}>
                {Object.keys(project).length ?

                <div className="container">
                    <div className={theme.titleBox}>
                        <Snackbar
                            action='Dismiss'
                            active={this.state.active}
                            icon={this.state.barIcon}
                            label={this.state.barMessage}
                            timeout={2000}
                            onClick={this.handleBarClick.bind(this)}
                            onTimeout={this.handleBarTimeout.bind(this)}
                            type={this.state.barType}
                        />
                        <h3>{project.name}</h3>
                        <div className={theme.rightButtons}>
                            <Button onClick={this.editProject.bind(this)}
                                    className='header-buttons'
                                    label={formatMessage(il8n.EDIT)}
                                    name='Income'
                                    icon='mode_edit'
                                    flat />
                            <Button onClick={this.openDialog.bind(this)}
                                    className='header-buttons'
                                    label={formatMessage(il8n.DELETE)}
                                    name='Expense'
                                    icon='delete'
                                    flat />
                        </div>
                    </div>
                    <div className={theme.bankContent}>
                        <div className={theme.depositContent}>
                            <h6>Project ID: <span>{_id}</span></h6>
                            <h6>Date: <span>{date}</span></h6>
                            <h5><FormattedMessage {...il8n.PROJECT_DESCRIPTION} />: <span>{description}</span></h5>
                            <h5><FormattedMessage {...il8n.AMOUNT_AGREED}/>: <span><FormattedNumber value={amount || 0}/></span></h5>
                            <h5><FormattedMessage {...il8n.AMOUNT_PAID} />: <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <span className={theme.price}>{amountPaid === null ? 'Loading ...' : <FormattedNumber value={amountPaid || 0}/>}</span></h5>
                            <h5><FormattedMessage {...il8n.AMOUNT_REMAINING} />: <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <span className={theme.price}>{ amountPaid === null ? 'Loading ...' : <FormattedNumber value={(amount - amountPaid) || 0}/> } </span></h5>
                            <h5><FormattedMessage {...il8n.PROJECT_STATUS} />: <span className={theme.price}>{status} </span></h5>
                            {project && project.client ?
                                <span>
                                    {Object.keys(project.client).map((key, idx) => (
                                        <h5 key={key + idx}>Client {stringHelpers.capitalize(key)}: <span>{project.client[key]}</span></h5>
                                    ))}
                                </span> : ''
                            }
                        </div>
                    </div>
                </div>
                    : <RecordsNotExists route="app/projects" />}

                <ConfirmationMessage
                    heading={formatMessage(il8n.REMOVE_PROJECT)}
                    information={formatMessage(il8n.INFORM_MESSAGE)}
                    confirmation={formatMessage(il8n.CONFIRMATION_MESSAGE)}
                    open={openDialog}
                    route="/app/projects"
                    defaultAction={this.removeProject.bind(this)}
                    close={this.closePopup.bind(this)}
                />
            </div>

        );
    }
}

ProjectDetail.propTypes = {
    intl: intlShape.isRequired
};

ProjectDetail = createContainer((props) => {
    const { id } = props.params;
    const projectHandle = Meteor.subscribe('projects.single', id);
    const project = Projects.findOne({_id: id});
    return {
        project: project ? project : {},
    };
}, ProjectDetail);

export default injectIntl(ProjectDetail);