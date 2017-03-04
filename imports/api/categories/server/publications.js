import { Meteor } from 'meteor/meteor';
import { Categories } from '../categories.js';

Meteor.publish('categories', function () {
    return Categories.find({
        owner: this.userId
    }, {sort: {createdAt: 1}});
});

Meteor.publish('categories.single', function (id) {
    return Categories.find({
        owner: this.userId,
        _id: id
    });
});