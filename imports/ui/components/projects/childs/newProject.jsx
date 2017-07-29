import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';
import { Projects } from '../../../../api/projects/projects.js'

import { Input, Dropdown, DatePicker, Button, ProgressBar, Snackbar } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';

import theme from '../theme';
import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';


const il8n = defineMessages({
    NO_PROJECTS_ADDED: {
        id: 'PROJECTS.NO_PROJECTS_ADDED'
    },
    ADD_PROJECTS: {
        id: 'PROJECTS.ADD_PROJECT_TO_SHOW'
    },
    PROJECTS: {
        id: 'PROJECTS.SHOW_PROJECTS'
    },
    BANK_PROJECTS: {
        id: 'PROJECTS.BANK_PROJECTS'
    },
    INFORM_MESSAGE: {
        id: 'PROJECTS.INFORM_MESSAGE'
    },
    CONFIRMATION_MESSAGE: {
        id: 'PROJECTS.CONFIRMATION_MESSAGE'
    },
    BACK_BUTTON: {
        id: 'PROJECTS.BACK_BUTTON'
    },
    REMOVE_BUTTON: {
        id: 'PROJECTS.REMOVE_BUTTON'
    },
    ADD_NEW_PROJECTS: {
        id: 'PROJECTS.ADD_NEW_PROJECTS'
    },
    FILTER_BY_PROJECT_NAME: {
        id: 'PROJECTS.FILTER_BY_PROJECT_NAME'
    },
    FILTER_BY_CLIENT_NAME: {
        id: 'PROJECTS.FILTER_BY_CLIENT_NAME'
    },
    FILTER_BY_STATUS: {
        id: 'PROJECTS.FILTER_BY_STATUS'
    },
    DATE: {
        id: 'PROJECTS.DATE'
    },
    PROJECT: {
        id: 'PROJECTS.PROJECT'
    },
    CLIENT: {
        id: 'PROJECTS.CLIENT'
    },
    AMOUNT: {
        id: 'PROJECTS.AMOUNT'
    },
    STATUS: {
        id: 'PROJECTS.STATUS_OF_PROJECT'
    },
    PROGRESS: {
        id: 'PROJECTS.PROGRESS'
    },
    WAITING: {
        id: 'PROJECTS.WAITING'
    },
    COMPLETED: {
        id: 'PROJECTS.COMPLETED'
    },
    ADD_PROJECT_BUTTON: {
        id: 'PROJECTS.ADD_PROJECT_BUTTON'
    },
    UPDATE_PROJECT_BUTTON: {
        id: 'PROJECTS.UPDATE_PROJECT_BUTTON'
    },
    PROJECT_NAME: {
        id: 'PROJECTS.PROJECT_NAME'
    },
    CLIENT_NAME: {
        id: 'PROJECTS.CLIENT_NAME'
    },
    PROJECT_TYPE: {
        id: 'PROJECTS.PROJECT_TYPE'
    },
    PROJECT_AMOUNT: {
        id: 'PROJECTS.PROJECT_AMOUNT'
    },
    PROJECT_STATUS: {
        id: 'PROJECTS.PROJECT_STATUS'
    },
    PROJECT_START_DATE: {
        id: 'PROJECTS.START_DATE'
    },
    ADD_PROJECT: {
        id: 'PROJECTS.ADD_PROJECT'
    },
    UPDATE_PROJECT: {
        id: 'PROJECTS.UPDATE_PROJECT'
    }
});



class NewProjectPage extends Component {

    constructor(props) {
        super(props);

        const { formatMessage } = this.props.intl;

        this.state = {
            name: '',
            clientName: '',
            type: '',
            amount: '',
            status: '',
            startAt: '',
            active: false,
            loading: false
        };


        this.statuses = [
            {
                label: formatMessage(il8n.PROGRESS),
                value: 'progress'
            },
            {
                label: formatMessage(il8n.WAITING),
                value: 'waiting'
            },
            {
                label: formatMessage(il8n.COMPLETED),
                value: 'completed'
            }
        ];
    }

    setCurrentRoute(value){
        this.setState({
            isNew: value
        })
    }

    onSubmit(event){
        event.preventDefault();
        this.state.isNEW ? this.updateProject() : this.createProject();
        this.setState({loading: true})
    }
    createProject(){
        const {name, clientName, type, amount, status, startAt} = this.state;
        Meteor.call('projects.insert', {
            project: {
                name,
                client: {
                    name: clientName
                },
                type,
                amount: Number(amount),
                status,
                startAt
            }
        }, (err, response) => {
            if(response){
                routeHelpers.changeRoute('/app/projects', 1200);
                this.setState({
                    active: true,
                    barMessage: 'Project created successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }else{
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
            this.setState({loading: false})
        });
    }
    updateProject(){
        const {_id, name, clientName, type, amount, status, startAt} = this.state;
        Meteor.call('projects.update', {
            project: {
                _id,
                name,
                client: {
                    name: clientName
                },
                type,
                amount: Number(amount),
                status,
                startAt
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
                    barMessage: 'Project updated successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
            this.setState({loading: false})
        });
    }
    onChange (val, e) {
        this.setState({[e.target.name]: val});
    }
    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }
    progressBarToggle (){
        return this.state.loading ? 'progress-bar' : 'progress-bar hide';
    }
    componentDidMount (){
        console.log('is it working');
        let { project } = this.props;
        let { id } = this.props.params;
        let isNew = id === 'new';
        if( !isNew ){
            project && (project.clientName = project.client.name);
            this.setState(project);
            this.setCurrentRoute(isNew);
        }

    }
    renderButton (){
        const { formatMessage } = this.props.intl;
        let button;
        if(!this.props.project){
            button = <div className={theme.addBtn}><Button type='submit' icon='add' label={formatMessage(il8n.ADD_PROJECT_BUTTON)} raised primary /></div>
        }else{
            button = <div className={theme.addBtn}><Button type='submit' icon='mode_edit' label={formatMessage(il8n.UPDATE_PROJECT_BUTTON)} raised primary /></div>
        }
        return button;
    }
    render() {
        const { formatMessage } = this.props.intl;
        console.log(this.state);
        return (
            <form onSubmit={this.onSubmit.bind(this)} className={theme.addProject}>
                <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />

                <h4 className={theme.titleProject}>
                    {!this.props.project ? <FormattedMessage {...il8n.ADD_PROJECT} /> : <FormattedMessage {...il8n.UPDATE_PROJECT} />}
                </h4>

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

                <Input type='text' label={formatMessage(il8n.PROJECT_NAME)}
                       name='name'
                       maxLength={ 50 }
                       value={this.state.name}
                       onChange={this.onChange.bind(this)}
                       required
                />

                <Input type='text' label={formatMessage(il8n.CLIENT_NAME)}
                       name='clientName'
                       maxLength={ 50 }
                       value={this.state.clientName}
                       onChange={this.onChange.bind(this)}
                       required
                />

                <Input type='text' label={formatMessage(il8n.PROJECT_TYPE)}
                       name='type'
                       maxLength={ 50 }
                       value={this.state.type}
                       onChange={this.onChange.bind(this)}
                       required
                />

                <Input type='number' label={formatMessage(il8n.PROJECT_AMOUNT)}
                       name='amount'
                       value={this.state.amount}
                       onChange={this.onChange.bind(this)}
                />

                <Dropdown theme={theme} className={theme.projectStatus}
                          auto={true}
                          source={this.statuses}
                          name='status'
                          onChange={this.onChange.bind(this)}
                          label={formatMessage(il8n.PROJECT_STATUS)}
                          value={this.state.status}
                          required
                />

                <DatePicker
                    label={formatMessage(il8n.PROJECT_START_DATE)}
                    name='startAt'
                    onChange={this.onChange.bind(this)}
                    value={this.state.startAt}
                />

                {this.renderButton()}
            </form>
        );
    }
}

NewProjectPage.propTypes = {
    intl: intlShape.isRequired
};

NewProjectPage = createContainer((props) => {
    const { id } = props.params;
    const transactionHandle = Meteor.subscribe('projects.single', id);
    const project = Projects.findOne({_id: id});
    return {
        project: project ? project : {},
    };
}, NewProjectPage);

export default injectIntl(NewProjectPage);