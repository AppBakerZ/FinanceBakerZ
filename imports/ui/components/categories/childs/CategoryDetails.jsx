import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import RecordsNotExists from '../../utilityComponents/RecordsNotExist/NoRecordFound';

import { routeHelpers } from '../../../../helpers/routeHelpers.js'
import { Categories } from '../../../../api/categories/categories.js'

import {FormattedMessage, FormattedNumber, intlShape, injectIntl, defineMessages} from 'react-intl';
import { Button, Snackbar, Dialog } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';

import theme from './theme';
import dialogButtonTheme from '../dialogButtonTheme';
import dialogTheme from '../dialogTheme'

import fonts from '/imports/ui/fonts.js';


const il8n = defineMessages({
    INFORM_MESSAGE: {
        id: 'CATEGORIES.INFORM_MESSAGE'
    },
    CONFIRMATION_MESSAGE: {
        id: 'CATEGORIES.CONFIRMATION_MESSAGE'
    },
    REMOVE_CATEGORIES: {
        id: 'CATEGORIES.REMOVE_CATEGORIES'
    },
    ADD_CATEGORY: {
        id: 'CATEGORIES.ADD_CATEGORY'
    },
    UPDATE_CATEGORIES: {
        id: 'CATEGORIES.UPDATE_CATEGORY'
    },
    ADD_CATEGORIES: {
        id: 'CATEGORIES.ADD_CATEGORIES'
    },
    CATEGORY_NAME: {
        id: 'CATEGORIES.CATEGORY_NAME'
    },
    CATEGORY_ICON: {
        id: 'CATEGORIES.CATEGORY_ICON'
    },
    DISPLAY_CATEGORY_ICON: {
        id: 'CATEGORIES.DISPLAY_CATEGORY_ICON'
    },
    PARENT_CATEGORY: {
        id: 'CATEGORIES.PARENT_CATEGORY'
    },
    DISPLAY_PARENT_CATEGORY: {
        id: 'CATEGORIES.DISPLAY_PARENT_CATEGORY'
    },
    BACK_BUTTON: {
        id: 'CATEGORIES.BACK_BUTTON'
    },
    REMOVE_BUTTON: {
        id: 'CATEGORIES.REMOVE_BUTTON'
    }
});

class CategoryDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            icon: '',
            active: false,
            loading: false,
            parent: null,
            iconSelected: 'en',
            removeConfirmMessage: false,
            openDialog: false,
            action: null
        };

        this.icons = fonts.map((font, index) => {
            index++;
            if(index % 5 === 0){
                font.removeRightBorder = true
            }
            let lastItems = fonts.length % 5 === 0 ? 5 : fonts.length % 5;
            if(index > fonts.length - lastItems){
                font.removeBottomBorder = true
            }
            return font
        });

    }

    componentDidMount (){
        this.setState(this.props.category);
    }

    componentWillReceiveProps(p){
        this.setState(p.category);
    }

    editCategory(){
        routeHelpers.changeRoute(`/app/categories/edit/${this.props.params.id}`);
    }

    removeCategory(){
        const {_id, name, parent, children} = this.state;
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
                routeHelpers.changeRoute('/app/categories', 1200);
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
        const {_id, name } = this.state;
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
                routeHelpers.changeRoute('/app/categories', 1200);
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

    handleBarClick (event, instance) {
        this.setState({ active: false });
    }

    handleBarTimeout (event, instance) {
        this.setState({ active: false });
    }

    popupTemplate(){
        return(
            <Dialog theme={dialogTheme}
                    active={this.state.openDialog}
                    onEscKeyDown={this.closePopup.bind(this)}
                    onOverlayClick={this.closePopup.bind(this)}
            >
                {this.renderConfirmationMessage(this.props.isParent)}
            </Dialog>
        )
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

    renderConfirmationMessage(isParent){
        const { formatMessage } = this.props.intl;
        return (
            <div className={theme.dialogContent}>
                <div>
                    <h3> <FormattedMessage {...il8n.REMOVE_CATEGORIES} /> </h3>
                    <p> <FormattedMessage {...il8n.INFORM_MESSAGE} /> </p>
                    <p> <FormattedMessage {...il8n.CONFIRMATION_MESSAGE} /> </p>
                </div>
                <div className={theme.buttonBox}>
                    <Button label={formatMessage(il8n.BACK_BUTTON)} raised primary onClick={this.closePopup.bind(this)} />
                    <Button label={formatMessage(il8n.REMOVE_BUTTON)} raised onClick={isParent ? this.removeCategory.bind(this) : this.removeSubcategory.bind(this)} theme={dialogButtonTheme} />
                </div>
            </div>
        )
    }

    /*************** template render ***************/
    render() {
        const { formatMessage } = this.props.intl;
        let { category } = this.props;
        let {_id, createdAt, parent } = category;
        if(parent && parent.name){
            parent = parent.name
        }
        let date = moment(createdAt).format('DD-MMM-YYYY');
        return (
            <div className={theme.viewExpense}>
                {Object.keys(category).length ?
                <div className="container">
                    <div className={theme.titleBox}>
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
                        <h3>{category.name}</h3>
                        <div className={theme.rightButtons}>
                            <Button onClick={this.editCategory.bind(this)}
                                    className='header-buttons'
                                    label="edit"
                                    name='Income'
                                    flat />
                            <Button onClick={this.openPopup.bind(this, 'removeSubcategory', category)}
                                    className='header-buttons'
                                    label="delete"
                                    name='Expense'
                                    flat />
                        </div>
                    </div>

                    <div className={theme.bankContent}>
                        <div className={theme.depositContent}>
                            <h6>Category ID: <span>{_id}</span></h6>
                            <h6>Date: <span>{date}</span></h6>
                            <h5><FormattedMessage {...il8n.CATEGORY_NAME} />: <span>{category.name}</span></h5>
                            <h5><FormattedMessage {...il8n.DISPLAY_CATEGORY_ICON} />: <span><i className={category.icon}/></span></h5>
                            {parent ? <h5><FormattedMessage {...il8n.DISPLAY_PARENT_CATEGORY} />: <span>{parent}</span></h5>  : ''}
                        </div>
                    </div>
                </div> : <RecordsNotExists route="app/categories" />}
                {this.popupTemplate()}
            </div>

        );
    }
}

CategoryDetail.propTypes = {
    intl: intlShape.isRequired
};

CategoryDetail = createContainer((props) => {
    const { id } = props.params;
    const projectHandle = Meteor.subscribe('categories.single', id);
    const category = Categories.findOne({_id: id});
    const isParent = category && !category.parent;
    return {
        isParent,
        category: category ? category : {},
    };
}, CategoryDetail);

export default injectIntl(CategoryDetail);