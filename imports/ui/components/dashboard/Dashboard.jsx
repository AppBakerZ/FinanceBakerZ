import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Card, CardTitle, CardMedia, CardText, CardActions, Button, FontIcon, Tabs, Tab } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';

class DashboardPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 1
        };

    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
    }

    handleTabChange (index) {
        this.setState({index});
    }

    render() {
        return (
            <div style={{ flex: 1, padding: '0 1.8rem 1.8rem 0', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Card className='dashboard-card' >
                        <Tabs index={this.state.index} onChange={this.handleTabChange.bind(this)}>
                            <Tab label='All'>
                                <small>
                                    <CardTitle
                                        title='Meezan Bank'
                                        subtitle='Salary'
                                        />

                                    <CardText>
                                        <strong>Available Balance : </strong><strong style={{fontSize: '20px'}}>300</strong> <br/>
                                        <strong>Incomes : </strong><strong style={{fontSize: '20px'}}>600</strong> <br/>
                                        <strong>Expenses : </strong><strong style={{fontSize: '20px'}}>300</strong>
                                    </CardText>
                                    <CardActions>
                                        <Button label="Incomes" icon='monetization_on' primary />
                                        <Button label="Expenses" icon='content_cut' />
                                    </CardActions>
                                </small>
                            </Tab>
                            <Tab label='This Week'>
                                <small>Primary content</small>
                            </Tab>
                            <Tab label='August'>
                                <small>Secondary content</small>
                            </Tab>
                            <Tab label='2016'>
                                <small>Fifth content</small>
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