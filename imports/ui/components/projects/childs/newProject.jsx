import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { _ } from 'underscore'
import { createContainer } from 'meteor/react-meteor-data';
import { routeHelpers } from '../../../../helpers/routeHelpers.js'

import { Input, Button, ProgressBar, Snackbar, Dropdown, DatePicker, TimePicker, FontIcon, IconButton } from 'react-toolbox';
import { Card} from 'react-toolbox/lib/card';

import { Meteor } from 'meteor/meteor';

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';

import { Projects } from '../../../../api/projects/projects.js'


import theme from './theme.scss';


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
    FIXED: {
        id: 'PROJECTS.FIXED'
    },
    HOURLY: {
        id: 'PROJECTS.HOURLY'
    },
    WEEKLY: {
        id: 'PROJECTS.WEEKLY'
    },
    MONTHLY: {
        id: 'PROJECTS.MONTHLY'
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
            isNew: false,
            clientDetails: [],
            name: '',
            clientName: '',
            type: '',
            amount: '',
            status: '',
            startAt: '',
            active: false,
            loading: false,
            customField: '',
            customFields: []
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

        this.types = [
            {
                label: formatMessage(il8n.FIXED),
                value: 'fixed'
            },
            {
                label: formatMessage(il8n.HOURLY),
                value: 'hourly'
            },
            {
                label: formatMessage(il8n.WEEKLY),
                value: 'weekly'
            },
            {
                label: formatMessage(il8n.MONTHLY),
                value: 'monthly'
            }
        ];
        this.customFields = [
            {
                label: 'Name',
                value: 'name'
            },
            {
                label: 'Contact',
                value: 'contact'
            },
            {
                label: 'custom',
                value: 'custom'
            }
        ]
    }



    setCurrentRoute(value){
        this.setState({
            isNew: value
        })
    }

    componentDidMount (){
        let { project } = this.props;
        let { id } = this.props.params;
        let isNew = id === 'new';
        if( !isNew ){
            Object.keys(project).length && (project.clientName = project.client.name);
            project = _.extend(this.state, project);
            this.setState(project);
        }
        this.setCurrentRoute(isNew);
    }

    changeClientDetails (idx, val)  {
        const newShareholders = this.state.clientDetails.map((customField, sidx) => {
            if (idx !== sidx) return customField;
            return { ...customField, value : val };
        });

        this.setState({ clientDetails: newShareholders });
    }

    addCustomField () {
        let { customField, customFields } = this.state, errMessage, flag = false;
        if (!this.state.customField){
            errMessage = 'You must select Custom Field name From above Drop Down';
            flag = true;
        }
        else if(customFields.includes(customField)){
            errMessage = `The ${customField} already added`;
            flag = true;
        }
        if(flag){
            this.setState({
                active: true,
                barMessage: errMessage,
                barIcon: 'error_outline',
                barType: 'cancel'
            });
            return
        }

        customFields.push(customField)
        this.setState({
            clientDetails: this.state.clientDetails.concat([{ name: this.state.customField, value: ''}]),
            customFields: customFields
        });
        console.log(this.state)
    }

    changeCustomField (evt, val)  {
        // const newShareholders = this.state.customFields.map((customField, sidx) => {
        //     if (idx !== sidx) return customField;
        //     return { ...customField, value : val };
        // });
        //
        // this.setState({ clientDetails: newShareholders });
    }

    removeCustomField (idx) {
        this.setState({
            clientDetails: this.state.clientDetails.filter((s, sidx) => idx !== sidx)
        });
    }

    onSubmit(event){
        event.preventDefault();
        this.state.isNew ? this.createProject(): this.updateProject();
        this.setState({loading: true})
    }

    createProject(){
        const {name, clientName, type, amount, status, startAt, clientDetails} = this.state;
        let clientObj = _.extend.apply(null, clientDetails);
        console.log(clientObj)
        return false;

        Meteor.call('projects.insert', {
            project: {
                name,
                client: clientObj,
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
        return this.props.loading || this.state.loading ? 'progress-bar' : 'progress-bar hide';
    }

    renderButton (){
        const { formatMessage } = this.props.intl;
        let button;
        if(this.state.isNew){
            button = <div className={theme.addBtn}><Button type='submit' icon='add' label={formatMessage(il8n.ADD_PROJECT_BUTTON)} raised primary /></div>
        }else{
            button = <div className={theme.addBtn}><Button type='submit' icon='mode_edit' label={formatMessage(il8n.UPDATE_PROJECT_BUTTON)} raised primary /></div>
        }
        return button;
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.incomeCard}>
                <Card theme={theme}>
                    <h3>{this.state.isNew ? <FormattedMessage {...il8n.ADD_PROJECT} /> : <FormattedMessage {...il8n.UPDATE_PROJECT} />}</h3>
                    <form onSubmit={this.onSubmit.bind(this)} className={theme.incomeForm}>

                        <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />

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

                        <h4>Client Details</h4>

                        <Input type='text' label={formatMessage(il8n.PROJECT_NAME)}
                               name='name'
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

                        <Dropdown theme={theme} className={theme.projectStatus}
                                  source={this.types}
                                  name='type'
                                  onChange={this.onChange.bind(this)}
                                  label={formatMessage(il8n.PROJECT_TYPE)}
                                  value={this.state.type}
                                  required
                        />

                        <Input type='number' label={formatMessage(il8n.PROJECT_AMOUNT)}
                               name='amount'
                               value={this.state.amount}
                               onChange={this.onChange.bind(this)}
                        />

                        <Dropdown theme={theme} className={theme.projectStatus}
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

                        <h4 className={theme.clientHeading}>client details</h4>
                        <Dropdown theme={theme} className={theme.projectCustomField}
                                  source={this.customFields}
                                  name='customField'
                                  onChange={this.onChange.bind(this)}
                                  label={formatMessage(il8n.PROJECT_TYPE)}
                                  value={this.state.customField}
                                  required
                        />
                        <div className={theme.closeBtnParent}>
                            <Button
                                label=''
                                icon='close'
                                raised
                            />
                        </div>


                        {this.state.clientDetails.map((customField, idx) => (
                            <div className="customField" key={idx + 1}>
                                <Input className={theme.projectCustomField} type='text' label={customField.name}
                                       name={customField.name}
                                       value={customField.value}
                                       onChange={this.changeClientDetails.bind(this, idx)}
                                       required
                                />
                                <div className={theme.closeBtnParent}>
                                    <Button onClick={this.removeCustomField.bind(this, idx)}
                                        label=''
                                        icon='close'
                                        raised
                                    />
                                </div>
                            </div>
                        ))}

                        <div className={theme.btnParents}>
                            <Button icon='add' onClick={this.addCustomField.bind(this)} label="Add custom fields" raised primary />
                        </div>



                        {this.renderButton()}
                    </form>
                </Card>
            </div>
        );
    }
}

NewProjectPage.propTypes = {
    project: PropTypes.object.isRequired,
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