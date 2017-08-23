import { Meteor } from 'meteor/meteor';
import { Reports } from '../reports.js';

Meteor.publish('reports', function () {
    return [
        new Counter('reportsExists', Reports.find(
            {
                owner: this.userId
            })),
        Reports.find(
            {
                owner: this.userId
            },
            {sort: {createdAt: 1}})

    ];
});

Meteor.publish('reports.single', function (id) {
    return Reports.find({
        owner: this.userId,
        _id: id
    });
});