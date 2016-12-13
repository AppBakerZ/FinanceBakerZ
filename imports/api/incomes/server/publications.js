import { Meteor } from 'meteor/meteor';
import { Incomes } from '../incomes.js';

Meteor.publish('incomes', function () {
    return Incomes.find({
        owner: this.userId
    }, {sort: {receivedAt: -1}});
});

Meteor.publish('incomes.single', function (id) {
    return Incomes.find({
        owner: this.userId,
        _id: id
    });
});