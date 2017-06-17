import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '/imports/startup/client';

LocalCollection = new Meteor.Collection(null);
LocalCollection.insert({
    name: 'reports',
    accounts: [],
    categories: [],
    projects: [],
    type: 'both',
    filter: 'month'
});

updateFilter = function (name, key, value){
    const records = LocalCollection.find({name}).fetch();
    if(records.length){
        LocalCollection.update({name}, {$set: {
            [key]: value
        }})
    }
};