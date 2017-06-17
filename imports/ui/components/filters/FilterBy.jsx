import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Dropdown } from 'react-toolbox';

class FilterBy extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filterBy: ''
        };
    }
    filters(){
        return [{
                name: 'All',
                value: ''
        }, {
                name: 'Day',
                value: 'day'
        }, {
                name: 'Week',
                value: 'week'
        }];
    }
    selectFilter (filter) {
        updateFilter('reports', 'filter', filter)
    }
    filterItem (filter) {
        return (
            <div>
                <strong>{filter.name}</strong>
            </div>
        );
    }
    render() {
        return (
            <Dropdown
                auto={false}
                source={this.filters()}
                name='filterBy'
                onChange={this.selectFilter.bind(this)}
                label='Filter By'
                value={this.props.local.filter}
                template={this.filterItem}
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
}, FilterBy);