import { Meteor } from 'meteor/meteor';
import { Accounts } from '../accounts.js';

Meteor.publish('accounts', function () {
    return Accounts.find({});
});