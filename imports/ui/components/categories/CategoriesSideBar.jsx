import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { Input, Button, ProgressBar, Snackbar } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';
import { Accounts } from '../../../api/accounts/accounts.js';

import iScroll from 'iscroll'
import ReactIScroll from 'react-iscroll'

const iScrollOptions = {
    mouseWheel: true,
    scrollbars: true,
    scrollX: true,
    click : true
};

export default class CategoriesSideBar extends Component {

    constructor(props) {
        super(props);

        let datetime = new Date();

        this.state = {
            name: '',
            icon: '',
            active: false,
            loading: false
        };
    }

    setCurrentRoute(){
        this.setState({
            isNewRoute: this.props.history.isActive('app/categories/new')
        })
    }

    resetCategory(){
        this.setState({
            name: '',
            icon: ''
        })
    }

    onSubmit(event){
        event.preventDefault();
        this.state.isNewRoute ? this.createCategory() : this.updateCategory();
        this.setState({loading: true})
    }

    createCategory(){
        let {name, icon} = this.state;

        Meteor.call('categories.insert', {
            category: {
                name,
                icon
            }
        }, (err, response) => {
            if(response){
                this.setState({
                    active: true,
                    barMessage: 'Category created successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
                this.resetCategory();
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

    updateCategory(){
        let {_id, name, icon} = this.state;

        Meteor.call('categories.update', {
            category: {
                _id,
                name,
                icon
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
                    barMessage: 'Category updated successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
            this.setState({loading: false})
        });
    }

    removeCategory(){
        const {_id} = this.state;
        Meteor.call('categories.remove', {
            category: {
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
                this.props.history.replace('/app/categories/new');
                this.setState({
                    active: true,
                    barMessage: 'Category deleted successfully',
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
        this.setState(p.category);
        this.setCurrentRoute();
        if(this.state.isNewRoute){
            this.resetCategory()
        }
    }

    renderButton (){
        let button;
        if(this.state.isNewRoute){
            button = <div className='sidebar-buttons-group'>
                <Button icon='add' label='Add Category' raised primary />
            </div>
        }else{
            button = <div className='sidebar-buttons-group'>
                <Button icon='mode_edit' label='Update Category' raised primary />
                <Button
                    onClick={this.removeCategory.bind(this)}
                    type='button'
                    icon='delete'
                    label='Remove Category'
                    className='float-right'
                    accent />
            </div>
        }
        return button;
    }

    render() {
        return (
            <ReactIScroll iScroll={iScroll} options={iScrollOptions}>
                <form onSubmit={this.onSubmit.bind(this)} className="add-category">

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

                    <Input type='text' label='Name'
                           name='name'
                           maxLength={ 50 }
                           value={this.state.name}
                           onChange={this.onChange.bind(this)}
                           required
                        />
                    <Input type='text' label='Icon'
                           name='icon'
                           maxLength={ 50 }
                           value={this.state.icon}
                           onChange={this.onChange.bind(this)}
                           required
                        />
                    {this.renderButton()}
                </form>
            </ReactIScroll>
        );
    }
}

CategoriesSideBar.propTypes = {
    category: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    categoryExists: PropTypes.bool.isRequired
};

export default createContainer((props) => {
    const { id } = props.params;
    const categoryHandle = Meteor.subscribe('categories.single', id);
    const loading = !categoryHandle.ready();
    const category = Categories.findOne(id);
    const categoryExists = !loading && !!category;
    return {
        loading,
        categoryExists,
        category: categoryExists ? category : {}
    };
}, CategoriesSideBar);