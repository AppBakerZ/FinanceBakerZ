import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { Input, Button, ProgressBar, Snackbar, Dropdown, FontIcon } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';
import { Accounts } from '../../../api/accounts/accounts.js';

import theme from './theme';
import dropdownTheme from './dropdownTheme';

import fonts from '/imports/ui/fonts.js';

export default class Form extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            icon: '',
            active: false,
            loading: false,
            parent: null,
            iconSelected: 'en'
        };

        this.icons = fonts.map((font, index) => {
            index++;
            if(index % 5 == 0){
                font.removeRightBorder = true
            }
            let lastItems = fonts.length % 5 == 0 ? 5 : fonts.length % 5;
            console.log(lastItems);
            if(index > fonts.length - lastItems){
                font.removeBottomBorder = true
            }
            return font
        });

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
            return {value: category.name, label: category.name, icon: category.icon};
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

        const contentStyle = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 2,
            paddingTop: '4px'
        };
        console.log(category.icon);
        return (
            <div style={containerStyle}>
                <div className={theme.selectParent}>
                    <i className={category.icon}/>
                    <strong>{category.label}</strong>
                </div>
            </div>
        );
    }

    categoryIcons(icon){
        let parentClass = '';
        if(icon.removeRightBorder){
            parentClass = dropdownTheme['removeRightBorder']
        }

        if(icon.removeBottomBorder){
            parentClass = dropdownTheme['removeBottomBorder']
        }

        return (
            <div className={parentClass}>
                <i className={icon.value}/>
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

                <Dropdown theme={dropdownTheme}
                    source={this.icons}
                    name='icon'
                    onChange={this.onChange.bind(this)}
                    value={this.state.icon}
                    label='Select Icon'
                    template={this.categoryIcons}
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