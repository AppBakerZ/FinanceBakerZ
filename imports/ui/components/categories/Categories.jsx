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
            case 'removeSubcategory':
                return this.renderConfirmationMessage('removeSubcategory');
                break;
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
    openPopup (action, category, e) {
        if(e){
            e.stopPropagation();
            e.preventDefault();
        }
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
    renderConfirmationMessage(isRemoveSubcategory){
        return (
            <div className={theme.dialogContent}>
                <div>
                    <h3>remove category</h3>
                    <p>This will remove your all data</p>
                    <p>Are you sure to remove your category?</p>
                </div>

                <div className={theme.buttonBox}>
                    <Button label='GO BACK' raised primary onClick={this.closePopup.bind(this)} />
                    <Button label='YES, REMOVE' raised onClick={!isRemoveSubcategory ? this.removeCategory.bind(this) : this.removeSubcategory.bind(this)} theme={dialogButtonTheme} />
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

    removeSubcategory(e){
        //e.stopPropagation();
        //e.preventDefault();
        Meteor.call('categories.removeFromParent', {
            category: {
                name: this.state.selectedCategory.name
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

    renderSubcategories(children, parent){
        return children.map((name) => {
            const category = Categories.findOne({name, parent});
            return <span key={name}>
                    <div onClick={this.openPopup.bind(this, 'edit', category)}>
                        {name}
                        <a data-text={name} onClick={this.openPopup.bind(this, 'removeSubcategory', category)} > x </a>
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

        const addCategory =
            <div className={theme.categoryNothing}>
                <span className={theme.errorShow}>you do not have any categories</span>
                <div className={theme.addCategoryBtn}>
                    <Button type='button' icon='add' raised primary onClick={this.openPopup.bind(this, 'add')} />
                </div>
                <span className={theme.errorShow}>add some to show</span>
            </div>;

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
                        {this.props.categoriesLoading ? <Loader accent/> : this.props.categoriesExists ?
                            <Table className={theme.table} theme={tableTheme}
                                   selectable={false}
                                   heading={false}
                                   model={model}
                                   source={categories}/>

                            : addCategory
                        }
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
    const categoriesHandle = Meteor.subscribe('categories');
    const categoriesLoading = !categoriesHandle.ready();
    const categories = Categories.find({
        parent: null
    }, {sort: {createdAt: -1}}).fetch();
    const children = Categories.find({
        parent: {$exists: true}
    }, {sort: {createdAt: -1}}).fetch();
    const categoriesExists = !categoriesLoading && !!categories.length;

    return {
        categories,
        children,
        categoriesLoading,
        categoriesExists
    };
}, CategoriesPage);

