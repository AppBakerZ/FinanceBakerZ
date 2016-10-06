import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { List, ListItem, Button, IconButton, ListSubHeader } from 'react-toolbox';
import { Link } from 'react-router'

import { Meteor } from 'meteor/meteor';
import { Currencies } from '../../../../api/currencies/currencies.js';


class CurrencyPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    toggleSidebar(event){
        this.props.toggleSidebar(true);
    }

    renderCurrencies(){

        const { currencies } = this.props;
        let items = currencies.map((currency) => {
            return <Link
                key={currency._id}
                activeClassName='active'
                to={`/app/currency/${currency._id}`}>

                <ListItem
                    selectable
                    onClick={ this.toggleSidebar.bind(this) }
                    leftIcon={currency.icon}
                    rightIcon='mode_edit'
                    caption={currency.name}
                    />
            </Link>
        });

        return (
            <section>
                <h1>Currency Testing </h1>
                {items}
            </section>
        )
    }

    render() {
        return (
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                <Link
                    to={`/app/currency/new`}>
                    <Button onClick={ this.toggleSidebar.bind(this) } icon='add' floating accent className='add-button' />
                </Link>
                <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
                    <List ripple className='list'>
                        {this.renderCurrencies()}
                    </List>
                </div>
            </div>
        );
    }
}

CurrencyPage.propTypes = {
    currencies: PropTypes.array.isRequired
};

export default createContainer(() => {
    Meteor.subscribe('currencies');

    return {
        currencies: Currencies.find({}).fetch()
    };
}, CurrencyPage);