import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Autocomplete } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';

import { Categories } from '../../../api/categories/categories.js';

class CategoriesDD extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }
    categories(){
        let categories = {};
        this.props.categories.forEach((project) => {
            categories[project._id] = project.name;
        });

        return categories;
    }

    filterByCategories(categories) {
        updateFilter('reports', 'categories', categories)
    }

    render() {
        console.log('local ', this.props.local);
        return (
            <Autocomplete
                direction='down'
                onChange={this.filterByCategories.bind(this)}
                label='Categories'
                source={this.categories()}
                value={this.props.local.categories}
                />
        );
    }
}

CategoriesDD.propTypes = {
    categories: PropTypes.array.isRequired
};

export default createContainer(() => {

    Meteor.subscribe('categories');
    const categories = Categories.find().fetch();

    return {
        categories,
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, CategoriesDD);