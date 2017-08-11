import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { DatePicker } from 'react-toolbox';
import {intlShape, injectIntl, defineMessages} from 'react-intl';
import { routeHelpers } from '../../../helpers/routeHelpers.js'
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
        let { parentProps } = props.parentProps;
        let { location } = parentProps;
        let query = location.query;
        this.state = {
            dateFrom: query.dateFrom || moment().startOf('month').format(),
            dateTo: query.dateTo || moment().startOf('today').format(),
        }
    }
    componentWillReceiveProps(props){
        let { parentProps } = props.parentProps;
        let { location } = parentProps;
        let query = location.query;
        this.state = {
            dateFrom: query.dateFrom || moment().startOf('month').format(),
            dateTo: query.dateTo || moment().startOf('today').format(),
        }
    }
    onDateChange (date, e) {
        let dateFilter = e.target.name;
        let { parentProps } = this.props.parentProps;
        let { location } = parentProps;
        let pathname = routeHelpers.resetPagination(location.pathname);
        let query = location.query;

        // transaction dateFilter
        if( new Date(query[dateFilter]).getTime() !== new Date(date).getTime() ){
            this.setState([e.target.name]);
            query[dateFilter] = moment(date).format();
            routeHelpers.changeRoute(pathname, 0, query);
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
                    value={new Date(this.state.dateFrom)}
                />

                <DatePicker
                    label={formatMessage(il8n.DATE_TO)}
                    name='dateTo'
                    onChange={this.onDateChange.bind(this)}
                    value={new Date(this.state.dateTo)}
                    />
            </div>
        );
    }
}

DateRange.propTypes = {
    parentProps: PropTypes.object.isRequired

};

export default injectIntl(createContainer(() => {
    return {
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, DateRange));