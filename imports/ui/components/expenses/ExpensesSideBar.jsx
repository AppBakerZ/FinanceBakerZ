import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { Input, Button, ProgressBar, Snackbar, Dropdown, DatePicker, TimePicker, FontIcon, IconButton } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot'

import { Expenses } from '../../../api/expences/expenses.js';
import { Accounts } from '../../../api/accounts/accounts.js';
import { Categories } from '../../../api/categories/categories.js';


import theme from './theme';

class ExpensesSideBar extends Component {

    constructor(props) {
        super(props);

        let datetime = new Date();

        this.state = {
            account: '',
            amount: '',
            description: '',
            spentAt: datetime,
            spentTime: datetime,
            category: '',
            active: false,
            loading: false,
            billUrl: '',
            disableButton: false
        };
    }

    setCurrentRoute(value){
        this.setState({
            isNewRoute: value
        })
    }

    resetExpense(){
        let datetime = new Date();
        this.setState({
            account: '',
            amount: '',
            description: '',
            spentAt: datetime,
            spentTime: datetime,
            category: ''
        })
    }


    onSubmit(event){
        event.preventDefault();
        this.state.isNewRoute ? this.createExpense() : this.updateExpense();
        this.setState({loading: true})
    }

    createExpense(){
        let {account, amount, description, spentAt, spentTime, category, billUrl} = this.state;
        spentAt = new Date(spentAt);
        spentTime = new Date(spentTime);
        spentAt.setHours(spentTime.getHours(), spentTime.getMinutes(), 0, 0);
        category = category && {_id: category};

        Meteor.call('expenses.insert', {
            expense: {
                account,
                amount: Number(amount),
                spentAt,
                description,
                billUrl,
                category
            }
        }, (err, response) => {
            if(response){
                this.setState({
                    active: true,
                    barMessage: 'Expense created successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
                this.resetExpense();
                this.props.closePopup();
            }else{
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
            this.setState({loading: false})
        });
    }

    updateExpense(){
        let {_id, account, amount ,spentAt ,spentTime ,description, billUrl, category} = this.state;
        spentAt = new Date(spentAt);
        spentTime = new Date(spentTime);
        spentAt.setHours(spentTime.getHours(), spentTime.getMinutes(), 0, 0);
        category = category && {_id: category};
        Meteor.call('expenses.update', {
            expense: {
                _id,
                account,
                amount: Number(amount),
                spentAt,
                description,
                billUrl,
                category
            }
        }, (err, response) => {
            if(err){
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }else{
                this.setState({
                    active: true,
                    barMessage: 'Expense updated successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
                this.props.closePopup();
            }
            this.setState({loading: false})
        });
    }

    removeExpense(){
        const {_id} = this.state;
        Meteor.call('expenses.remove', {
            expense: {
                _id
            }
        }, (err, response) => {
            if(err){
                this.setState({
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }else{
                this.props.history.replace('/app/expenses/new');
                this.setState({
                    active: true,
                    barMessage: 'Expense deleted successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
        });
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
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

    componentWillReceiveProps (p){
        p.expense.billUrl = p.expense.billUrl || '';
        p.expense.receivedTime = p.expense.receivedAt;
        p.expense.category = p.expense.category && p.expense.category._id;
        this.setState(p.expense);
        this.setCurrentRoute(p.isNewRoute);
        if(p.isNewRoute){
            this.resetExpense()
        }
    }

    renderButton (){
        let button;
        if(this.state.isNewRoute){
            button = <div className={theme.addExpensesBtn}>
                <Button type='submit' disabled={this.state.disableButton} icon='add' label='Add Expense' raised primary />
            </div>
        }else{
            button = <div className={theme.addExpensesBtn}>
                <Button type='submit' disabled={this.state.disableButton} icon='mode_edit' label='Update Expense' raised primary />
                <Button
                    onClick={this.removeExpense.bind(this)}
                    type='button'
                    icon='delete'
                    label='Remove Expense'
                    className='float-right'
                    accent />
            </div>
        }
        return button;
    }

    accountItem (account) {

        let parentClass = '';

        if(account.removeRightBorder){
            parentClass = theme['removeRightBorder']
        }

        if(account.removeBottomBorder){
            parentClass = theme['removeBottomBorder']
        }

        return (
            <div className={parentClass}>
                <i className={account.bank}/>
            </div>
        );
    }

    accounts(){
        return this.props.accounts.map((account, index) => {
            account.value = account._id;

            index++;
            if(index % 3 == 0){
                account.removeRightBorder = true
            }
            let lastItems = this.props.accounts.length % 3 == 0 ? 3 : this.props.accounts.length % 3;
            if(index > this.props.accounts.length - lastItems){
                account.removeBottomBorder = true
            }

            return account;
        })
    }

    categoryItem(category){
        const containerStyle = {
            display: 'flex',
            flexDirection: 'row'
        };

        return (
            <div style={containerStyle}>
                <div className={theme.iconsBox}>
                    <i className={category.icon}/>
                    <strong>{category.name}</strong>
                </div>
            </div>
        );
    }

    categories(){
        return this.props.categories.map((category) => {
            category.value = category._id;
            return category;
        })
    }

    componentWillMount(){
        //we create this rule both on client and server
        Slingshot.fileRestrictions('imageUploader', {
            allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
            maxSize: 4 * 1024 * 1024 // 4 MB (use null for unlimited).
        });
    }

    resetBillUpload(){
        this.setState({
            data_uri: '',
            billUrl: ''
        });
    }

    uploadBill(value, e){
        let userId = Meteor.user()._id;
        if(e.target.files.length){

            this.setState({
                disableButton: true,
                loading: true
            });

            const reader = new FileReader();
            const file = e.target.files[0];
            reader.onload = (upload) => {
                console.log(upload);
                this.setState({
                    data_uri: upload.target.result
                });
            };
            reader.readAsDataURL(file);

            let metaContext = {
                uploaderId: userId
            };

            let uploader = new Slingshot.Upload('imageUploader', metaContext);
            this.props.handler(true);
            uploader.send(e.target.files[0],  (error, downloadUrl) => { // you can use refs if you like
                if (error) {
                    this.props.handler(false);
                    // Log service detailed response
                    console.error('Error uploading', uploader.xhr.response);
                    alert (error); // you may want to fancy this up when you're ready instead of a popup.
                }
                else {
                    // we use $set because the user can change their avatar so it overwrites the url :)
                    //Meteor.users.update(Meteor.userId(), {$set: {"profile.avatar": downloadUrl}});
                    console.log(downloadUrl);
                    this.setState({billUrl: downloadUrl});
                }
                this.setState({
                    disableButton: false,
                    loading: false
                });
            });
        }
    }

    render() {
        //Show bill if added
        if(this.state.billUrl || this.state.data_uri){
            var uploadedBill = <div className={theme.backgroundUpload} style={{backgroundImage: `url(${this.state.billUrl || this.state.data_uri})`}}>
                <Button
                    className='bill-change-button'
                    label='Change Bill'
                    type='button'
                    onClick={this.resetBillUpload.bind(this)}
                    />
            </div>
        }else{
            //Enable upload bill option
            var billUpload = <Input
                type='file'
                id='input'
                onChange={this.uploadBill.bind(this)} />
        }
        return (
            <div>
                <form onSubmit={this.onSubmit.bind(this)} className="add-expense">

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

                    <Dropdown theme={theme}
                        auto={false}
                        source={this.accounts()}
                        name='account'
                        onChange={this.onChange.bind(this)}
                        label='Select your account'
                        value={this.state.account}
                        template={this.accountItem}
                        required
                        />

                    <Input type='number' label='Amount'
                           name='amount'
                           value={this.state.amount}
                           onChange={this.onChange.bind(this)}
                           required
                        />
                    <Dropdown
                        auto={false}
                        source={this.categories()}
                        name='category'
                        onChange={this.onChange.bind(this)}
                        label='Select your category'
                        value={this.state.category}
                        template={this.categoryItem}
                        required
                        />
                    <Input type='text' label='Description' className={theme.boxShadowNone}
                           name='description'
                           multiline
                           value={this.state.description}
                           onChange={this.onChange.bind(this)}
                           required
                        />
                    <DatePicker
                        label='Creation Date'
                        name='spentAt'
                        onChange={this.onChange.bind(this)}
                        value={this.state.spentAt}
                        />
                    <TimePicker
                        label='Creation time'
                        name='spentTime'
                        onChange={this.onChange.bind(this)}
                        value={this.state.spentTime}
                        format='ampm'
                        />

                    {billUpload}


                    {this.renderButton()}
                </form>
                <div className={theme.uploadImage}>
                    {uploadedBill}
                </div>
            </div>
        );
    }
}

ExpensesSideBar.propTypes = {
    expense: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    expenseExists: PropTypes.bool.isRequired
};

export default createContainer((props) => {
    const { id } = props.params;
    const expenseHandle = Meteor.subscribe('expenses.single', id);
    const accountsHandle = Meteor.subscribe('accounts');
    const categoriesHandle = Meteor.subscribe('categories');
    const loading = !expenseHandle.ready();
    const expense = Expenses.findOne(id);
    const expenseExists = !loading && !!expense;
    return {
        loading,
        expenseExists,
        expense: expenseExists ? expense : {},
        accounts: Accounts.find({}).fetch(),
        categories: Categories.find({}).fetch()
    };
}, ExpensesSideBar);