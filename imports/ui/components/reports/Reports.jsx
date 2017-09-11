import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Card, CardTitle, Button, DatePicker, FontIcon, Autocomplete, Dropdown, Table, Fonticon, Snackbar, ProgressBar } from 'react-toolbox';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';
import moment from 'moment';

import FilterBar from '/imports/ui/components/filters/FilterBar.jsx';
import { Counter } from 'meteor/natestrauser:publish-performant-counts';
import { dateHelpers } from '../../../helpers/dateHelpers.js'

import theme from './theme';

const il8n = defineMessages({
    AVAILABLE_BALANCE: {
        id: 'DASHBOARD.AVAILABLE_BALANCE'
    },
    TOTAL_INCOMES: {
        id: 'DASHBOARD.TOTAL_INCOMES'
    },
    TOTAL_INCOMES_BUTTON: {
        id: 'DASHBOARD.TOTAL_INCOMES_BUTTON'
    },
    TOTAL_EXPENSES: {
        id: 'DASHBOARD.TOTAL_EXPENSES'
    },
    TOTAL_EXPENSES_BUTTON: {
        id: 'DASHBOARD.TOTAL_EXPENSES_BUTTON'
    },
    DATE_FROM: {
        id: 'DASHBOARD.DATE_FROM'
    },
    DATE_TO: {
        id: 'DASHBOARD.DATE_TO'
    },
    FILTER_BY: {
        id: 'DASHBOARD.FILTER'
    },
    FILTER_BY_ACCOUNT: {
        id: 'DASHBOARD.FILTER_BY_ACCOUNT'
    },
    FILTER_BY_TODAY: {
        id: 'DASHBOARD.FILTER_BY_TODAY'
    },
    FILTER_BY_THIS_WEEK: {
        id: 'DASHBOARD.FILTER_BY_THIS_WEEK'
    },
    FILTER_BY_THIS_MONTH: {
        id: 'DASHBOARD.FILTER_BY_THIS_MONTH'
    },
    FILTER_BY_LAST_MONTH: {
        id: 'DASHBOARD.FILTER_BY_LAST_MONTH'
    },
    FILTER_BY_THIS_YEAR: {
        id: 'DASHBOARD.FILTER_BY_THIS_YEAR'
    },
    FILTER_BY_DATE_RANGE: {
        id: 'DASHBOARD.FILTER_BY_DATE_RANGE'
    }
});

//define Const
const collection = 'localReports';
class ReportsPage extends Component {

    constructor(props) {
        super(props);

        let datetime = new Date();

        this.state = {
            active: false,
            loading: false,
            totalIncomes: null,
            totalExpenses: null,
            availableBalance: null,
            accounts: [],
            filterBy: 'range',
            report: 'both',
            categories: [],
            projects: [],
            dateFrom: new Date(moment(datetime).startOf('month').format()),
            dateTo: datetime
        };
    }

    componentWillUpdate(nextProps) {

        const {location, params, local} = nextProps;
        let query = location.query, accounts, projects, categories, dateFrom, dateTo;
        accounts = query.accounts ? query.accounts.split(",") : [];
        projects = query.projects ? query.projects.split(",") : [];
        categories = query.categories ? query.categories.split(",") : [];

        dateFrom = query.dateFrom || moment().startOf('month').format();
        dateTo = query.dateTo || moment().startOf('today').format();


        //first update skip if given
        params.number && updateFilter(collection, 'skip', Math.ceil(params.number * local.limit));

        //filters
        updateFilter(collection, 'type', query.type || 'both');
        updateFilter(collection, 'accounts', accounts);
        updateFilter(collection, 'projects', projects);
        updateFilter(collection, 'categories', categories);

        //date filters
        updateFilter(collection, 'filter', query.filter || 'range');
        updateFilter(collection, 'dateFrom', moment(dateFrom).format());
        updateFilter(collection, 'dateTo', moment(dateTo).format());

    }

    componentDidMount(){
        const { location } = this.props;
        let query = location.query, accounts;
        accounts = query.accounts ? query.accounts.split(",") : [];
        this.setState({
            accounts : accounts
        });
    }

    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }

    progressBarToggle (){
        return this.props.loading || this.state.loading ? 'progress-bar' : 'progress-bar hide';
    }

    generatePdf(){
        if(this.state.loading){
            return;
        }
        this.setState({
            loading: true
        });
        const {location} = this.props;
        let query = location.query, accounts, projects, categories, dateFrom, dateTo;
        accounts = query.accounts ? query.accounts.split(",") : [];
        projects = query.projects ? query.projects.split(",") : [];
        categories = query.categories ? query.categories.split(",") : [];

        dateFrom = query.dateFrom || moment().startOf('month').format();
        dateTo = query.dateTo || moment().startOf('today').format();

        this.setState({
            dateFrom : dateFrom,
            dateTo : dateTo
        });


        let params = {
            accounts : accounts,
            filterBy : query.filter || 'range',
            date : dateHelpers.filterByDate(query.filter || 'range', {}, this),
            report : query.type || 'both',
            categories : categories,
            projects : projects

        };

        Meteor.call('statistics.generateReport', { params }, (err, res) => {
            this.setState({
                loading: false
            });
            if (err) {
                this.setState({
                    disableButton: false,
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
                console.error(err);
            } else if (res) {
                let parseData = JSON.parse(res);
                window.open(parseData.Location);
            }
        })
    }

    render() {
        return (
            <div className={theme.reports}>
                <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />

                <Snackbar
                    action='Dismiss'
                    active={this.state.active}
                    icon={this.state.barIcon}
                    label={this.state.barMessage}
                    timeout={2000}
                    onClick={this.handleBarClick.bind(this)}
                    onTimeout={this.handleBarTimeout.bind(this)}
                    type={this.state.barType}
                />
                <FilterBar parentProps={ this.props } collection="localReports" />
                {/*TODO add formatMessage message here*/}
                <div className={theme.generateBtn} onClick={this.generatePdf.bind(this)}>
                    <Button type='submit' icon='description' label="Generate Report" raised primary disabled={this.state.loading}/>
                </div>
            </div>
        );
    }
}

ReportsPage.propTypes = {
    intl: intlShape.isRequired
};

ReportsPage = createContainer(() => {
    const local = LocalCollection.findOne({
        name: 'localTransactions'
    });
    const pageCount = Counter.get('transactionsCount');

    return {
        local: local,
        pageCount: pageCount,
    };
}, ReportsPage);

export default injectIntl(ReportsPage);