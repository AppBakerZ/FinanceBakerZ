import { Meteor } from 'meteor/meteor';
import { Currencies } from '../currencies.js';

Meteor.publish('currencies', function () {
    return Currencies.find({
        owner: this.userId
    }, {sort: {createdAt: 1}});
});

Meteor.publish('currencies.single', function (id) {
    return Currencies.find({
        owner: this.userId,
        _id: id
    });
});