import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Button, Table, FontIcon, Autocomplete, Dropdown, DatePicker, Dialog, Input, ProgressBar, Snackbar } from 'react-toolbox';
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
import IncomesSideBar from '../incomes/IncomesSideBar.jsx'
import ExpensesSideBar from '../expenses/ExpensesSideBar.jsx'
import { currencyFormatHelpers, userCurrencyHelpers } from '../../../helpers/currencyHelpers.js'

import theme from './theme';
import tableTheme from './tableTheme';
import dialogTheme from './dialogTheme';
import buttonTheme from './buttonTheme';

const RECORDS_PER_PAGE = 8;

let pageNumber = 1,
    query = new ReactiveVar({
        limit : RECORDS_PER_PAGE * pageNumber,
        accounts: []
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
            accounts[account._id] = account.bank;
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
        return [
            {
                name: 'Both',
                value: ''
            },
            {
                name: 'Incomes',
                value: 'incomes'
            },
            {
                name: 'Expenses',
                value: 'expenses'
            }
        ];
    }


    /*************** Filter by dates ***************/
    filters(){
        return [
            {
                name: 'All',
                value: ''
            },
            {
                name: 'Today',
                value: 'day'
            },
            {
                name: 'This Week',
                value: 'week'
            },
            {
                name: 'This Month',
                value: 'month'
            },
            {
                name: 'Last Month',
                value: 'months'
            },
            {
                name: 'This Year',
                value: 'year'
            },
            {
                name: 'Date Range',
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
        };
        return(
            <div>
                <div className={theme.firstRow}>
                    <div> <span>{selectedProject.receivedAt ? "Income" : "Expense"} ID : </span><span>{selectedProject._id}</span></div>
                    {(selectedProject.receivedAt || selectedProject.spentAt) && <div> <span>Date :</span><span> {moment(selectedProject.receivedAt || selectedProject.spentAt).format('MMM Do YY')}</span></div>}
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
        let selectedProject = this.state.selectedProject ;
        if(!selectedProject){
            return false;
        };
        return (
            <div>
                <div className={theme.confirmText}>
                    <p>This will remove your all data</p>
                    <p>Are you sure to remove your project?</p>
                </div>

                <div className={theme.buttonBox}>
                    <Button label='GO BACK' raised primary onClick={this.deleteTransactionToggle.bind(this)} />
                    <Button label='YES, REMOVE' raised onClick={this.deleteTransaction.bind(this)} theme={buttonTheme} />
                </div>
            </div>
        )
    }

    renderProjectDetails(){
        let selectedProject = this.state.selectedProject ;
        if(!selectedProject){
            return false;
        };
        return (
            <div className={theme.contentParent}>
                <div className={theme.contentOne}>
                    <div> <p>Transaction Type :</p> <p> {selectedProject.receivedAt ? "Income" : "Expense"}</p></div>
                    <div> <p>Transaction Amount :</p> <p> <span>{userCurrencyHelpers.loggedUserCurrency() + currencyFormatHelpers.currencyStandardFormat(selectedProject.amount)}</span></p></div>
                    <div> <p>deposited in :</p> <p>standard chartered</p></div>
                    <div> <p>account number :</p> <p>00971322001</p></div>
                </div>

                <div className={theme.contentTwo}>
                    <div> <p>account :</p> <p><span>10,000</span> PKR</p></div>
                    <div> <p>sender name :</p> <p> saeed anwar</p></div>
                    <div> <p>sender bank :</p> <p> habib bank</p></div>
                    <div> <p>account number :</p> <p> 009123455670</p></div>
                </div>

                <div className={theme.contentThree}>
                    <div> <p>project :</p> <p> <span>logo design</span></p></div>
                    <div>
                        <Button label='Edit Information' raised accent onClick={this.editPopup.bind(this)} />
                        <Button label='Delete Transaction' raised accent onClick={this.deleteTransactionToggle.bind(this)} />
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
                    <IncomesSideBar params={transaction ? {id: transaction._id}: ''} isNewRoute={!updateForm} closePopup={this.closePopup.bind(this)}/> :
                    <ExpensesSideBar params={transaction ? {id: transaction._id} : ''} isNewRoute={!updateForm} closePopup={this.closePopup.bind(this)}/>}
            </div>
        )
    }

    deleteTransaction(){
        let selectedProject = this.state.selectedProject;
        if(!selectedProject){
            return false;
        };
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
        let dropDowns = (
            <div className={theme.dashboardDatePicker}>
                <DatePicker
                    label='Date From'
                    name='dateFrom'
                    onChange={this.onChange.bind(this)}
                    value={this.state.dateFrom}
                    />

                <DatePicker
                    label='Date To'
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
        return (
            <Dropdown
            className={theme.dashboardAutocompleteLast}
            auto={false}
            source={this.categories()}
            name='filterByCategory'
            onChange={this.onChange.bind(this)}
            label='Filter By Category'
            value={this.state.filterByCategory}
            template={this.categoryItem}
            />
        )
    }

    projectFilter(){

        return (
            <Dropdown
                className={theme.dashboardAutocompleteLastOne}
                auto={false}
                source={this.projects()}
                name='filterByProjects'
                onChange={this.onChange.bind(this)}
                label='Filter By Projects'
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
                amount: userCurrencyHelpers.loggedUserCurrency() + currencyFormatHelpers.currencyStandardFormat(transaction.amount),
                rightIcon: transaction.receivedAt ? <Arrow primary width='16px' height='16px' /> : <Arrow danger down width='16px' height='16px' />
            }
        });
        let tableModel = {
            leftIcon: {type: String},
            date: {type: Date},
            category:{type: String},
            amount: {type: String},
            rightIcon: {type: String}
        };
        return ( <Table theme={tableTheme} className={theme.table}
                model={tableModel}
                source={data}
                onRowClick={this.selectItem.bind(this)}
                selectable={false}
                heading={false}
                />
        )
    }

    /*************** template render ***************/
    render() {
        return (
            <div className="projects" onScroll={this.handleScroll}>
                <div className="container">
                    <div className={theme.dropdownAutocomplete}>
                        <Autocomplete theme={theme}
                            className={theme.dashboardAutocomplete}
                            direction='down'
                            name='multiple'
                            onChange={this.filterByAccounts.bind(this)}
                            label='Filter By Account'
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
                            label='Filter By Type'
                            value={this.state.type}
                            template={this.filterItem}
                            />
                        <Dropdown
                            className={theme.dashboardAutocomplete}
                            auto={false}
                            source={this.filters()}
                            name='filterBy'
                            onChange={this.onChange.bind(this)}
                            label='Filter By'
                            value={this.state.filterBy}
                            template={this.filterItem}
                            />
                        {this.renderDateRange()}
                        {this.categoryOrProjectFilter()}
                    </div>

                    <div className={theme.pageTitle}>
                        <h3>Transactions</h3>
                        <div>
                            <Button
                                className='header-buttons'
                                icon='add'
                                label='INCOME'
                                name='Income'
                                onClick={this.openedPopup.bind(this, true)}
                                flat theme={theme} />
                            <Button
                                className='header-buttons'
                                icon='add'
                                label='EXPENSE'
                                name='Expense'
                                onClick={this.openedPopup.bind(this, true)}
                                flat theme={theme} />
                            {this.popupTemplate()}
                        </div>
                    </div>
                    {this.renderProjectTable()}

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
    transactions: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('transactions', query.get());
    Meteor.subscribe('accounts');
    Meteor.subscribe('categories');
    Meteor.subscribe('projects.all');
    let expenses = Expenses.find().fetch(),
    incomes = Incomes.find().fetch();
    return {
        transactions: _.sortBy(incomes.concat(expenses), function(transaction){return transaction.receivedAt || transaction.spentAt }).reverse(),
        accounts: Accounts.find({}).fetch(),
        categories: Categories.find().fetch(),
        projects: Projects.find().fetch()
    };
}, TransactionPage);