import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Button, Table, Card, FontIcon } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';

import theme from './theme';
import buttonTheme from './buttonTheme';
import tableTheme from './tableTheme';



class CategoriesPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
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
            return <span>
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
                            raised accent />
                        <Button
                            label=''
                            icon='close'
                            raised
                            theme={buttonTheme} />
                    </div>
            }
        });

        return (
            <div style={{ flex: 1, display: 'flex', position: 'relative', overflowY: 'auto' }}>
                <Link
                    to={`/app/categories/new`}>
                    <Button onClick={ this.toggleSidebar.bind(this) } icon='add' floating accent className='add-button' />
                </Link>

                <div className={theme.categoriesContent}>
                    <div className={theme.categoriesTitle}>
                        <h3>Categories</h3>
                        <Button className={theme.button} icon='add' label='CATEGORIES' flat onClick={ this.toggleSidebar.bind(this)} theme={buttonTheme}/>
                    </div>
                    <Card theme={tableTheme}>
                        <Table
                            selectable={false}
                            heading={false}
                            model={model}
                            source={categories}/>
                    </Card>
                </div>
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