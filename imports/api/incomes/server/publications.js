import { Meteor } from 'meteor/meteor';
import { Incomes } from '../incomes.js';

Meteor.publish('incomes', function (limit) {
    new SimpleSchema({
        limit: {type: Number}
    }).validate({limit});

    return Incomes.find({
        owner: this.userId
    }, {limit: limit, sort: {receivedAt: -1}});
});

Meteor.publish('incomes.single', function (id) {
    return Incomes.find({
        owner: this.userId,
        _id: id
    });
});