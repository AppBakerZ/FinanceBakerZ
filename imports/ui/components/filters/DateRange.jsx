import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { DatePicker } from 'react-toolbox';
import {intlShape, injectIntl, defineMessages} from 'react-intl';
import moment from 'moment';

import theme from './theme';

const il8n = defineMessages({
    DATE_FROM: {
        id: 'TRANSACTIONS.DATE_FROM'
    },
    DATE_TO: {
        id: 'TRANSACTIONS.DATE_TO'
    }
});

class DateRange extends Component {
    constructor(props) {
        super(props);
    }
    onDateChange (date, e) {
        let dateFilter = e.target.name;
        let { parentProps } = this.props.parentProps;
        let {location, history} = parentProps;
        let query = location.query;

        // transaction dateFilter
        if( new Date(query[dateFilter]).getTime() !== new Date(date).getTime() ){
            query[dateFilter] = moment(date).format();
            history.push({
                pathname: location.pathname,
                query: query
            });
        }
    }
    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.datePickers}>
                <DatePicker
                    label={formatMessage(il8n.DATE_FROM)}
                    name='dateFrom'
                    onChange={this.onDateChange.bind(this)}
                    value={new Date(this.props.local.dateFrom)}
                />

                <DatePicker
                    label={formatMessage(il8n.DATE_TO)}
                    name='dateTo'
                    onChange={this.onDateChange.bind(this)}
                    value={new Date(this.props.local.dateTo)}
                    />
            </div>
        );
    }
}

export default injectIntl(createContainer(() => {
    return {
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, DateRange));