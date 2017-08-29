import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';
import { Card, CardTitle, Button, DatePicker, FontIcon, Autocomplete, Dropdown, Table, Fonticon } from 'react-toolbox';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';
import moment from 'moment';

import FilterBar from '/imports/ui/components/filters/FilterBar.jsx';
import TransactionsTable from '/imports/ui/components/reports/TransactionsTable.jsx';
import Pagination from '/imports/ui/components/reports/Pagination.jsx';
import { Counter } from 'meteor/natestrauser:publish-performant-counts';
import { Accounts } from '../../../api/accounts/accounts.js';
import { dateHelpers } from '../../../helpers/dateHelpers.js'
import { userCurrencyHelpers } from '/imports/helpers/currencyHelpers.js'
import Arrow from '../arrow/Arrow.jsx';
import Loader from '../loader/Loader.jsx';

import theme from './theme';
import cardTheme from './cardtheme.scss';

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
            loading: false,
            totalIncomes: null,
            totalExpenses: null,
            availableBalance: null,
            multiple: [],
            filterBy: 'range',
            reportType: 'both',
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

        // concat that method to generate reports too
        this.state.filterBy = query.filter || 'range';
        this.state.multiple = accounts;
        this.state.categories = categories;
        this.state.projects = projects;
        console.log(this.state)
    }

    componentDidMount(){
        this.setDefaultAccounts(this.props);
    }

    setDefaultAccounts (props){
        let multiple = [];
        props.accounts.forEach((account) => {
            multiple.push(account._id);
        });
        this.setState({multiple});
        this.updateByAccount(multiple)
    }

    updateByAccount(accounts){
        this.getAvailableBalance(accounts);
        this.getTotalIncomesAndExpenses(accounts);
    }

    getAvailableBalance (accounts){
        Meteor.call('statistics.availableBalance', {accounts}, (err, ab) => {
            this.setState({
                availableBalance: ab
            })
        });
    }

    getTotalIncomesAndExpenses (accounts, filterBy, range){
        let date = dateHelpers.filterByDate(filterBy || this.state.filterBy, range || {}, this);
        this.setState({
            totalIncomes: null,
            totalExpenses: null
        });
        Meteor.call('statistics.totalIncomesAndExpenses', {accounts, date}, (err, totals) => {
            if(totals){
                this.setState({
                    totalIncomes: totals.incomes,
                    totalExpenses: totals.expenses
                })
            }else{
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
        });
    }

    handleMultipleChange (value) {
        this.setState({multiple: value});
        this.updateByAccount(value)
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
        this.getTotalIncomesAndExpenses(this.state.multiple, e.target.name === 'filterBy' ? val : null, {[e.target.name]: val});
    }

    renderTotalIncomes(){
        const { formatMessage } = this.props.intl;
        return (
            <div className={cardTheme.incomeBox}>
                <div className={cardTheme.divTitle}>
                    <FormattedMessage {...il8n.TOTAL_INCOMES} />
                </div>
                <div className={cardTheme.title}>
                    <h2>
                        <i className={userCurrencyHelpers.loggedUserCurrency()}></i>
                        <FormattedNumber value={this.state.totalIncomes}/>
                    </h2>
                    <Arrow primary width='30px' height='35px' />
                </div>
                {(!this.state.totalIncomes ||
                    <div className={cardTheme.reportBtn} onClick={this.generatePdf.bind(this, 'incomes')}>
                        <Button icon='description' label={formatMessage(il8n.TOTAL_INCOMES_BUTTON)} flat disabled={this.state.loading}/>
                    </div>
                )}
            </div>
        )
    }
    renderTotalExpenses(){
        const { formatMessage } = this.props.intl;
        return (
            <div className={cardTheme.expensesBox}>
                <div className={cardTheme.divTitle}>
                    <FormattedMessage {...il8n.TOTAL_EXPENSES} />
                </div>
                <div className={cardTheme.title}>
                    <h2>
                        <i className={userCurrencyHelpers.loggedUserCurrency()}></i>
                        <FormattedNumber value={this.state.totalExpenses}/>
                    </h2>
                    <Arrow down danger width='30px' height='35px' />
                </div>
                {(!this.state.totalExpenses ||
                    <div className={cardTheme.reportBtn} onClick={this.generatePdf.bind(this, 'expenses')}>
                        <Button icon='description' label={formatMessage(il8n.TOTAL_EXPENSES_BUTTON)} flat disabled={this.state.loading}/>
                    </div>
                )}
            </div>
        )
    }

    generatePdf(report){
        // if(this.state.loading){
        //     return;
        // }
        // this.setState({
        //     loading: true
        // });

        let params = {
            multiple : this.state.multiple,
            filterBy : this.state.filterBy,
            date : dateHelpers.filterByDate(this.state.filterBy, {}, this),
            report : report,
            reportType : this.state.reportType,
            categories : this.state.categories,
            projects : this.state.projects

        };
        // prevent window popup block
        //   let loader = '<html> <head> <style> div{ text-align: center; font-size: 40px; margin-top: 280px }  </style> </head> <body> <div> Loading...</div> </body>';
        //   let win = window.open('');
        //   win.document.write(loader);
        //   window.oldOpen = window.open;
        //   window.open = function(url) {
        //       win.location = url;
        //       window.open = oldOpen;
        //       win.focus();
        //   };

        console.log(params)

        // Meteor.call('statistics.generateReport', {params } , (err, res) => {
        //     this.setState({
        //         loading: false
        //     });
        //     if (err) {
        //         console.error(err);
        //     } else if (res) {
        //         let parseData = JSON.parse(res);
        //         window.open(parseData.Location);
        //     }
        // })
    }

    render() {
        return (
            <div className={theme.reports}>
                <FilterBar parentProps={ this.props } collection="localReports" />
                <Card theme={cardTheme} className={cardTheme.responsiveCardSecond} style={{ flexDirection: 'inherit', textAlign: 'center'}}>
                    <Card theme={cardTheme} className={cardTheme.responsiveCardSecond} style={{ margin: '2rem'}}>
                        {this.state.totalIncomes !== null ? this.renderTotalIncomes() : <Loader primary />}
                    </Card>
                    <Card theme={cardTheme} className={cardTheme.responsiveCardSecond} style={{ margin: '2rem'}}>
                        {this.state.totalExpenses !== null ? this.renderTotalExpenses() : <Loader danger />}
                    </Card>
                </Card>
                {/*<Card theme={cardTheme} className={cardTheme.responsiveCardSecond}>*/}
                    {/*{this.state.totalExpenses !== null ? this.renderTotalExpenses() : <Loader danger />}*/}
                {/*</Card>*/}
                {/*<TransactionsTable parentProps={this.props} collection="localReports" />*/}
                {/*<Pagination pageCount={this.props.pageCount} parentProps={ this.props }/>*/}
            </div>
        );
    }
}

ReportsPage.propTypes = {
    accounts: PropTypes.array.isRequired,
    intl: intlShape.isRequired
};

ReportsPage = createContainer(() => {
    Meteor.subscribe('accounts');
    const local = LocalCollection.findOne({
        name: 'localTransactions'
    });
    const pageCount = Counter.get('transactionsCount');

    return {
        accounts: Accounts.find({}).fetch(),
        local: local,
        pageCount: pageCount,
    };
}, ReportsPage);

export default injectIntl(ReportsPage);