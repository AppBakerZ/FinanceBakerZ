import { Meteor } from 'meteor/meteor';
import { Expenses } from '../expenses.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.publish('expenses', function(limit){
    new SimpleSchema({
        limit: {type: Number}
    }).validate({limit});
    return Expenses.find({owner: this.userId}, {limit: limit});
});

Meteor.publish('expenses.single', function (id) {
    return Expenses.find({
        owner: this.userId,
        _id: id
    });
});