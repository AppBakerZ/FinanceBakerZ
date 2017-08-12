import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import '/imports/startup/client';

LocalCollection = new Meteor.Collection(null);
LocalCollection.insert({
    name: 'localReports',
    accounts: [],
    categories: [],
    projects: [],
    type: 'both',
    filter: 'range',
    dateFilter: '',
    dateFrom: moment().startOf('month').format(),
    dateTo: moment().startOf('today').format(),
    limit: 10,
    skip: 0
});

LocalCollection.insert({
    name: 'localTransactions',
    accounts: [],
    categories: [],
    projects: [],
    type: 'both',
    filter: 'range',
    dateFilter: '',
    dateFrom: moment().startOf('month').format(),
    dateTo: moment().startOf('today').format(),
    limit: 10,
    skip: 0
});

LocalCollection.insert({
    name: 'localProjects',
    projectName : '',
    client : {
        name: ''
    },
    type : '',
    status : '',
    limit: 10,
    skip: 0
});

updateFilter = function (name, key, value){
    const records = LocalCollection.find({name}).fetch();
    if(records.length){
        LocalCollection.update({name}, {$set: {
            [key]: value
        }})
    }
};