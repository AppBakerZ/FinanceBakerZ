import { Meteor } from 'meteor/meteor';
import { Accounts } from '../accounts.js';

Meteor.publish('accounts', function () {
    return Accounts.find({
        owner: this.userId
    }, {sort: {}});
});

Meteor.publish('accounts.single', function (id) {
    return Accounts.find({
        owner: this.userId,
        _id: id
    });
});