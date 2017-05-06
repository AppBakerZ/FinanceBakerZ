import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import theme from './theme';
import {FormattedMessage, defineMessages} from 'react-intl';


const il8n = defineMessages({
    CLIENT_NAME: {
        id: 'PROJECTS.CLIENT'
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






export default class ProjectDetail extends Component {

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
    render() {
        let {project} = this.props;
        return (
            <div className={theme.contentParent}>
                <h4>{project.name}</h4>
                <div className={theme.contentTwo}>
                    <div> <p> <FormattedMessage {...il8n.CLIENT_NAME} /> </p> <p>{project.client.name}</p></div>
                    <div> <p> <FormattedMessage {...il8n.AMOUNT_AGREED} /></p> <p>{project.amount}</p></div>
                    <div> <p><FormattedMessage {...il8n.AMOUNT_PAID} /></p> <p>{this.state.amountPaid == null ? 'Loading ...' : this.state.amountPaid} </p></div>
                    <div> <p> <FormattedMessage {...il8n.AMOUNT_REMAINING} /> </p> <p>{ this.state.amountPaid == null ? 'Loading ...' : project.amount - this.state.amountPaid } </p></div>
                    <div> <p> <FormattedMessage {...il8n.PROJECT_STATUS} /> </p> <p>{project.status}</p></div>
                </div>

                <div className={theme.buttonBox}>
                    <Button label= {<FormattedMessage {...il8n.EDIT_INFORMATION} />} raised accent onClick={this.props.openPopup.bind(null, 'edit', project)} />
                    <Button label= {<FormattedMessage {...il8n.REMOVE_PROJECT} />} raised accent onClick={this.props.openPopup.bind(null, 'remove', project)} />
                </div>
            </div>
        );
    }
}