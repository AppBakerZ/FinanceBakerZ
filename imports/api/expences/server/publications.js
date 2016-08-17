import { Meteor } from 'meteor/meteor';
import { Expenses } from '../expenses.js';

Meteor.publish('expenses', function () {
    return Expenses.find({
        owner: this.userId
    }, {sort: {}});
});

Meteor.publish('expenses.single', function (id) {
    return Expenses.find({
        owner: this.userId,
        _id: id
    });
});