import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { List, ListItem, ListDivider, Button, IconButton, ListSubHeader } from 'react-toolbox';
import { Link } from 'react-router'

import { ReactiveVar } from 'meteor/reactive-var'
import { Meteor } from 'meteor/meteor';
import { Expenses } from '../../../api/expences/expenses.js';
import { Categories } from '../../../api/categories/categories.js';

import iScroll from 'iscroll'
import ReactIScroll from 'react-iscroll'

const iScrollOptions = {
    mouseWheel: true,
    scrollbars: true,
    scrollX: true
};

const RECORDS_PER_PAGE = 8;
let pageNumber = new ReactiveVar(1);

let heightOfScroll ;

class ExpensesPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
    }

    handleScroll(event) {
        let reqLength = Math.abs(event.maxScrollY - event.y);
        if(event.maxScrollY != heightOfScroll && reqLength < 100 ){
            heightOfScroll = event.maxScrollY;
            pageNumber.set(pageNumber.get() + 1);
        }
    }

    getCategoryName(_id){
        const category = this.props.categories.filter((c) => { return c._id == _id });
        return category.length ? category[0].name : _id;
    }

    formatNumber(num){
        return new Intl.NumberFormat().format(num);
    }

    renderExpense(){
        const { expenses } = this.props;

        let groupedExpenses = _.groupBy(expenses, (result) => moment(result['spentAt'], 'DD/MM/YYYY').format("YYYY-MM-DD"));

        return _.map(groupedExpenses, (expenses, date) => {
            let items = expenses.map((expense) => {
                return <Link
                    key={expense._id}
                    activeClassName='active'
                    to={`/app/expenses/${expense._id}`}>

                    <ListItem
                        selectable
                        onClick={ this.toggleSidebar.bind(this) }
                        leftIcon='content_cut'
                        rightIcon='mode_edit'
                        caption={`PKR : ${this.formatNumber(expense.amount)}`}
                        legend={`CATEGORY : ${this.getCategoryName(expense.category)} - DESCRIPTION: ${expense.description}`}
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

                <div style={{ flex: 1, display: 'flex', position: 'relative' }} >
                    <Link
                        to={`/app/expenses/new`}>
                        <Button onClick={ this.toggleSidebar.bind(this) } icon='add' floating accent className='add-button' />
                    </Link>
                    <ReactIScroll iScroll={iScroll} options={iScrollOptions} onScrollEnd={this.handleScroll} >
                        <List ripple>
                            {this.renderExpense()}
                        </List>
                    </ReactIScroll>
                </div>
        );
    }
}

ExpensesPage.propTypes = {
    expenses: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('expenses', RECORDS_PER_PAGE * pageNumber.get());
    const accountsHandle = Meteor.subscribe('categories');

    return {
        expenses: Expenses.find({}).fetch(),
        categories: Categories.find({}).fetch()
    };
}, ExpensesPage);