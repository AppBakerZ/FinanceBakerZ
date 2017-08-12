import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';
import { Autocomplete } from 'react-toolbox';
import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';
import {intlShape, injectIntl, defineMessages} from 'react-intl';
import { routeHelpers } from '../../../helpers/routeHelpers.js'

import theme from './theme';

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
        let { parentProps } = this.props.parentProps;
        let { location } = parentProps;
        let pathname = routeHelpers.resetPagination(location.pathname);
        let query = location.query;
        query.categories = `${[categories]}`;
        routeHelpers.changeRoute(pathname, 0, query);
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.autoCompleteIncomeParent}>
                <Autocomplete
                    theme={theme}
                    className={theme.autoCompleteIncome}
                    direction='down'
                    onChange={this.filterByCategories.bind(this)}
                    label={formatMessage(il8n.FILTER_BY_CATEGORY)}
                    source={this.categories()}
                    value={this.props.local.categories}
                    />
            </div>
        );
    }
}

CategoriesDD.propTypes = {
    categories: PropTypes.array.isRequired,
    parentProps: PropTypes.object.isRequired
};

export default injectIntl(createContainer(() => {

    Meteor.subscribe('categories');
    const categories = Categories.find().fetch();

    return {
        categories,
        local: LocalCollection.findOne({
            name: 'localTransactions'
        })
    };
}, CategoriesDD));