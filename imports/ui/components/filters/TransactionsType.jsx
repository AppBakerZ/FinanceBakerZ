import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Dropdown } from 'react-toolbox';

class TransactionsType extends Component {

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
        updateFilter('reports', 'type', type)
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
                value={this.props.local.type}
                template={this.typeItem}
            />
        );
    }
}

export default createContainer(() => {
    return {
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, TransactionsType);