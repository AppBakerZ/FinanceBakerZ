import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { List, ListItem, Button, IconButton, ListSubHeader } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';

class CategoriesPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
    }

    renderCategory(){

        const { categories } = this.props;
        let items = categories.map((category) => {
            return <Link
                key={category._id}
                activeClassName='active'
                to={`/app/categories/${category._id}`}>

                <ListItem
                    selectable
                    onClick={ this.toggleSidebar.bind(this) }
                    leftIcon={category.icon}
                    rightIcon='mode_edit'
                    caption={category.name}
                    legend={category.children ? category.children.join(' | ') : ''}
                    />
            </Link>
        });

        return (
            <section>
                {items}
            </section>
        )
    }

    render() {
        return (
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                <Link
                    to={`/app/categories/new`}>
                    <Button onClick={ this.toggleSidebar.bind(this) } icon='add' floating accent className='add-button' />
                </Link>
                <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
                    <List ripple className='list'>
                        {this.renderCategory()}
                    </List>
                </div>
            </div>
        );
    }
}

CategoriesPage.propTypes = {
    categories: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('categories');

    return {
        categories: Categories.find({}).fetch()
    };
}, CategoriesPage);