import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { List, ListItem, Button, IconButton, ListSubHeader } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Categories } from '../../../api/categories/categories.js';

class SettingsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

        //this.toggleSidebar()
    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
    }

    renderCategory(){
        return (
            <section>
                <Link
                    activeClassName='active'
                    to={`/app/settings/currency`}>

                    <ListItem
                        selectable
                        onClick={ this.toggleSidebar.bind(this) }
                        leftIcon='attach_money'
                        caption='Currency Symbol'
                        />
                </Link>
            </section>
        )
    }

    render() {
        return (
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
                    <List ripple className='list'>
                        {this.renderCategory()}
                    </List>
                </div>
            </div>
        );
    }
}

SettingsPage.propTypes = {
    categories: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('categories');

    return {
        categories: Categories.find({}).fetch()
    };
}, SettingsPage);