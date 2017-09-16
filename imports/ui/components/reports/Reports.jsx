import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Card, CardTitle, Button, DatePicker, FontIcon, Autocomplete, Dropdown, Table, Fonticon, Snackbar, ProgressBar } from 'react-toolbox';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';
import moment from 'moment';

import FilterBar from '/imports/ui/components/filters/FilterBar.jsx';
import { Reports } from '/imports/api/reports/reports.js'
import { Counter } from 'meteor/natestrauser:publish-performant-counts';
import { dateHelpers } from '../../../helpers/dateHelpers.js'
import { routeHelpers } from '../../../helpers/routeHelpers.js'

import theme from './theme';

const il8n = defineMessages({
    GENERAL_REPORT: {
        id: 'REPORTS.GENERAL_REPORT'
    },
    PDF: {
        id: 'REPORTS.PDF'
    },
    FINANCIAL_TYPE: {
        id: 'REPORTS.FINANCIAL_TYPE'
    },
    EXPORT_TYPE: {
        id: 'REPORTS.EXPORT_TYPE'
    },
    DOWNLOAD_LINK: {
        id: 'REPORTS.DOWNLOAD_LINK'
    },
    DOWNLOAD_REPORT: {
        id: 'REPORTS.DOWNLOAD_REPORT'
    },
    AVAILABLE_BALANCE: {
        id: 'DASHBOARD.AVAILABLE_BALANCE'
    },
    GENERATE_REPORT: {
        id: 'DASHBOARD.GENERATE_REPORT'
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
    },
    ALL_REPORTS: {
        id: 'REPORTS.ALL_REPORTS'
    },
    EXPIRY_DATE: {
        id: 'REPORTS.EXPIRY_DATE'
    },
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
            dateTo: datetime,
            financialType: 'general',
            exportType: 'pdf'
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

    exportTypes(){
        const { formatMessage } = this.props.intl;
        return [
            //since we currently only have PDf
            {
                name: formatMessage(il8n.PDF),
                value: 'pdf'
            },
            // {
            //     name: 'CSV',
            //     value: 'csv'
            // }
        ];
    }
    financialTypes(){
        const { formatMessage } = this.props.intl;
        return [
            //since we currently only have General Report
            {
                name: formatMessage(il8n.GENERAL_REPORT),
                value: 'general'
            },
            // {
            //     name: 'General Ladger',
            //     value: 'ladger'
            // },
            // {
            //     name: 'Trial Balance',
            //     value: 'trial'
            // }
        ];
    }

    selectItem(index){
        let selectedReport =  this.props.reports[index];
        // routeHelpers.changeRoute(`/app/reports/${selectedReport._id}`);
    }

    getTableModel(){
        return {
            dateFrom: {type: String, title: <FormattedMessage {...il8n.DATE_FROM}/>},
            dateTo: {type: Date, title: <FormattedMessage {...il8n.DATE_TO}/>},
            reportUrl: {type: String, title: <FormattedMessage {...il8n.DOWNLOAD_LINK}/>},
            expireAt: {type: Date, title: <FormattedMessage {...il8n.EXPIRY_DATE}/>},
        }
    }

    selectFinancialFilter (financialType) {
        let { location } = this.props;
        let query = location.query;
        // transaction filter
        if( query.financialType !== financialType ){
            query.financialType = financialType;
            routeHelpers.changeRoute(location.pathname, 0, query)
        }

    }
    selectExportFilter (exportType) {
        let { location } = this.props;
        let query = location.query;
        // transaction filter
        if( query.exportType !== exportType ){
            query.exportType = exportType;
            routeHelpers.changeRoute(location.pathname, 0, query)
        }

    }
    filterItem (filter) {
        return (
            <div>
                <strong>{filter.name}</strong>
            </div>
        );
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
        const { formatMessage } = this.props.intl;
        const { reports } = this.props;

        let data = reports.map(function(report){
            return {
                dateFrom: moment(report.dateFrom).format("DD-MMM-YY"),
                dateTo: moment(report.dateTo).format("DD-MMM-YY"),
                reportUrl: (<a href={report.reportUrl}>{formatMessage(il8n.DOWNLOAD_REPORT)}</a>),
                expireAt: moment(report.expireAt).format("DD-MMM-YY"),
            }
        });
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
                <div className={theme.generateBtn}>
                    <Dropdown
                        className={theme.filterDropDowns}
                        auto={false}
                        source={this.financialTypes()}
                        name='filterBy'
                        onChange={this.selectFinancialFilter.bind(this)}
                        label={formatMessage(il8n.FINANCIAL_TYPE)}
                        value={this.state.financialType}
                        template={this.filterItem}
                    />
                    <Dropdown
                        className={theme.filterDropDowns}
                        auto={false}
                        source={this.exportTypes()}
                        name='filterBy'
                        onChange={this.selectExportFilter.bind(this)}
                        label={formatMessage(il8n.EXPORT_TYPE)}
                        value={this.state.exportType}
                        template={this.filterItem}
                    />
                    <Button onClick={this.generatePdf.bind(this)} type='submit' icon='description' label={formatMessage(il8n.GENERATE_REPORT)} raised primary disabled={this.state.loading}/>
                </div>
                <div className={theme.reportsTable}>
                    <h3 className={theme.reportsTableHeading}>{formatMessage(il8n.ALL_REPORTS)}</h3>
                    <Card>
                        <Table theme={theme} model={this.getTableModel()}
                               source={data}
                               onRowClick={this.selectItem.bind(this)}
                               selectable={false}
                               heading={true}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

ReportsPage.propTypes = {
    intl: intlShape.isRequired
};

ReportsPage = createContainer(() => {
    const reportsHandle = Meteor.subscribe('reports');
    const reports = Reports.find().fetch();
    const local = LocalCollection.findOne({
        name: 'localTransactions'
    });
    const pageCount = Counter.get('transactionsCount');
    const reportsExists = Counter.get('reportsTotal');

    return {
        reports,
        local: local,
        pageCount: pageCount,
    };
}, ReportsPage);

export default injectIntl(ReportsPage);