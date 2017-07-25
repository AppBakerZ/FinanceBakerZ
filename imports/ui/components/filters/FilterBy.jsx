import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Dropdown } from 'react-toolbox';
import {intlShape, injectIntl, defineMessages} from 'react-intl';
import { routeHelpers } from '../../../helpers/routeHelpers.js'

import theme from './theme';

const il8n = defineMessages({
    FILTER_BY: {
        id: 'TRANSACTIONS.FILTER_BY'
    },
    FILTER_BY_ALL: {
        id: 'TRANSACTIONS.FILTER_BY_ALL'
    },
    FILTER_BY_TODAY: {
        id: 'TRANSACTIONS.FILTER_BY_TODAY'
    },
    FILTER_BY_THIS_WEEK: {
        id: 'TRANSACTIONS.FILTER_BY_THIS_WEEK'
    },
    FILTER_BY_THIS_MONTH: {
        id: 'TRANSACTIONS.FILTER_BY_THIS_MONTH'
    },
    FILTER_BY_LAST_MONTH: {
        id: 'TRANSACTIONS.FILTER_BY_LAST_MONTH'
    },
    FILTER_BY_THIS_YEAR: {
        id: 'TRANSACTIONS.FILTER_BY_THIS_YEAR'
    },
    FILTER_BY_DATE_RANGE: {
        id: 'TRANSACTIONS.FILTER_BY_DATE_RANGE'
    }
});

class FilterBy extends Component {

    constructor(props) {
        super(props);
    }
    filters(){
        const { formatMessage } = this.props.intl;
        return [
            {
                name: formatMessage(il8n.FILTER_BY_ALL),
                value: 'all'
            },
            {
                name: formatMessage(il8n.FILTER_BY_TODAY),
                value: 'day'
            },
            {
                name: formatMessage(il8n.FILTER_BY_THIS_WEEK),
                value: 'week'
            },
            {
                name: formatMessage(il8n.FILTER_BY_THIS_MONTH),
                value: 'month'
            },
            {
                name: formatMessage(il8n.FILTER_BY_LAST_MONTH),
                value: 'months'
            },
            {
                name: formatMessage(il8n.FILTER_BY_THIS_YEAR),
                value: 'year'
            },
            {
                name: formatMessage(il8n.FILTER_BY_DATE_RANGE),
                value: 'range'
            }
        ];
    }
    selectFilter (filter) {
        let { parentProps } = this.props.parentProps;
        let { location, history } = parentProps;
        let query = location.query;
        let pathname = routeHelpers.resetPagination(location.pathname);
        // transaction filter
        if( query.filter !== filter ){
            query.filter = filter;
            history.push({
                pathname: pathname,
                query: query
            });
        }

    }
    filterItem (filter) {
        return (
            <div>
                <strong>{filter.name}</strong>
            </div>
        );
    }
    render() {
        const { formatMessage } = this.props.intl;
        return (
            <Dropdown
                className={theme.filterDropDowns}
                auto={false}
                source={this.filters()}
                name='filterBy'
                onChange={this.selectFilter.bind(this)}
                label={formatMessage(il8n.FILTER_BY)}
                value={this.props.local.filter}
                template={this.filterItem}
            />
        );
    }
}

export default injectIntl(createContainer(() => {
    return {
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, FilterBy));