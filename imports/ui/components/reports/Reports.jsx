import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Button, Table, FontIcon, Autocomplete, Dropdown, DatePicker, Dialog, Input } from 'react-toolbox';
import { Link } from 'react-router'
import Arrow from '/imports/ui/components/arrow/Arrow.jsx';

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'

class ReportsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    runTest(){

    }

    render() {
        return (
            <div className='reports'>
                <button onClick={this.runTest.bind(this)}>Test</button>
            </div>
        );
    }
}

ReportsPage.propTypes = {};

export default createContainer(() => {
    return {};
}, ReportsPage);