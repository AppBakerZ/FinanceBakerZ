// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Accounts } from './accounts.js';

export const insert = new ValidatedMethod({
    name: 'accounts.insert',
    validate: new SimpleSchema({}).validator(),
    run({ }) {


        const account = {
        };

        Accounts.insert(account);
    }
});

// Get list of all method names on Companies
const ACCOUNTS_METHODS = _.pluck([
    insert
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(ACCOUNTS_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}