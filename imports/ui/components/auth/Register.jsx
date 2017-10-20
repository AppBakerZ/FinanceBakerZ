import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { routeHelpers } from '../../../helpers/routeHelpers'
import { stringHelpers } from '../../../helpers/stringHelpers'
import { AppConfig } from '/imports/utils/config.js'

import { IconButton, Input, Button, Dropdown } from 'react-toolbox';

import { Accounts } from 'meteor/accounts-base'

import theme from './theme';

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';


const il8n = defineMessages({
    USERNAME: {
        id: 'REGISTER.FULLNAME'
    },
    USERNAMEOREMAIL: {
        id: 'REGISTER.USERNAMEOREMAIL'
    },
    PASSWORD: {
        id: 'REGISTER.PASSWORD'
    },
    LOGIN_BUTTON: {
        id: 'REGISTER.LOGIN_BUTTON'
    },
    REGISTER_BUTTON: {
        id: 'REGISTER.REGISTER_BUTTON'
    }
});


// App component - represents the whole app
class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            plan: props.location.query.plan || '',
            fullName: '',
            usernameOrEmail: '',
            password: '',
            loading: false
        }
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
    }

    onClick (){
        routeHelpers.changeRoute('/');
    }

    onSubmit(event){
        event.preventDefault();

        const {fullName, usernameOrEmail, password, plan} = this.state;
        if(!Object.keys(plan).length){
            this.props.showSnackbar({
                activeSnackbar: true,
                barMessage: 'You must select the membership plan',
                barIcon: 'error_outline',
                barType: 'cancel'
            });
            return
        }
        let selector;
        if (typeof usernameOrEmail === 'string')
            if (usernameOrEmail.indexOf('@') === -1)
                selector = {username: usernameOrEmail};
            else
                selector = {email: usernameOrEmail};

        const key = Object.keys(selector)[0];
        this.props.progressBarUpdate(true);
        let currency = {label: "Pakistani Rupee", value: "currency-Pakistani-Rupee"},
            language = { label: 'English', value: 'en', direction: 'ltr' },
            businessPlan = plan,
            emailNotification = true;

        Accounts.createUser({
            [key]: selector[key],
            password,
            profile: {
                businessPlan,
                fullName,
                currency,
                emailNotification,
                language
            }
        }, (err) => {
            if(err){
                this.props.showSnackbar({
                    activeSnackbar: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }else{
                this.props.showSnackbar({
                    activeSnackbar: true,
                    barMessage: 'Successfully Registered',
                    barIcon: 'done',
                    barType: 'accept'
                }

                );
                setTimeout(() => {
                    routeHelpers.changeRoute('/app/settings');
                }, 1000);
            }
            this.props.progressBarUpdate(false);
        });
    }

    plans(){
        return AppConfig.availablePlans.map((plan, i)=>{
            if(i === 0){
                return {
                    title: stringHelpers.capitalize(plan),
                    value: plan.toLowerCase(),
                }
            }
            else{
                return {
                    title: `${stringHelpers.capitalize(plan)} (6 months trial)`,
                    value: plan.toLowerCase(),
                }
            }

        });
    }

    businessPlans (plan) {
        return (
            <strong>{plan.title}</strong>
        );
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <form onSubmit={this.onSubmit.bind(this)} className="login register" autoComplete={'off'}>
                <div className={theme.logoWithText}>
                    <img src={'../assets/images/logo-withText.png'} alt="Logo With Text" />
                </div>
                <Dropdown className={theme.selectRegister}
                    source={this.plans()}
                    name='plan'
                    label="Select Plan"
                    onChange={this.onChange.bind(this)}
                    value={this.state.plan}
                    template={this.businessPlans}
                    required
                />
                <Input type='text' label={formatMessage(il8n.USERNAME)}
                       name='fullName'
                       maxLength={ 30 }
                       value={this.state.fullName}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='text' label={formatMessage(il8n.USERNAMEOREMAIL)}
                       name='usernameOrEmail'
                       maxLength={ 30 }
                       value={this.state.usernameOrEmail}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <Input type='password' label={formatMessage(il8n.PASSWORD)}
                       name='password'
                       maxLength={ 20 }
                       value={this.state.password}
                       onChange={this.onChange.bind(this)}
                       required
                    />
                <div className={theme.buttonParents}>
                    <div className={theme.buttonGroup}>
                        <Button type='submit' disabled={this.props.loading} icon='person_add' label={formatMessage(il8n.REGISTER_BUTTON)} raised primary />
                    </div>
                    <div className={theme.buttonGroup}>
                        <Button type='button' disabled={this.props.loading} onClick={this.onClick.bind(this)} icon='lock_open' label={formatMessage(il8n.LOGIN_BUTTON)} raised accent />
                    </div>
                </div>

            </form>
        );
    }
}

Register.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(Register);