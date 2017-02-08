import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Button, Table, Card, FontIcon, Dialog } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';

import Form from './Form.jsx';
import Loader from '/imports/ui/components/loader/Loader.jsx';

import theme from './theme';
import buttonTheme from './buttonTheme';
import tableTheme from './tableTheme';
import dialogButtonTheme from './dialogButtonTheme';
import dialogTheme from './dialogTheme';



class CategoriesPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            removeConfirmMessage: false,
            openDialog: false,
            selectedCategory: null,
            action: null
        };

    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
    }
    popupTemplate(){
        return(
            <Dialog theme={dialogTheme}
                active={this.state.openDialog}
                onEscKeyDown={this.closePopup.bind(this)}
                onOverlayClick={this.closePopup.bind(this)}
                >
                {this.switchPopupTemplate()}
            </Dialog>
        )
    }
    switchPopupTemplate(){
        switch (this.state.action){
            case 'remove':
                return this.renderConfirmationMessage();
                break;
            case 'edit':
                return <Form categories={this.props.categories} category={this.state.selectedCategory} closePopup={this.closePopup.bind(this)} />;
                break;
            case 'add':
                return <Form categories={this.props.categories} closePopup={this.closePopup.bind(this)} />;
                break;
        }
    }
    openPopup (action, category) {
        this.setState({
            openDialog: true,
            action,
            selectedCategory: category || null
        });
    }
    closePopup () {
        this.setState({
            openDialog: false
        });
    }
    renderConfirmationMessage(){
        return (
            <div className={theme.dialogContent}>
                <div>
                    <h3>remove category</h3>
                    <p>This will remove your all data</p>
                    <p>Are you sure to remove your category?</p>
                </div>

                <div className={theme.buttonBox}>
                    <Button label='GO BACK' raised primary onClick={this.closePopup.bind(this)} />
                    <Button label='YES, REMOVE' raised onClick={this.removeCategory.bind(this)} theme={dialogButtonTheme} />
                </div>
            </div>
        )
    }
    removeCategory(){
        const {_id, name, parent} = this.state.selectedCategory;
        Meteor.call('categories.remove', {
            category: {
                _id,
                name,
                parent
            }
        }, (err, response) => {
            if(err){

            }else{

            }
        });
        // Close Popup
        this.setState({
            openDialog: false
        });
    }

    deleteSubcategory(e){
        e.stopPropagation();
        e.preventDefault();
        Meteor.call('categories.removeFromParent', {
            category: {
                name: e.currentTarget.dataset.text
            }
        }, (err, response) => {
            if(err){
                console.log(err)
            }else{

            }
        });
    }

    renderSubcategories(children, parent){
        return children.map((name) => {
            return <span key={name}>
                    <div onClick={this.openPopup.bind(this, 'edit', Categories.findOne({name, parent}))}>
                        {name}
                        <a data-text={name} onClick={this.deleteSubcategory.bind(this)}> x </a>
                    </div>
                    </span>
        });
    }
    render() {

        const model = {
            icon: {type: String},
            content: {type: String},
            actions: {type: String}
        };
        let categories = this.props.categories.map((category) => {
            return {
                icon: <i className={category.icon}/>,
                content:
                    <div>
                        <div><strong onClick={this.openPopup.bind(this, 'edit', category)}>{category.name}</strong></div>
                        {this.renderSubcategories(category.children || [], category.name)}
                    </div>,
                actions:
                    <div className={theme.buttonBox}>
                        <Button
                            label=''
                            icon='close'
                            raised
                            onClick={this.openPopup.bind(this, 'remove', category)}
                            theme={buttonTheme} />
                    </div>
            }
        });

        return (
            <div style={{ flex: 1, display: 'flex', position: 'relative', overflowY: 'auto' }}>
                <div className={theme.categoriesContent}>
                    <div className={theme.categoriesTitle}>
                        <h3>Categories</h3>
                        <Button
                            className={theme.button}
                            icon='add'
                            label='CATEGORIES'
                            flat
                            onClick={this.openPopup.bind(this, 'add')}
                            theme={buttonTheme}/>
                    </div>
                    <Card theme={tableTheme}>
                        <Table
                            selectable={false}
                            heading={false}
                            model={model}
                            source={categories}/>
                    </Card>
                </div>
                {this.popupTemplate()}
            </div>
        );
    }
}

CategoriesPage.propTypes = {
    categories: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('categories');

    return {
        categories: Categories.find({
            parent: null
        }, {sort: {createdAt: -1}}).fetch()
    };
}, CategoriesPage);