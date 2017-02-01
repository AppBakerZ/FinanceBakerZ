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
            <Dialog
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
            <div>
                <div><p>Are you sure to delete this category?</p></div>

                <div>
                    <Button label='Yes' raised accent onClick={this.removeCategory.bind(this)} />
                    <Button label='No' raised accent onClick={this.closePopup.bind(this)} />
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

    renderSubcategories(children, id){
        return children.map((cat) => {
            return <span key={cat}>
                    <Link
                        activeClassName='active'
                        to={`/app/categories/${id}/${cat}`}>
                        {cat}

                        <a data-text={cat} href='#' onClick={this.deleteSubcategory.bind(this)}>
                            x
                        </a>

                    </Link>
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
                icon: <img src="/assets/images/Colourful Rose Flower Wallpapers (2).jpg" alt=""/>,
                content:
                    <div>
                        <div><strong>{category.name}</strong></div>
                        {this.renderSubcategories(category.children || [], category._id)}
                    </div>,
                actions:
                    <div className={theme.buttonBox}>
                        <Button
                            label='Edit Info'
                            raised
                            onClick={this.openPopup.bind(this, 'edit', category)}
                            accent />
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