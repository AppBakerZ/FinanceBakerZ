import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Dropdown } from 'react-toolbox';

export default class FilterBy extends Component {

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
    selectFilter (type) {
        this.setState({type});
        this.props.getFilter(type)
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
                value={this.state.filterBy}
                template={this.filterItem}
            />
        );
    }
}