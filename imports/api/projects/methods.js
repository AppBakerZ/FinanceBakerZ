// methods related to companies

import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Projects } from './projects.js';

export const insert = new ValidatedMethod({
    name: 'project.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create expense'
    },
    validate: new SimpleSchema({
        'project': {
            type: Object
        },
        'project._id': {
            type: String,
            optional: true
        },
        'project.name': {
            type: String
        },
        'project.type': {
            type: String
        },
        'project.client': {
            type: Object
        },
        'project.client.name': {
            type: String
        },
        'project.status': {
            type: String
        },
        'project.amount': {
            type: Number,
            optional: true
        },
        'project.startAt': {
            type: Date,
            optional: true
        }
    }).validator(),
    run({ project }) {
        if(project._id){
            return Projects.update({_id : project._id}, {$set :project});
        }
        else{
            project.owner = this.userId;
            return Projects.insert(project);
        }
    }
});


export const remove = new ValidatedMethod({
    name: 'project.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove category'
    },
    validate: new SimpleSchema({
        'project' : {
            type: Object
        },
        'project._id' : {
            type: String
        }
    }).validator(),
    run({ project }) {
        console.log('project.remove ..id', project._id);
        return Projects.remove(project._id);
    }
});


const PROJECTS_METHODS = _.pluck([
    insert,
    remove
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(PROJECTS_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}
