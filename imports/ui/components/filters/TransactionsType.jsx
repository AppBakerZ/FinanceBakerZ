import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Dropdown } from 'react-toolbox';

export default class TransactionsType extends Component {

    constructor(props) {
        super(props);

        this.state = {
            type: ''
        };
    }
    types(){
        return [{
                name: 'Both',
                value: ''
        }, {
                name: 'Incomes',
                value: 'incomes'
        }, {
                name: 'Expenses',
                value: 'expenses'
        }];
    }
    selectType (type) {
        this.setState({type});
        this.props.getType(type)
    }
    typeItem (type) {
        return (
            <div>
                <strong>{type.name}</strong>
            </div>
        );
    }
    render() {
        return (
            <Dropdown
                auto={false}
                source={this.types()}
                onChange={this.selectType.bind(this)}
                label='Filter By Type'
                value={this.state.type}
                template={this.typeItem}
            />
        );
    }
}