import { Meteor } from 'meteor/meteor';
import { Categories } from '../categories.js';

Meteor.publish('categories', function () {
   var category = [];
   if(this.userId) {
       category = Meteor.users.findOne({_id: this.userId}).excluded_categories || [];
   }

    return Categories.find({
        _id: {$nin: category}, $or: [ {owner: this.userId}, {owner: { $exists: false } } ]
    }, {sort: {createdAt: 1}});
});

Meteor.publish('categories.single', function (id) {
    return Categories.find({
        owner: this.userId,
        _id: id
    });
});