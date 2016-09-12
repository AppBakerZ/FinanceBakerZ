import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Card, CardTitle, CardMedia, CardText, CardActions, Button, FontIcon, Tabs, Tab, Autocomplete } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';

class DashboardPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            totalIncome: 0,
            totalExpense: 0,
            multiple: []
        };
        let d = new Date();
        this.month = d.getMonth();
        this.year = d.getYear();
    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
    }

    handleTabChange (index) {
        this.setState({index});
    }

    componentWillReceiveProps (p){
        this.setDefaultAccounts(p);
    }

    componentWillMount(){
        this.setDefaultAccounts(this.props);
    }

    setDefaultAccounts (props){
        let multiple = [];
        props.accounts.forEach((account) => {
            multiple.push(account._id);
        });
        this.setState({multiple});
        this.updateByAccount(multiple)
    }
    updateByAccount(accounts){
        this.getTotalIncome(accounts);
        this.getTotalExpense(accounts);
    }

    getTotalIncome (accounts){
        Meteor.call('incomes.total', {accounts}, (err, response) => {
            if(response){
                this.setState({
                    totalIncome: response[0].total
                })
            }else{
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
        });
    }

    getTotalExpense (accounts){
        Meteor.call('expenses.total', {accounts}, (err, response) => {
            if(response){
                this.setState({
                    totalExpense: response[0].total
                })
            }else{
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
        });
    }

    handleMultipleChange (value) {
        this.setState({multiple: value});
        this.updateByAccount(value)
    }

    getStatisticsRendered(filterBy){
        return (
            <small>
                <CardText>
                    <strong>Available Balance : </strong><strong style={{fontSize: '20px'}}>
                    {this.state.totalIncome - this.state.totalExpense}
                </strong> <br/>
                    <strong>Incomes : </strong><strong style={{fontSize: '20px'}}>{this.state.totalIncome}</strong> <br/>
                    <strong>Expenses : </strong><strong style={{fontSize: '20px'}}>{this.state.totalExpense}</strong>
                </CardText>
            </small>
        )
    }

    accounts(){
        let accounts = {};
        this.props.accounts.forEach((account) => {
            accounts[account._id] = account.name;
        });
        return accounts;
    }

    render() {
        return (
            <div style={{ flex: 1, padding: '0 1.8rem 1.8rem 0', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Autocomplete
                        className='dashboard-autocomplete'
                        direction="down"
                        name='multiple'
                        onChange={this.handleMultipleChange.bind(this)}
                        label="Filter By Account"
                        source={this.accounts()}
                        value={this.state.multiple}
                        />
                    <Card className='dashboard-card'>
                        <CardTitle
                            title={'' + (this.state.totalIncome - this.state.totalExpense)}
                            subtitle="Available Balance"
                            />
                    </Card>
                    <Card className='dashboard-card' >
                        <Tabs index={this.state.index} onChange={this.handleTabChange.bind(this)}>
                            <Tab label='All'>
                                {this.getStatisticsRendered('all')}
                            </Tab>
                            <Tab label='This Week'>
                                {this.getStatisticsRendered('week')}
                            </Tab>
                            <Tab label={this.month}>
                                {this.getStatisticsRendered('month')}
                            </Tab>
                            <Tab label={this.year}>
                                {this.getStatisticsRendered('year')}
                            </Tab>
                        </Tabs>
                    </Card>
                </div>
            </div>
        );
    }
}

DashboardPage.propTypes = {
    accounts: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('accounts');

    return {
        accounts: Accounts.find({}).fetch()
    };
}, DashboardPage);