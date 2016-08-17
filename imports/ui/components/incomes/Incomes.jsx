import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { List, ListItem, ListDivider, Button, IconButton } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Incomes } from '../../../api/incomes/incomes.js';

class IncomesPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
    }

    renderIncome(){
        return this.props.incomes.map((income) => {
            return <Link
                key={income._id}
                activeClassName='active'
                to={`/app/incomes/${income._id}`}>
                <ListItem
                    selectable
                    onClick={ this.toggleSidebar.bind(this) }
                    leftIcon='input'
                    rightIcon='mode_edit'
                    caption={`PKR : ${income.amount}`}
                    legend={`Project: ${income.project}`}
                    />
            </Link>
        })
    }

    render() {
        return (
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                <Link
                    to={`/app/incomes/new`}>
                    <Button onClick={ this.toggleSidebar.bind(this) } icon='add' floating accent className='add-button' />
                </Link>
                <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
                    <List ripple>
                        {this.renderIncome()}
                    </List>
                </div>
            </div>
        );
    }
}

IncomesPage.propTypes = {
    incomes: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('incomes');

    return {
        incomes: Incomes.find({}).fetch()
    };
}, IncomesPage);