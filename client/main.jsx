import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import moment from 'moment';

import '/imports/startup/client';

LocalCollection = new Meteor.Collection(null);
LocalCollection.insert({
    name: 'reports',
    accounts: [],
    categories: [],
    projects: [],
    type: 'both',
    filter: 'range',
    dateFilter: '',
    dateFrom: moment().subtract(1, 'months').startOf('month').format(),
    dateTo: moment().startOf('today').format()
});

updateFilter = function (name, key, value){
    const records = LocalCollection.find({name}).fetch();
    if(records.length){
        LocalCollection.update({name}, {$set: {
            [key]: value
        }})
    }
};