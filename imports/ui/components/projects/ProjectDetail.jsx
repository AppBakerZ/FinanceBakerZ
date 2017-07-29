import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import theme from './theme';
import { routeHelpers } from '../../../helpers/routeHelpers'
import { Projects } from '../../../api/projects/projects.js'
import { createContainer } from 'meteor/react-meteor-data';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';


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
            amountPaid: null
        };

        this.getPaidAmountOfProject()
    }
    getPaidAmountOfProject(){
        Meteor.call('statistics.incomesGroupByProject', {
            project: {
                _id: this.props.project._id
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
        let { id } = this.props.params;
        routeHelpers.changeRoute(`/app/projects/edit/${id}`);
    }

    removeProject(){
        const {_id} = this.props.params;
        Meteor.call('projects.remove', {
            project: {
                _id
            }
        }, (err, response) => {
            if(err){

            }else{

            }
        });
    }
    render() {
        let {project} = this.props;
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.contentParent}>
                <h4>{project.name}</h4>
                <div className={theme.contentTwo}>
                    <div> <p> <FormattedMessage {...il8n.CLIENT_NAME} /> </p> <p>{project.client && project.client.name}</p></div>
                    <div> <p> <FormattedMessage {...il8n.AMOUNT_AGREED} /></p> <p>{<FormattedNumber value={project.amount}/>}</p></div>
                    <div> <p><FormattedMessage {...il8n.AMOUNT_PAID} /></p> <p>{this.state.amountPaid === null ? 'Loading ...' : <FormattedNumber value={this.state.amountPaid}/>} </p></div>
                    <div> <p> <FormattedMessage {...il8n.AMOUNT_REMAINING} /> </p> <p>{ this.state.amountPaid === null ? 'Loading ...' : <FormattedNumber value={project.amount - this.state.amountPaid}/> } </p></div>
                    <div> <p> <FormattedMessage {...il8n.PROJECT_STATUS} /> </p> <p>{project.status}</p></div>
                </div>

                <div className={theme.buttonBox}>
                    <Button label= {formatMessage(il8n.EDIT_INFORMATION)} raised accent onClick={this.editProject.bind(this)} />
                    <Button label= {formatMessage(il8n.REMOVE_PROJECT)} raised accent onClick={this.removeProject.bind(this)} />
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