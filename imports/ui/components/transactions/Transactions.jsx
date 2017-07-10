import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Button, Table, FontIcon, Autocomplete, Dropdown, DatePicker, Dialog, Input, ProgressBar, Snackbar, Card } from 'react-toolbox';
import { Link } from 'react-router'
import Arrow from '/imports/ui/components/arrow/Arrow.jsx';

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'

import { Expenses } from '../../../api/expences/expenses.js';
import { Incomes } from '../../../api/incomes/incomes.js';
import { Accounts } from '../../../api/accounts/accounts.js';
import { Categories } from '../../../api/categories/categories.js';
import { Projects } from '../../../api/projects/projects.js';
import { dateHelpers } from '../../../helpers/dateHelpers.js'

import ExpensesForm from './ExpensesForm.jsx';
import IncomesForm from './IncomesForm.jsx';

import { userCurrencyHelpers } from '../../../helpers/currencyHelpers.js'
import { accountHelpers } from '/imports/helpers/accountHelpers.js'

import theme from './theme';
import tableTheme from './tableTheme';
import dialogTheme from './dialogTheme';
import buttonTheme from './buttonTheme';
import Loader from '/imports/ui/components/loader/Loader.jsx';
import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';

const RECORDS_PER_PAGE = 8;

let pageNumber = 1,
    query = new ReactiveVar({
        limit : RECORDS_PER_PAGE * pageNumber,
        accounts: []
    });

const il8n = defineMessages({
    NO_TRANSACTIONS_ADDED: {
        id: 'TRANSACTIONS.NO_INCOMES_EXPENSES_ADDED'
    },
    ADD_TRANSACTIONS: {
        id: 'TRANSACTIONS.ADD_TRANSACTIONS'
    },
    TITLE: {
        id: 'TRANSACTIONS.TITLE'
    },
    INFORM_MESSAGE: {
        id: 'TRANSACTIONS.INFORM_MESSAGE'
    },
    CONFIRMATION_MESSAGE: {
        id: 'TRANSACTIONS.CONFIRMATION_MESSAGE'
    },
    BACK_BUTTON: {
        id: 'TRANSACTIONS.BACK_BUTTON'
    },
    REMOVE_BUTTON: {
        id: 'TRANSACTIONS.REMOVE_BUTTON'
    },
    TRANSACTION_TYPE: {
        id: 'TRANSACTIONS.TRANSACTION_TYPE'
    },
    TRANSACTION_AMOUNT: {
        id: 'TRANSACTIONS.TRANSACTION_AMOUNT'
    },
    DEPOSITED_BANK: {
        id: 'TRANSACTIONS.DEPOSITED_BANK'
    },
    ACCOUNT_NUMBER: {
        id: 'TRANSACTIONS.ACCOUNT_NUMBER'
    },
    ACCOUNT: {
        id: 'TRANSACTIONS.ACCOUNT'
    },
    SENDER_NAME: {
        id: 'TRANSACTIONS.SENDER_NAME'
    },
    SENDER_BANK: {
        id: 'TRANSACTIONS.SENDER_BANK'
    },
    PROJECT: {
        id: 'TRANSACTIONS.PROJECT'
    },
    EDIT_INFO_BUTTON: {
        id: 'TRANSACTIONS.EDIT_INFO_BUTTON'
    },
    DELETE_TRANSACTION_BUTTON: {
        id: 'TRANSACTIONS.DELETE_TRANSACTION_BUTTON'
    },
    DATE_FROM: {
        id: 'TRANSACTIONS.DATE_FROM'
    },
    DATE_TO: {
        id: 'TRANSACTIONS.DATE_TO'
    },
    FILTER_BY_CATEGORY: {
        id: 'TRANSACTIONS.FILTER_BY_CATEGORY'
    },
    FILTER_BY_PROJECT: {
        id: 'TRANSACTIONS.FILTER_BY_PROJECT'
    },
    FILTER_BY_ACCOUNT: {
        id: 'TRANSACTIONS.FILTER_BY_ACCOUNT'
    },
    FILTER_BY_TYPE: {
        id: 'TRANSACTIONS.FILTER_BY_TYPE'
    },
    FILTER_BY: {
        id: 'TRANSACTIONS.FILTER_BY'
    },
    INCOME_BUTTON: {
        id: 'TRANSACTIONS.INCOME_BUTTON'
    },
    EXPENSE_BUTTON: {
        id: 'TRANSACTIONS.EXPENSE_BUTTON'
    },
    TRANSACTION_DATE: {
        id: 'TRANSACTIONS.TRANSACTION_DATE'
    },
    TRANSACTION_CATEGORY: {
        id: 'TRANSACTIONS.TRANSACTION_CATEGORY'
    },
    AMOUNT_OF_TRANSACTION: {
        id: 'TRANSACTIONS.AMOUNT_OF_TRANSACTION'
    },
    INCOME: {
        id: 'TRANSACTIONS.INCOME'
    },
    EXPENSE: {
        id: 'TRANSACTIONS.EXPENSE'
    },
    DATE: {
        id: 'TRANSACTIONS.DATE'
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



class TransactionPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterBy: '',
            filterByProjects:'',
            filterByCategory:'',
            type: this.props.routes[2] ? this.props.routes[2].path : '',
            openDialog: false,
            barActive : false
        };

        if(this.props.routes[3]) {
            this.state.model = this.props.routes[2].path == 'expenses' ? 'Expense' : 'Income';
            this.state.showForm = true;
            this.state.openDialog = true;
        }


        this.months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        let copyQuery = query.get();
        copyQuery['dateFilter'] = '';
        copyQuery['type'] = this.props.routes[2] ? this.props.routes[2].path : '';
        query.set(copyQuery);
    }

    /*************** Filter by accounts ***************/
    accounts(){
        let accounts = {};
        this.props.accounts.forEach((account) => {
            accounts[account._id] = accountHelpers.alterName(account.bank);
        });
        return accounts;
    }


    filterByAccounts(value, e) {
        this.setState({multiple: value});
        let copyQuery = query.get();
        copyQuery['accounts'] = value;
        query.set(copyQuery);
    }

    /*************** Filter by type ***************/
    type(){
        const { formatMessage } = this.props.intl;
        return [
            {
                name: formatMessage(il8n.FILTER_BY_BOTH),
                value: ''
            },
            {
                name: formatMessage(il8n.FILTER_BY_INCOMES),
                value: 'incomes'
            },
            {
                name: formatMessage(il8n.FILTER_BY_EXPENSES),
                value: 'expenses'
            }
        ];
    }


    /*************** Filter by dates ***************/
    filters(){
        const { formatMessage } = this.props.intl;
        return [
            {
                name: formatMessage(il8n.FILTER_BY_ALL),
                value: ''
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


    filterItem (account) {
        const containerStyle = {
            display: 'flex',
            flexDirection: 'row'
        };

        const contentStyle = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 2
        };

        return (
            <div style={containerStyle}>
                <div style={contentStyle}>
                    <strong>{account.name}</strong>
                </div>
            </div>
        );
    }

    /*************** add/edit incomes popup ***************/
    openedPopup (showForm, e) {
        this.setState({showForm, model: e.target ? e.target.name : e.spentAt ? 'Expense' : 'Income', openDialog: true, deleteConfirmMessage: false});
    }

    closePopup () {
        this.setState({openDialog:false, updateForm : false});
    }

    popupTemplate(){
        return(
            <Dialog theme={dialogTheme}
                className='dialog-box tiny-scroll'
                active={this.state.openDialog}
                onEscKeyDown={this.closePopup.bind(this)}
                onOverlayClick={this.closePopup.bind(this)}
                >
                <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />
                {this.templateRender()}
            </Dialog>
        )
    }

    progressBarToggle (){
        return  this.state.loading ? 'progress-bar' : 'progress-bar hide';
    }

    templateRender(){
        return this.state.showForm ? this.renderAddForm() : this.renderSelectedProject();
    }

    /*************** Select single project in table row click ***************/
    renderSelectedProject(){
        let selectedProject = this.state.selectedProject ;
        if(!selectedProject){
            return false;
        }
        return(
            <div>
                <div className={theme.firstRow}>
                    <div> <span>{selectedProject.receivedAt ? "Income" : "Expense"} ID : </span><span>{selectedProject._id}</span></div>
                    {(selectedProject.receivedAt || selectedProject.spentAt) && <div> <span> <FormattedMessage {...il8n.DATE} /> </span><span> {moment(selectedProject.receivedAt || selectedProject.spentAt).format('MMM Do YY')}</span></div>}
                </div>

                <h4>{selectedProject.receivedAt ?
                    (selectedProject.type == "project" ?
                        (selectedProject.project && selectedProject.project.name || selectedProject.project) : selectedProject.type) :
                    (selectedProject.category.name || selectedProject.category)}</h4>

                {this.selectedProjectDetails()}
            </div>
        )
    }

    selectedProjectDetails(){
        return this.state.deleteConfirmMessage ? this.renderConfirmationMessage() : this.renderProjectDetails();
    }

    renderConfirmationMessage(){
        const { formatMessage } = this.props.intl;
        let selectedProject = this.state.selectedProject ;
        if(!selectedProject){
            return false;
        }
        return (
            <div>
                <div className={theme.confirmText}>
                    <p> <FormattedMessage {...il8n.INFORM_MESSAGE} /> </p>
                    <p> <FormattedMessage {...il8n.CONFIRMATION_MESSAGE} /> </p>
                </div>

                <div className={theme.buttonBox}>
                    <Button label={formatMessage(il8n.BACK_BUTTON)} raised primary onClick={this.deleteTransactionToggle.bind(this)} />
                    <Button label={formatMessage(il8n.REMOVE_BUTTON)} raised onClick={this.deleteTransaction.bind(this)} theme={buttonTheme} />
                </div>
            </div>
        )
    }

    renderProjectDetails(){
        const { formatMessage } = this.props.intl;
        let selectedProject = this.state.selectedProject ;
        if(!selectedProject){
            return false;
        }
        return (
            <div className={theme.contentParent}>
                <div className={theme.contentOne}>
                    <div> <p> <FormattedMessage {...il8n.TRANSACTION_TYPE} /> </p> <p> {selectedProject.receivedAt ? <FormattedMessage {...il8n.INCOME} /> : <FormattedMessage {...il8n.EXPENSE} />}</p></div>
                    <div> <p> <FormattedMessage {...il8n.TRANSACTION_AMOUNT} /> </p> <p> <span><i className={userCurrencyHelpers.loggedUserCurrency()}></i> <FormattedNumber value={selectedProject.amount}/>  </span></p></div>
                    <div> <p> <FormattedMessage {...il8n.DEPOSITED_BANK} /> </p> <p>standard chartered</p></div>
                    <div> <p> <FormattedMessage {...il8n.ACCOUNT_NUMBER} /> </p> <p>00971322001</p></div>
                </div>

                <div className={theme.contentTwo}>
                    <div> <p> <FormattedMessage {...il8n.ACCOUNT} /> </p> <p><span>10,000</span> PKR</p></div>
                    <div> <p> <FormattedMessage {...il8n.SENDER_NAME} /> </p> <p> saeed anwar</p></div>
                    <div> <p> <FormattedMessage {...il8n.SENDER_BANK} /> </p> <p> habib bank</p></div>
                    <div> <p> <FormattedMessage {...il8n.ACCOUNT_NUMBER} /> </p> <p> 009123455670</p></div>
                </div>

                <div className={theme.contentThree}>
                    <div> <p> <FormattedMessage {...il8n.PROJECT} /> </p> <p> <span>logo design</span></p></div>
                    <div>
                        <Button label={formatMessage(il8n.EDIT_INFO_BUTTON)} raised accent onClick={this.editPopup.bind(this)} />
                        <Button label={formatMessage(il8n.DELETE_TRANSACTION_BUTTON)} raised accent onClick={this.deleteTransactionToggle.bind(this)} />
                    </div>
                </div>
            </div>
        )
    }

    /*************** edit project popup ***************/
    editPopup(){
        let transaction = this.state.selectedProject;
        this.setState({showForm : true, updateForm : true, transaction});
    }

    deleteTransactionToggle(){
        this.setState({deleteConfirmMessage : !this.state.deleteConfirmMessage});
    }

    /*************** form template ***************/
    renderAddForm(){
        let {updateForm, model, transaction} = this.state;

        return(
            <div>
                <h4>{(updateForm ? 'Update ' : 'Add New ') + model}</h4>
                {model == 'Income' || transaction && transaction.receivedAt ?
                    <IncomesForm params={transaction ? {id: transaction._id}: ''} isNewRoute={!updateForm} closePopup={this.closePopup.bind(this)}/> :
                    <ExpensesForm params={transaction ? {id: transaction._id} : ''} isNewRoute={!updateForm} closePopup={this.closePopup.bind(this)}/>}
            </div>
        )
    }

    deleteTransaction(){
        let selectedProject = this.state.selectedProject;
        if(!selectedProject){
            return false;
        }
        this.setState({loading : true});
        let param = {};
        param[selectedProject.receivedAt ? "income" : "expense"] = {_id : selectedProject._id};
        Meteor.call(selectedProject.receivedAt ? "incomes.remove" : "expenses.remove", param
            , (err, response) => {
                if(err){
                    this.setState({
                        barActive: true,
                        barMessage: err.reason,
                        barIcon: 'error_outline',
                        barType: 'cancel',
                        loading : false
                    });
                }else{
                    this.setState({
                        barActive: true,
                        barMessage:  (selectedProject.receivedAt ? 'Income' : 'Expense') + ' Removed Successfully!',
                        barIcon: 'done',
                        barType: 'accept',
                        loading : false
                    });
                    this.closePopup();
                    this.setState({selectedProject : false });

                }
            });
    }

    /*************** Select single item in table row click ***************/
    selectItem(index){
        let selectedProject =  this.props.transactions[index] ;
        this.setState({selectedProject});
        this.openedPopup(false, selectedProject);
    }


    /*************** on dropdown options change ***************/
    onChange (val, e) {
        this.setState({[e.target.name]: val});
        let copyQuery = query.get();
        if(['filterBy', 'dateFrom', 'dateTo'].includes(e.target.name)){
            copyQuery['dateFilter'] = val ? dateHelpers.filterByDate(e.target.name == "filterBy" ? val : this.state.filterBy, {[e.target.name]: val}, this) : '';
            query.set(copyQuery);
        }
        else if(['type', 'filterByCategory', 'filterByProjects'].includes(e.target.name)) {
            if (e.target.name == 'type'){
                this.setState({filterByProjects: ''});
                this.setState({filterByCategory: ''});
            }
            copyQuery['filterByProjects'] = '';
            copyQuery['filterByCategory'] = '';
            copyQuery[e.target.name] = val;
            query.set(copyQuery);
        }
    }

    /*************** Infinite scroll ***************/
    handleScroll(event) {
        let infiniteState = event.nativeEvent;
        if((infiniteState.srcElement.scrollTop + infiniteState.srcElement.offsetHeight) > (infiniteState.srcElement.scrollHeight -1)){
            let copyQuery = query.get();
            pageNumber = pageNumber + 1;
            copyQuery.limit  = RECORDS_PER_PAGE * pageNumber;
            query.set(copyQuery);
        }
    }

    /*************** table DateRange ***************/

    renderDateRange(){
        const { formatMessage } = this.props.intl;
        let dropDowns = (
            <div className={theme.dashboardDatePicker}>
                <DatePicker
                    label={formatMessage(il8n.DATE_FROM)}
                    name='dateFrom'
                    onChange={this.onChange.bind(this)}
                    value={this.state.dateFrom}
                    />

                <DatePicker
                    label={formatMessage(il8n.DATE_TO)}
                    name='dateTo'
                    onChange={this.onChange.bind(this)}
                    value={this.state.dateTo}
                    />
            </div>
        );
        return (
            this.state.filterBy == 'range' ?  dropDowns : null
        )
    }

    categoryOrProjectFilter(){
        if(this.state.type == "") return;
        return this.state.type == "incomes" ? this.projectFilter() : this.categoryFilter()
    }

    categories(){
         this.props.categories.map((category) => {
            category.value = category._id;
            return category;
        });
        this.props.categories.unshift({
            icon:'',
            name:'All',
            value:''
        });
        return this.props.categories;

    }

    projects(){
         this.props.projects.map((project) => {
            project.value = project._id;
            project.label = project.name;
            return project;
        });
        this.props.projects.unshift({
            label:'All',
            value:''
        });
        return this.props.projects;
    }

    categoryItem(category){
        const containerStyle = {
            display: 'flex',
            flexDirection: 'row'
        };

        const imageStyle = {
            display: 'flex',
            width: '22px',
            height: '22px',
            flexGrow: 0,
            marginRight: '8px'
        };

        const contentStyle = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 2,
            paddingTop: '4px'
        };

        return (
            <div style={containerStyle}>
                <div className={theme.categoryIcon}>
                    <i className={category.icon}/>
                    <strong>{category.name}</strong>
                </div>
            </div>
        );
    }

    categoryFilter(){
        const { formatMessage } = this.props.intl;
        return (
            <Dropdown
            className={theme.dashboardAutocompleteLast}
            auto={false}
            source={this.categories()}
            name='filterByCategory'
            onChange={this.onChange.bind(this)}
            label={formatMessage(il8n.FILTER_BY_CATEGORY)}
            value={this.state.filterByCategory}
            template={this.categoryItem}
            />
        )
    }

    projectFilter(){
        const { formatMessage } = this.props.intl;
        return (
            <Dropdown
                className={theme.dashboardAutocompleteLastOne}
                auto={false}
                source={this.projects()}
                name='filterByProjects'
                onChange={this.onChange.bind(this)}
                label={formatMessage(il8n.FILTER_BY_PROJECT)}
                value={this.state.filterByProjects}
                />
        )

    }

    barClick () {
        this.setState({ barActive: false });
    }

    /*************** table template ***************/
    renderProjectTable() {
        let transactions = this.props.transactions;
        let data = transactions.map(function(transaction){
            return {
                leftIcon: transaction.receivedAt ? <Arrow primary right width='16px' height='16px' /> : <Arrow danger left width='16px' height='16px' />,
                date: moment(transaction.receivedAt || transaction.spentAt).format("DD-MMM-YY"),
                category: transaction.receivedAt ?
                    (transaction.type == "project" ?
                        (transaction.project && transaction.project.name || transaction.project) : transaction.type) :
                    (transaction.category.name || transaction.category),
                amount: (<span>
        <i className={userCurrencyHelpers.loggedUserCurrency()}></i> <FormattedNumber value={transaction.amount}/>  </span>),
                rightIcon: transaction.receivedAt ? <Arrow primary width='16px' height='16px' /> : <Arrow danger down width='16px' height='16px' />
            }
        });
        let tableModel = {
            leftIcon: {type: String},
            date: {type: Date, title: <FormattedMessage {...il8n.TRANSACTION_DATE} />},
            category: {type: Date, title: <FormattedMessage {...il8n.TRANSACTION_CATEGORY} />},
            amount: {type: Date, title: <FormattedMessage {...il8n.AMOUNT_OF_TRANSACTION} />},
            rightIcon: {type: String}
        };
            const table =
                <Table theme={tableTheme} className={theme.table}
                       model={tableModel}
                       source={data}
                       onRowClick={this.selectItem.bind(this)}
                       selectable={false}
                       heading={true}
                    />;
            const initialMessage =
                <div className={theme.transactionNothing}>
                    <span className={theme.errorShow}> <FormattedMessage {...il8n.NO_TRANSACTIONS_ADDED} /> </span>
                    <div className={theme.addProjectBtn}>
                        <Button type='button' icon='add' raised primary />
                    </div>
                    <span className={theme.errorShow}> <FormattedMessage {...il8n.ADD_TRANSACTIONS} /> </span>
                </div>;
        return (
            <Card theme={tableTheme}>
                {this.props.transactionsExists ||  data.length ? table : initialMessage}
                { this.props.transactionsLoading ? <div className={theme.loaderParent}><Loader primary spinner /></div> : ''}
            </Card>
        )
    }

    /*************** template render ***************/
    render() {
        const { formatMessage } = this.props.intl;
        return (
            <div className="projects" onScroll={this.handleScroll}>
                <div className="container">
                    <div className={theme.dropdownAutocomplete}>
                        <Autocomplete theme={theme}
                            className={theme.dashboardAutocomplete}
                            direction='down'
                            name='multiple'
                            onChange={this.filterByAccounts.bind(this)}
                            label={formatMessage(il8n.FILTER_BY_ACCOUNT)}
                            source={this.accounts()}
                            value={this.state.multiple}
                            />
                    </div>
                    <div className={theme.dropdownBox}>
                        <Dropdown
                            className={theme.dashboardAutocomplete}
                            auto={false}
                            source={this.type()}
                            name='type'
                            onChange={this.onChange.bind(this)}
                            label={formatMessage(il8n.FILTER_BY_TYPE)}
                            value={this.state.type}
                            template={this.filterItem}
                            />
                        <Dropdown
                            className={theme.dashboardAutocomplete}
                            auto={false}
                            source={this.filters()}
                            name='filterBy'
                            onChange={this.onChange.bind(this)}
                            label={formatMessage(il8n.FILTER_BY)}
                            value={this.state.filterBy}
                            template={this.filterItem}
                            />
                        {this.renderDateRange()}
                        {this.categoryOrProjectFilter()}
                    </div>

                    <div className={theme.pageTitle}>
                        <h3><FormattedMessage {...il8n.TITLE} /></h3>
                        <div>
                            <Button
                                className='header-buttons'
                                icon='add'
                                label={formatMessage(il8n.INCOME_BUTTON)}
                                name='Income'
                                onClick={this.openedPopup.bind(this, true)}
                                flat theme={theme} />
                            <Button
                                className='header-buttons'
                                icon='add'
                                label={formatMessage(il8n.EXPENSE_BUTTON)}
                                name='Expense'
                                onClick={this.openedPopup.bind(this, true)}
                                flat theme={theme} />
                            {this.popupTemplate()}
                        </div>
                    </div>
                    <Card theme={tableTheme}>
                        { this.props.transactionsLoading && this.props.transactions.length < RECORDS_PER_PAGE ? <Loader primary /> :this.renderProjectTable()}
                    </Card>
                    <Snackbar
                        action='Dismiss'
                        active={this.state.barActive}
                        icon={this.state.barIcon}
                        label={this.state.barMessage}
                        timeout={2000}
                        onClick={this.barClick.bind(this)}
                        onTimeout={this.barClick.bind(this)}
                        type={this.state.barType}
                        />
                </div>
            </div>

        );
    }
}

TransactionPage.propTypes = {
    transactions: PropTypes.array.isRequired,
    intl: intlShape.isRequired
};

TransactionPage = createContainer(() => {
    const transactionsHandle = Meteor.subscribe('transaction', query.get());
    const transactionsLoading = !transactionsHandle.ready();
    const transactionsExists = !transactionsLoading && !!transactions;

    Meteor.subscribe('accounts');
    const accounts = Accounts.find({}).fetch();

    Meteor.subscribe('categories');
    const categories = Categories.find().fetch();

    Meteor.subscribe('projects.all');
    const projects = Projects.find().fetch();

    const expenses = Expenses.find().fetch(),
    incomes = Incomes.find().fetch();

    const transactions = _.sortBy(incomes.concat(expenses), function(transaction){return transaction.receivedAt || transaction.spentAt }).reverse();

    return {
        transactionsLoading,
        transactionsExists,
        transactions,
        accounts,
        categories,
        projects
    };
}, TransactionPage);

export default injectIntl(TransactionPage);