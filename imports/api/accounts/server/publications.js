import { Meteor } from 'meteor/meteor';
import { Accounts } from '../accounts.js';

Meteor.publish('accounts', function () {
    return Accounts.find({}, {sort: {}});
});

Meteor.publish('accounts.single', function (id) {
    return Accounts.find({_id: id});
});