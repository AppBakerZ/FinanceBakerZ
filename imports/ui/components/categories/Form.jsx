import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { Input, Button, ProgressBar, Snackbar, Dropdown, FontIcon } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';
import { Accounts } from '../../../api/accounts/accounts.js';

import theme from './theme';

export default class Form extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            icon: '',
            active: false,
            loading: false,
            parent: null
        };
    }

    onSubmit(event){
        event.preventDefault();
        !this.props.category ? this.createCategory() : this.updateCategory();
        this.setState({loading: true})
    }

    createCategory(){
        let {name, icon, parent} = this.state;

        Meteor.call('categories.insert', {
            category: {
                name,
                icon,
                parent
            }
        }, (err, response) => {
            if(response){
                this.setState({
                    active: true,
                    barMessage: 'Category created successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
                setTimeout(()=> {
                    this.props.closePopup();
                }, 1000)
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
        let {_id, name, icon, parent} = this.state;

        Meteor.call('categories.update', {
            category: {
                _id,
                name,
                icon,
                parent
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
                this.props.closePopup();
            }
            this.setState({loading: false})
        });
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
    }

    onChangeParentCategory (val) {
        this.setState({parent: val});
    }

    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }

    progressBarToggle (){
        return this.state.loading ? 'progress-bar' : 'progress-bar hide';
    }

    componentDidMount (){
        this.setState(this.props.category);
    }

    categories(){
        let cats = this.props.categories.map((category) => {
            return {value: category.name, label: category.name};
        });
        cats.unshift({value: null, label: 'No Parent'});
        return cats
    }

    renderButton (){
        let button;
        if(!this.props.category){
            button = <div className={theme.addBtn}><Button type='submit' icon='add' label='Add Category' raised primary /></div>
        }else{
            button = <div className={theme.addBtn}><Button type='submit' icon='mode_edit' label='Update Category' raised primary /></div>
        }
        return button;
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
                <FontIcon value={category.icon} style={imageStyle}/>
                <div style={contentStyle}>
                    <strong>{category.label}</strong>
                </div>
            </div>
        );
    }

    render() {
        return (
            <form onSubmit={this.onSubmit.bind(this)} className={theme.addCategory}>

                <ProgressBar type="linear" mode="indeterminate" multicolor className={this.progressBarToggle()} />

                <h3 className={theme.titleAccount}>add categories</h3>

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

                <Dropdown
                    auto
                    name='parent'
                    onChange={this.onChangeParentCategory.bind(this)}
                    source={this.categories()}
                    value={this.state.parent}
                    label='Select parent category'
                    template={this.categoryItem}
                    />

                {this.renderButton()}
            </form>
        );
    }
}