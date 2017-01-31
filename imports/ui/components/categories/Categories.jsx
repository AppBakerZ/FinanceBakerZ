import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Button, Table, Card, FontIcon } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';

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
            return <span style={{marginRight: '5px', padding: '3px', background: '#fafafa'}}>
                    <Link style={{display: 'inherit'}}
                          activeClassName='active'
                          to={`/app/categories/${id}/${cat}`}>
                        {cat}

                        <a style={{paddingLeft: '5px', display: 'inherit'}} data-text={cat} href='#' onClick={this.deleteSubcategory.bind(this)}>
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
                icon: <FontIcon value={category.icon} />,
                content:
                    <div>
                        <div><strong>{category.name}</strong></div>
                        {this.renderSubcategories(category.children || [], category._id)}
                    </div>,
                actions:
                    <div>
                        <Button
                            label=''
                            icon='close'
                            raised />
                    </div>
            }
        });

        return (
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                <Link
                    to={`/app/categories/new`}>
                    <Button onClick={ this.toggleSidebar.bind(this) } icon='add' floating accent className='add-button' />
                </Link>

                <div>
                    <div>
                        <h3>Categories</h3>
                    </div>
                    <Card>
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