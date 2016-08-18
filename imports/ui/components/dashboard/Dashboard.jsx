import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Card, CardTitle, CardMedia, CardText, CardActions, Button } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../../api/accounts/accounts.js';

class DashboardPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
    }

    render() {
        return (
            <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    <Card style={{width: '300px'}}>
                        <CardTitle
                            avatar="https://placeimg.com/80/80/animals"
                            title="Avatar style title"
                            subtitle="Subtitle here"
                            />
                        <CardText>
                        <strong>Avalible Balance : </strong> 500
                        </CardText>
                        <CardActions>
                            <Button label="Action 1" />
                            <Button label="Action 2" />
                        </CardActions>
                    </Card>
                    <Card style={{width: '300px'}}>
                        <CardTitle
                            avatar="https://placeimg.com/80/80/animals"
                            title="Avatar style title"
                            subtitle="Subtitle here"
                            />
                        <CardMedia
                            aspectRatio="wide"
                            image="https://placeimg.com/800/450/nature"
                            />
                        <CardTitle
                            title="Title goes here"
                            subtitle="Subtitle here"
                            />
                        <CardText>dsfsdf</CardText>
                        <CardActions>
                            <Button label="Action 1" />
                            <Button label="Action 2" />
                        </CardActions>
                    </Card>
                    <Card style={{width: '300px'}}>
                        <CardTitle
                            avatar="https://placeimg.com/80/80/animals"
                            title="Avatar style title"
                            subtitle="Subtitle here"
                            />
                        <CardMedia
                            aspectRatio="wide"
                            image="https://placeimg.com/800/450/nature"
                            />
                        <CardTitle
                            title="Title goes here"
                            subtitle="Subtitle here"
                            />
                        <CardText>dsfsdf</CardText>
                        <CardActions>
                            <Button label="Action 1" />
                            <Button label="Action 2" />
                        </CardActions>
                    </Card>
                    <Card style={{width: '300px'}}>
                        <CardTitle
                            avatar="https://placeimg.com/80/80/animals"
                            title="Avatar style title"
                            subtitle="Subtitle here"
                            />
                        <CardMedia
                            aspectRatio="wide"
                            image="https://placeimg.com/800/450/nature"
                            />
                        <CardTitle
                            title="Title goes here"
                            subtitle="Subtitle here"
                            />
                        <CardText>dsfsdf</CardText>
                        <CardActions>
                            <Button label="Action 1" />
                            <Button label="Action 2" />
                        </CardActions>
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