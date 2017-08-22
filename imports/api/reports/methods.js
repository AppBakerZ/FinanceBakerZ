// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Reports } from './reports.js';

export const insert = new ValidatedMethod({
    name: 'reports.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create report'
    },
    validate: new SimpleSchema({
        'report': {
            type: Object
        },
    }).validator(),
    run({ report }) {
        // Set Owner of report
        report.owner = this.userId;
    }
});



export const remove = new ValidatedMethod({
    name: 'reports.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove report'
    },
    validate: new SimpleSchema({
        'report': {
            type: Object
        },
        'report._id': {
            type: String
        },
    }).validator(),
    run({ report }) {
        const { _id } = report;

        return Reports.remove(_id);
    }
});

const REPORTS_METHODS = _.pluck([
    insert,
    remove
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(REPORTS_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}
