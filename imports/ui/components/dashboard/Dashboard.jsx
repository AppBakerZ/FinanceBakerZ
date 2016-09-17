import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Card, CardTitle, Button, FontIcon, Autocomplete, Dropdown } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';

class DashboardPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            totalIncomes: 0,
            totalExpenses: 0,
            availableBalance: 0,
            multiple: [],
            filterBy: 'this_month'
        };
    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
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
        this.getAvailableBalance(accounts);
        this.getTotalIncomesAndExpenses(accounts);
    }

    getAvailableBalance (accounts){
        Meteor.call('statistics.availableBalance', {accounts}, (err, ab) => {
            if(ab){
                this.setState({
                    availableBalance: ab
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

    getTotalIncomesAndExpenses (accounts, filterBy){
        let date = {};
        switch (filterBy || this.state.filterBy){
            case 'today':
                date.start = moment().startOf('day').format();
                date.end = moment().endOf('day').format();
                break;
            case 'this_week':
                date.start = moment().startOf('week').format();
                date.end = moment().endOf('week').format();
                break;
            case 'this_month':
                date.start = moment().startOf('month').format();
                date.end = moment().endOf('month').format();
                break;
            case 'last_month':
                date.start = moment().subtract(1, 'months').startOf('month').format();
                date.end = moment().subtract(1, 'months').endOf('month').format();
                break;
            case 'this_year':
                date.start = moment().startOf('year').format();
                date.end = moment().endOf('year').format();
                break;
        }
        Meteor.call('statistics.totalIncomesAndExpenses', {accounts, date}, (err, totals) => {
            if(totals){
                this.setState({
                    totalIncomes: totals.incomes,
                    totalExpenses: totals.expenses
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

    filterItem (account) {
        const containerStyle = {
            display: 'flex',
            flexDirection: 'row'
        };

        const contentStyle = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 2
        };

        return (
            <div style={containerStyle}>
                <div style={contentStyle}>
                    <strong>{account.name}</strong>
                </div>
            </div>
        );
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
        this.getTotalIncomesAndExpenses(this.state.multiple, val);
    }

    accounts(){
        let accounts = {};
        this.props.accounts.forEach((account) => {
            accounts[account._id] = account.name;
        });
        return accounts;
    }

    filters(){
      return [
        {
          name: 'Today',
          value: 'today'
        },
        {
          name: 'This Week',
          value: 'this_week'
        },
        {
          name: 'This Month',
          value: 'this_month'
        },
        {
          name: 'Last Month',
          value: 'last_month'
        },
        {
          name: 'This Year',
          value: 'this_year'
        }
      ];
    }

    render() {
        return (
            <div style={{ flex: 1, padding: '0 1.8rem 1.8rem 0', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Autocomplete
                        className='dashboard-autocomplete'
                        direction='down'
                        name='multiple'
                        onChange={this.handleMultipleChange.bind(this)}
                        label='Filter By Account'
                        source={this.accounts()}
                        value={this.state.multiple}
                        />
                    <Card className='dashboard-card'>
                        <CardTitle
                            title={'' + this.state.availableBalance}
                            subtitle='Available Balance'
                            />
                    </Card>
                    <Dropdown
                        className='dashboard-dropdown'
                        auto={false}
                        source={this.filters()}
                        name='filterBy'
                        onChange={this.onChange.bind(this)}
                        label='Filter By'
                        value={this.state.filterBy}
                        template={this.filterItem}
                        required
                        />
                      <div className='dashboard-card-group'>
                        <Card className='card'>
                            <CardTitle
                                title={'' + this.state.totalIncomes}
                                subtitle='Total Incomes'
                                />
                        </Card>
                        <Card className='card'>
                            <CardTitle
                                title={'' + this.state.totalExpenses}
                                subtitle='Total Expensis'
                                />
                        </Card>
                      </div>
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
