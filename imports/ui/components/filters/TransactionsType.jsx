import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Dropdown } from 'react-toolbox';
import {intlShape, injectIntl, defineMessages} from 'react-intl';
import { routeHelpers } from '../../../helpers/routeHelpers.js'

import theme from './theme';

const il8n = defineMessages({
    FILTER_BY_TYPE: {
        id: 'TRANSACTIONS.FILTER_BY_TYPE'
    },
    FILTER_BY_BOTH: {
        id: 'TRANSACTIONS.FILTER_BY_BOTH'
    },
    FILTER_BY_INCOMES: {
        id: 'TRANSACTIONS.FILTER_BY_INCOMES'
    },
    FILTER_BY_EXPENSES: {
        id: 'TRANSACTIONS.FILTER_BY_EXPENSES'
    }
});

class TransactionsType extends Component {

    constructor(props) {
        super(props);
    }
    types(){
        const { formatMessage } = this.props.intl;
        return [{
                name: formatMessage(il8n.FILTER_BY_BOTH),
                value: 'both'
            }, {
                name: formatMessage(il8n.FILTER_BY_INCOMES),
                value: 'incomes'
            }, {
                name: formatMessage(il8n.FILTER_BY_EXPENSES),
                value: 'expenses'
            }
        ];
    }
    selectType (type) {
        let { parentProps } = this.props.parentProps;
        let { location, history } = parentProps;
        let pathname = routeHelpers.resetPagination(location.pathname);
        let query = location.query;
        //whenever the transaction type change skip 0
        updateFilter('reports', 'skip', 0);
        // transaction filter
        if( query.type !== type ){
            query.type = type;
            history.push({
                pathname: pathname,
                query: query
            });
        }
    }
    typeItem (type) {
        return (
            <div>
                <strong>{type.name}</strong>
            </div>
        );
    }
    render() {
        const { formatMessage } = this.props.intl;
        return (
            <Dropdown
                className={theme.dropDowns}
                auto={false}
                source={this.types()}
                onChange={this.selectType.bind(this)}
                label={formatMessage(il8n.FILTER_BY_TYPE)}
                value={this.props.local.type}
                template={this.typeItem}
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
}, TransactionsType));