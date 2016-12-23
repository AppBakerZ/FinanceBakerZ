// methods related to companies

import { Meteor } from 'meteor/meteor';
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
        }
    }).validator(),
    run({ project }) {
        project.owner = this.userId;
        return Projects.insert(project);
    }
});


const PROJECTS_METHODS = _.pluck([
    insert
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
