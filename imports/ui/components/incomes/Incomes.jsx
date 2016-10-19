import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { List, ListItem, Button, IconButton, ListSubHeader } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Incomes } from '../../../api/incomes/incomes.js';

import iScroll from 'iscroll'
import ReactIScroll from 'react-iscroll'

const iScrollOptions = {
    mouseWheel: true,
    scrollbars: true,
    scrollX: true,
    click : true
};


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

        const { incomes } = this.props;
        let groupedIncomes = _.groupBy(incomes, (result) => moment(result['receivedAt'], 'DD/MM/YYYY').format("YYYY-MM-DD"));

        return _.map(groupedIncomes, (incomes, date) => {

            let items = incomes.map((income) => {
                return <Link
                    key={income._id}
                    activeClassName='active'
                    to={`/app/incomes/${income._id}`}>

                    <ListItem
                        selectable
                        onClick={ this.toggleSidebar.bind(this) }
                        leftIcon='monetization_on'
                        rightIcon='mode_edit'
                        caption={`PKR : ${income.amount}`}
                        legend={`Project: ${income.project}`}
                        />
                </Link>
            });

            return (
                <section key={date}>
                    <ListSubHeader caption={moment(date).format('ll')} />
                    {items}
                </section>
            )
        });

    }

    render() {
        return (
            <ReactIScroll iScroll={iScroll} options={iScrollOptions}>
                <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                    <Link
                        to={`/app/incomes/new`}>
                        <Button onClick={ this.toggleSidebar.bind(this) } icon='add' floating accent className='add-button' />
                    </Link>
                    <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
                        <List ripple className='list'>
                            {this.renderIncome()}
                        </List>
                    </div>
                </div>
            </ReactIScroll>

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