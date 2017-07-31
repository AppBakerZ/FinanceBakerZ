import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { routeHelpers } from '../../../../helpers/routeHelpers.js'
import { userCurrencyHelpers } from '../../../../helpers/currencyHelpers'
import { Projects } from '../../../../api/projects/projects.js'

import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';
import { Button, Snackbar } from 'react-toolbox';

import theme from './theme';

const il8n = defineMessages({
    CLIENT_NAME: {
        id: 'PROJECTS.CLIENT_NAME'
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
            amountPaid: null
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

    removeTransaction(){
        const { id } = this.props.params;
        Meteor.call('transactions.remove', {
            transaction: {
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
                routeHelpers.changeRoute('/app/reports', 1200);
                this.setState({
                    active: true,
                    barMessage: 'Expense deleted successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
        });
    }

    removeProject(){
        const {_id} = this.props.params;
        Meteor.call('projects.remove', {
            project: {
                _id
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
                routeHelpers.changeRoute('/app/projects', 1200);
                this.setState({
                    active: true,
                    barMessage: 'Project deleted successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
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
        let {_id, startAt, amount, status } = project;
        let { amountPaid } = this.state;
        let date = moment(startAt).format('DD-MMM-YYYY');
        return (
            <div className={theme.viewExpense}>
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
                                    label="edit"
                                    name='Income'
                                    flat />
                            <Button onClick={this.removeProject.bind(this)}
                                    className='header-buttons'
                                    label="delete"
                                    name='Expense'
                                    flat />
                        </div>
                    </div>
                    <div className={theme.bankContent}>
                        <div className={theme.depositContent}>
                            <h6>Project ID: <span>{_id}</span></h6>
                            <h6>Date: <span>{date}</span></h6>
                            <h5><FormattedMessage {...il8n.CLIENT_NAME} />: <span>{project.client && project.client.name}</span></h5>
                            <h5><FormattedMessage {...il8n.AMOUNT_AGREED} />: <span><FormattedNumber value={amount || 0}/></span></h5>
                            <h5><FormattedMessage {...il8n.AMOUNT_PAID} />: <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <span className={theme.price}>{amountPaid === null ? 'Loading ...' : <FormattedNumber value={amountPaid || 0}/>}</span></h5>
                            <h5><FormattedMessage {...il8n.AMOUNT_REMAINING} />: <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <span className={theme.price}>{ amountPaid === null ? 'Loading ...' : <FormattedNumber value={(amountPaid - amountPaid) || 0}/> } </span></h5>
                            <h5><FormattedMessage {...il8n.PROJECT_STATUS} />: <span className={theme.price}>{status} </span></h5>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

ProjectDetail.propTypes = {
    intl: intlShape.isRequired
};

ProjectDetail = createContainer((props) => {
    const { id } = props.params;
    const transactionHandle = Meteor.subscribe('projects.single', id);
    const project = Projects.findOne({_id: id});
    return {
        project: project ? project : {},
    };
}, ProjectDetail);

export default injectIntl(ProjectDetail);