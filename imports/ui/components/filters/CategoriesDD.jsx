import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Autocomplete } from 'react-toolbox';
import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';
import {intlShape, injectIntl, defineMessages} from 'react-intl';

const il8n = defineMessages({
    FILTER_BY_CATEGORY: {
        id: 'TRANSACTIONS.FILTER_BY_CATEGORY'
    }
});

class CategoriesDD extends Component {

    constructor(props) {
        super(props);
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
        const { formatMessage } = this.props.intl;
        return (
            <Autocomplete
                direction='down'
                onChange={this.filterByCategories.bind(this)}
                label={formatMessage(il8n.FILTER_BY_CATEGORY)}
                source={this.categories()}
                value={this.props.local.categories}
                />
        );
    }
}

CategoriesDD.propTypes = {
    categories: PropTypes.array.isRequired
};

export default injectIntl(createContainer(() => {

    Meteor.subscribe('categories');
    const categories = Categories.find().fetch();

    return {
        categories,
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, CategoriesDD));