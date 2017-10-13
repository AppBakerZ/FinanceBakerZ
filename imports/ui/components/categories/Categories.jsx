import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { routeHelpers } from '../../../helpers/routeHelpers.js';

import { Button, Table, Card, FontIcon, Dialog, Snackbar } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';
import ConfirmationMessage from '../utilityComponents/ConfirmationMessage/ConfirmationMessage';

import Loader from '/imports/ui/components/loader/Loader.jsx';

import theme from './theme';
import buttonTheme from './buttonTheme';
import tableTheme from './tableTheme';
import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';


const il8n = defineMessages({
    ADD_CATEGORIES: {
        id: 'CATEGORIES.ADD_CATEGORY_TO_SHOW'
    },
    CLIENT_DETAILS: {
        id: 'PORJECTS.CLIENTDETAILS'
    },
    NO_CATEGORIES_ADDED: {
        id: 'CATEGORIES.NO_CATEGORIES_ADDED'
    },
    SHOW_CATEGORIES: {
        id: 'CATEGORIES.SHOW_CATEGORIES'
    },
    ADD_CATEGORY_BUTTON: {
        id: 'CATEGORIES.ADD_CATEGORY_BUTTON'
    },
    REMOVE_CATEGORIES: {
        id: 'CATEGORIES.REMOVE_CATEGORIES'
    },
    INFORM_MESSAGE: {
        id: 'CATEGORIES.INFORM_MESSAGE'
    },
    CONFIRMATION_MESSAGE: {
        id: 'CATEGORIES.CONFIRMATION_MESSAGE'
    },
    BACK_BUTTON: {
        id: 'CATEGORIES.BACK_BUTTON'
    },
    REMOVE_BUTTON: {
        id: 'CATEGORIES.REMOVE_BUTTON'
    }
});


class CategoriesPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            removeConfirmMessage: false,
            openDialog: false,
            selectedCategory: null,
            action: null,
            active: false,
            loading: false
        };

    }

    checkSubCategory() {
        return this.state.action === 'removeSubcategory';
    }

    addCategory(){
        routeHelpers.changeRoute('/app/categories/add/new');
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
    removeCategory(){
        this.setState({
            openDialog: false
        });
        const { _id, name, parent, children } = this.state.selectedCategory;
        let ids = [], names = [];
        children.map((catName) =>{
            //get all ids of children for backend
            if(_.values(children).length && catName.id){
                ids.push(catName.id)
            }
            //fall back for old categories
            else{
                names.push(catName)
            }
        });

        Meteor.call('categories.remove', {
            category: {
                _id,
                name,
                parent,
                ids,
                names
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
                    barMessage: 'Category deleted successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
        });
        // Close Popup
        this.setState({
            openDialog: false
        });
    }

    removeSubcategory(){
        this.setState({
            openDialog: false
        });
        const { _id, name } = this.state.selectedCategory;
        Meteor.call('categories.removeFromParent', {
            category: {
                _id,
                name
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
                    barMessage: 'Category deleted successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
        });
        // Close Popup
        this.setState({
            openDialog: false
        });
    }

    categoryDetail(category){
        routeHelpers.changeRoute(`/app/categoryDetail/${category._id}`);
    }

    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }

    renderSubcategories(children, parent){
        return children.map((catName, i) => {
            let catId;
            if(_.values(catName).length && catName.name){
                catName = catName.name;
                catId = catName.id;
            }
            let obj = {
                name: catName
            };
            catId && (obj._id = catId);
            //fallback parent within $or added for old records
            obj.$or = [ { parent: parent.name }, { 'parent.id': parent._id } ];
            const category = Categories.findOne(obj);
            if(!category){
                return;
            }
            return <span key={catName + i}>
                    <div onClick={this.categoryDetail.bind(this, category)}>
                        {catName}
                        <a data-text={name} onClick={this.openPopup.bind(this, 'removeSubcategory', category)} > x </a>
                    </div>
                    </span>
        });
    }
    render() {
        const { formatMessage } = this.props.intl;
        const { openDialog } = this.state;
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
                        <div><strong onClick={this.categoryDetail.bind(this, category)}>{category.name}</strong></div>
                        {this.renderSubcategories(category.children || [], category)}
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
                <span className={theme.errorShow}>  <FormattedMessage {...il8n.NO_CATEGORIES_ADDED} /> </span>
                <div className={theme.addCategoryBtn}>
                    <Button type='button' icon='add' raised primary onClick={this.addCategory.bind(this)} />
                </div>
                <span className={theme.errorShow}> <FormattedMessage {...il8n.ADD_CATEGORIES} /> </span>
            </div>;

        return (
            <div style={{ flex: 1, display: 'flex', position: 'relative', overflowY: 'auto' }}>
                <div className={theme.categoriesContent}>
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
                    <div className={theme.categoriesTitle}>
                        <h3> <FormattedMessage {...il8n.SHOW_CATEGORIES} /> </h3>
                        <Button
                            className={theme.button}
                            icon='add'
                            label={formatMessage(il8n.ADD_CATEGORY_BUTTON)}
                            flat
                            onClick={this.addCategory.bind(this)}
                            theme={buttonTheme}/>
                    </div>
                    <Card theme={tableTheme} className={theme.categoriesTable}>
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
                <ConfirmationMessage
                    heading={formatMessage(il8n.REMOVE_CATEGORIES)}
                    information={formatMessage(il8n.INFORM_MESSAGE)}
                    confirmation={formatMessage(il8n.CONFIRMATION_MESSAGE)}
                    open={openDialog}
                    route="/app/categories"
                    defaultAction={this.removeCategory.bind(this)}
                    alternateAction={this.removeSubcategory.bind(this)}
                    condition={this.checkSubCategory()}
                    close={this.closePopup.bind(this)}
                />
            </div>
        );
    }
}

CategoriesPage.propTypes = {
    categories: PropTypes.array.isRequired,
    intl: intlShape.isRequired
};

CategoriesPage = createContainer(() => {
    const categoriesHandle = Meteor.subscribe('categories');
    const categoriesLoading = !categoriesHandle.ready();
    const categories = Categories.find({
        parent: null
    }, {sort: {createdAt: -1}}).fetch();
    const children = Categories.find({
        parent: {$exists: true, $ne: null}
    }, {sort: {createdAt: -1}}).fetch();
    const categoriesExists = !categoriesLoading && !!categories.length;

    return {
        categories,
        children,
        categoriesLoading,
        categoriesExists
    };
}, CategoriesPage);

export default injectIntl(CategoriesPage);

