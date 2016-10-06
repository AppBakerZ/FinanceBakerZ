// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Currencies } from './currencies.js';

export const insert = new ValidatedMethod({
    name: 'currencies.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create currency'
    },
    validate: new SimpleSchema({
        'currency': {
            type: Object
        },
        'currency.name': {
            type: String
        },
        'currency.icon': {
            type: String
        }
    }).validator(),
    run({ currency }) {
        currency.owner = this.userId;
        return Currencies.insert(currency);
    }
});

export const update = new ValidatedMethod({
    name: 'currencies.update',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update currency'
    },
    validate: new SimpleSchema({
        'currency': {
            type: Object
        },
        'currency._id': {
            type: String
        },
        'currency.name': {
            type: String
        },
        'currency.icon': {
            type: String
        }
    }).validator(),
    run({ currency }) {
        const {_id} = currency;
        delete currency._id;
        return Currencies.update(_id, {$set: currency});
    }
});

export const remove = new ValidatedMethod({
    name: 'currencies.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove currency'
    },
    validate: new SimpleSchema({
        'currency': {
            type: Object
        },
        'currency._id': {
            type: String
        }
    }).validator(),
    run({ currency }) {
        const {_id} = currency;
        return Currencies.remove(_id);
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
