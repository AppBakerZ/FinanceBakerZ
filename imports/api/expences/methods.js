// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Expenses } from './expenses.js';

export const insert = new ValidatedMethod({
    name: 'expenses.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create expense'
    },
    validate: new SimpleSchema({
        'expense': {
            type: Object
        },
        'expense.account': {
            type: String
        },
        'expense.amount': {
            type: Number
        },
        'expense.purpose': {
            type: String
        },
        'expense.description': {
            type: String
        },
        'expense.createdAt': {
            type: Date
        }
    }).validator(),
    run({ expense }) {
        expense.owner = this.userId;
        return Expenses.insert(expense);
    }
});

export const update = new ValidatedMethod({
    name: 'expenses.update',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update expense'
    },
    validate: new SimpleSchema({
        'expense': {
            type: Object
        },
        'expense._id': {
            type: String
        },
        'expense.account': {
            type: String
        },
        'expense.amount': {
            type: Number
        },
        'expense.purpose': {
            type: String
        },
        'expense.description': {
            type: String
        },
        'expense.createdAt': {
            type: Date
        }
    }).validator(),
    run({ expense }) {
        const {_id} = expense;
        delete expense._id;
        return Expenses.update(_id, {$set: expense});
    }
});

export const remove = new ValidatedMethod({
    name: 'expenses.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove expense'
    },
    validate: new SimpleSchema({
        'expense': {
            type: Object
        },
        'expense._id': {
            type: String
        }
    }).validator(),
    run({ expense }) {
        const {_id} = expense;
        return Expenses.remove(_id);
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