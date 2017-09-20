import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { _ } from 'underscore'
import { createContainer } from 'meteor/react-meteor-data';
import { Autocomplete, Checkbox } from 'react-toolbox';
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
        this.state = {
            categories: [],
            selectedCategories: [],
            childrenIncluded: false
        }
    }

    categories() {
        let categories = {};
        this.props.categories.forEach((category) => {
            categories[category._id] = category.name;
        });

        return categories;
    }
    updateFilter(proxy, e){
        let { categories } = this.state;
        const allCategories = this.props.categories;
        if(e.target.checked && categories){
                let childCategories = allCategories.filter(child => {
                    return child.parent && child.parent.id === categories
                });
                if(childCategories.length){
                    childCategories = childCategories.map(cat => {
                        return cat._id
                    });
                    categories = _.union(categories, childCategories)
                }
        }
        else{
            categories = categories.slice(0, 1);
        }
        this.setState({
            childrenIncluded: e.target.checked,
            categories,
        });
        this.updateCategories(categories)
    }

    updateCategories(categories){
        // const { categories } = this.state;
        console.log('state', categories);
        let { parentProps } = this.props.parentProps;
        let { location } = parentProps;
        let pathname = routeHelpers.resetPagination(location.pathname);
        let query = location.query;
        query.categories = `${[categories]}`;
        routeHelpers.changeRoute(pathname, 0, query);
    }

    filterByCategories(category) {
        const allCategories = this.props.categories;
        // category = categories.slice(0, 1);
        if(this.state.childrenIncluded){
                let childCategories = allCategories.filter(child => {
                    return child.parent && child.parent.id === category
                });
                if(childCategories.length){
                    childCategories = childCategories.map(cat => {
                        return cat._id
                    });
                    category = _.union(category, childCategories)
                }

        }
        this.setState({
            categories: category
        })
        this.updateCategories(category)

        // if(category){
        //     let childCategories = allCategories.filter(child => {
        //         return child.parent && child.parent.id === category
        //     });
        //     if(childCategories.length){
        //         childCategories = childCategories.map(cat => {
        //             return cat._id
        //         });
        //         category = _.union(category, childCategories);
        //     }
        //
        // }
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
                    multiple={false}
                    />

                <Checkbox
                          checked={this.state.childrenIncluded}
                          label="Include Children"
                          onChange={this.updateFilter.bind(this)}
                          />
            </div>
        );
    }
}

CategoriesDD.propTypes = {
    categories: PropTypes.array.isRequired,
    parentProps: PropTypes.object.isRequired
};

export default injectIntl(createContainer((props) => {

    Meteor.subscribe('categories');
    const categories = Categories.find().fetch();
    let { parentProps } = props;
    return {
        categories,
        local: LocalCollection.findOne({
            name: parentProps.collection
        })
    };
}, CategoriesDD));