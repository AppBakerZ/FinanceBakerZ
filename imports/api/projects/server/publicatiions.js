import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.publish('projects.all', function(){
    return Projects.find(
        {
            owner: this.userId
        }, {fields: {name: 1}});
});

Meteor.publish('projects.single', function (id) {
    return Projects.find({
        owner: this.userId,
        _id: id
    });
});