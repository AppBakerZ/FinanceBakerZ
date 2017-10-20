import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { createContainer } from 'meteor/react-meteor-data';
import { routeHelpers } from '../../../../helpers/routeHelpers.js'

import { Input, Button, ProgressBar, Snackbar, Dropdown, DatePicker, TimePicker, FontIcon, IconButton } from 'react-toolbox';
import { Card} from 'react-toolbox/lib/card';

import { Meteor } from 'meteor/meteor';

import {FormattedMessage, intlShape, injectIntl, defineMessages} from 'react-intl';

import { Categories } from '../../../../api/categories/categories.js'

//*
import theme from './theme.scss';

import dropdownTheme from '../dropdownTheme';

import fonts from '/imports/ui/fonts.js';


const il8n = defineMessages({
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
    PARENT_CATEGORY: {
        id: 'CATEGORIES.PARENT_CATEGORY'
    }
});



class NewCategoryPage extends Component {

    constructor(props) {
        super(props);

        const { formatMessage } = this.props.intl;

        this.state = {
            name: '',
            parentName : '',
            icon: '',
            active: false,
            loading: false,
            disableButton: false,
            parentId: null,
            iconSelected: 'en',
            isNew: false,
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

    categories(){
        const { params, categories } = this.props;
        const { id } = params;

        let cats = categories.filter((category) => {
            return category._id !== id
        });
        cats = cats.map((category) => {
            return {value: category._id, label: category.name, icon: category.icon, name: category.name};
        });
        cats.unshift({value: null, label: 'No Parent'});
        return cats
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
            <div className={parentClass} title={icon.label.replace(/-/g, " ")}>
                <i className={icon.value}/>
            </div>
        );
    }

    setCurrentRoute(value){
        this.setState({
            isNew: value
        })
    }

    componentDidMount (){
        this.updateCategoryProps(this.props)
    }

    componentWillReceiveProps (p){
        this.updateCategoryProps(p)
    }

    updateCategoryProps(p){
        let { category } = p;
        let { parent } = category;
        let { id } = p.params;
        let isNew = id === 'new';
        if( !isNew ){
            if(parent && parent.name){
                category.parentName = parent.name;
                category.parentId = parent.id
            }
            else{
                //fallback code added on initialize update
                let parentExists = Categories.findOne({name: parent});
                if(parentExists){
                    category.parentId = parentExists._id;
                    category.parentName = parentExists.name;
                }
            }
            this.setState(category);
        }
        this.setCurrentRoute(isNew);
    }

    createCategory(){
        let {name, icon, parentId, parentName } = this.state, parent;
        if(parentId || parentName){
            parent = {
                name: parentName,
                id: parentId
            };
        }

        Meteor.call('categories.insert', {
            category: {
                name,
                icon,
                parent
            }
        }, (err, response) => {
            if(response){
                routeHelpers.changeRoute('/app/categories', 1200, {}, true);
                this.setState({
                    active: true,
                    barMessage: 'Category created successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }else{
                this.setState({
                    disableButton: false,
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }
            this.setState({loading: false});
        });
    }

    updateCategory(){
        let {_id, name, icon, parentId, parentName} = this.state, parent;
        if(parentId || parentName){
            parent = {
                name: parentName,
                id: parentId
            };
        }
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
                    disableButton: false,
                    active: true,
                    barMessage: err.reason,
                    barIcon: 'error_outline',
                    barType: 'cancel'
                });
            }else{
                routeHelpers.changeRoute('/app/categories', 1200, {}, true);
                this.setState({
                    active: true,
                    barMessage: 'Category updated successfully',
                    barIcon: 'done',
                    barType: 'accept'
                });
            }
            this.setState({loading: false});
        });
    }

    onSubmit(event){
        event.preventDefault();
        this.setState({
            disableButton: true,
            loading: true
        });
        this.state.isNew ? this.createCategory() : this.updateCategory();
    }

    onChange (val, e) {
        this.setState({[e.target.name]: val});
    }

    onChangeParentCategory (val, e) {
        let parent = Categories.findOne({_id: val});
        this.setState({
            parentId: val,
            parentName: parent && parent.name
        });
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

    renderButton (){
        const { formatMessage } = this.props.intl;
        let button;
        if(this.state.isNew){
            button = <div className={theme.addBtn}><Button type='submit' icon='add' label={formatMessage(il8n.ADD_CATEGORY)} raised primary disabled={this.state.disableButton}/></div>
        }else{
            button = <div className={theme.addBtn}><Button type='submit' icon='mode_edit' label={formatMessage(il8n.UPDATE_CATEGORIES)} raised primary disabled={this.state.disableButton}/></div>
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

        return (
            <div style={containerStyle}>
                <div className={theme.selectParent}>
                    <i className={category.icon}/>
                    <strong>{category.label}</strong>
                </div>
            </div>
        );
    }

    render() {
        const { formatMessage } = this.props.intl;
        const { children }  = this.state;
        return (
            <div className={theme.incomeCard}>
                <Card theme={theme}>
                    <h3>{this.state.isNew ? <FormattedMessage {...il8n.ADD_CATEGORIES} /> : <FormattedMessage {...il8n.UPDATE_CATEGORIES} />}</h3>
                    <form onSubmit={this.onSubmit.bind(this)} className={theme.incomeForm}>

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

                        <Input type='text' label={formatMessage(il8n.CATEGORY_NAME)}
                               name='name'
                               maxLength={50}
                               value={this.state.name}
                               onChange={this.onChange.bind(this)}
                               required
                        />

                        <Dropdown theme={dropdownTheme} className={theme.projectStatus}
                                  source={this.icons}
                                  name='icon'
                                  onChange={this.onChange.bind(this)}
                                  label={formatMessage(il8n.CATEGORY_ICON)}
                                  value={this.state.icon}
                                  template={this.categoryIcons}
                                  required
                        />

                        {/*hide the option if category has any children*/}
                        {children && (children.length > 0) ? '' :
                        < Dropdown theme={theme} className={theme.projectStatusResponsive}
                            auto
                            source={this.categories()}
                            name='parentId'
                            onChange={this.onChangeParentCategory.bind(this)}
                            label={formatMessage(il8n.PARENT_CATEGORY)}
                            value={this.state.parentId}
                            template={this.categoryItem}
                            required
                            />
                        }

                        {this.renderButton()}
                    </form>
                </Card>
            </div>
        );
    }
}

NewCategoryPage.propTypes = {
    category: PropTypes.object.isRequired,
    intl: intlShape.isRequired
};

NewCategoryPage = createContainer((props) => {
    const { id } = props.params;
    const categoriesHandle = Meteor.subscribe('categories');
    const categoriesLoading = !categoriesHandle.ready();
    const categories = Categories.find({
        parent: null
    }, {sort: {createdAt: -1}}).fetch();
    const children = Categories.find({
        parent: {$exists: true, $ne: null}
    }, {sort: {createdAt: -1}}).fetch();
    const category = Categories.findOne({_id: id});
    const categoriesExists = !categoriesLoading && !!categories.length;

    return {
        categories,
        children,
        categoriesLoading,
        categoriesExists,
        category: category ? category : {}
    };
}, NewCategoryPage);

export default injectIntl(NewCategoryPage);
