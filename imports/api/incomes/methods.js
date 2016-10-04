// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Incomes } from './incomes.js';

export const insert = new ValidatedMethod({
    name: 'incomes.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create income'
    },
    validate: new SimpleSchema({
        'income': {
            type: Object
        },
        'income.account': {
            type: String
        },
        'income.amount': {
            type: Number
        },
        'income.receivedAt': {
            type: Date
        },
        'income.type': {
            type: String
        },
        'income.project': {
            type: String
        }
    }).validator(),
    run({ income }) {
        income.owner = this.userId;
        return Incomes.insert(income);
    }
});

export const update = new ValidatedMethod({
    name: 'incomes.update',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update income'
    },
    validate: new SimpleSchema({
        'income': {
            type: Object
        },
        'income._id': {
            type: String
        },
        'income.account': {
            type: String
        },
        'income.amount': {
            type: Number
        },
        'income.receivedAt': {
            type: Date
        },
        'income.type': {
            type: String
        },
        'income.project': {
            type: String
        }
    }).validator(),
    run({ income }) {
        const {_id} = income;
        delete income._id;
        return Incomes.update(_id, {$set: income});
    }
});

export const remove = new ValidatedMethod({
    name: 'incomes.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove income'
    },
    validate: new SimpleSchema({
        'income': {
            type: Object
        },
        'income._id': {
            type: String
        }
    }).validator(),
    run({ income }) {
        const {_id} = income;
        return Incomes.remove(_id);
    }
});

const INCOMES_METHODS = _.pluck([
    insert,
    update,
    remove
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(INCOMES_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}
