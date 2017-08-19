import { Meteor } from 'meteor/meteor';
import { Categories } from '../categories.js';

Meteor.publish('categories', function () {
    return [
        new Counter('categoriesExists', Categories.find(
            {
                owner: this.userId
            })),
        Categories.find(
            {
                owner: this.userId
            },
            {sort: {createdAt: 1}})

    ];
});

Meteor.publish('categories.single', function (id) {
    return Categories.find({
        owner: this.userId,
        _id: id
    });
});