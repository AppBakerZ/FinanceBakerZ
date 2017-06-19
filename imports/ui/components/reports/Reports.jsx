import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { } from 'react-toolbox';
import FilterBar from '/imports/ui/components/filters/FilterBar.jsx';

import { Meteor } from 'meteor/meteor';

import theme from './theme';

class ReportsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }
    render() {
        return (
            <div className={theme.reports}>
                <FilterBar />
            </div>
        );
    }
}

export default createContainer(() => {
    return {
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, ReportsPage);