// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Transactions } from './transactions.js';
import { Projects } from '../projects/projects.js';

export const insert = new ValidatedMethod({
    name: 'transactions.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create transaction'
    },
    validate: new SimpleSchema({
        'transaction': {
            type: Object
        },
        'transaction.account': {
            type: String
        },
        'transaction.amount': {
            type: Number
        },
        'transaction.transactionAt': {
            type: Date
        },
        'transaction.type': {
            type: String
        },
        'transaction.creditType': {
            type: String,
            optional: true
        },
        'transaction.project': {
            type: Object,
            optional: true
        },
        'transaction.project._id': {
            type: String,
            optional: true
        }
    }).validator(),
    run({ transaction }) {
        if(transaction.project) {
            transaction.owner = this.userId;
            transaction.project._id && (transaction.project.name = Projects.findOne(transaction.project._id).name);
        }
        return Transactions.insert(transaction);
    }
});

export const update = new ValidatedMethod({
    name: 'transactions.update',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update transaction'
    },
    validate: new SimpleSchema({
        'transaction': {
            type: Object
        },
        'transaction._id': {
            type: String
        },
        'transaction.account': {
            type: String
        },
        'transaction.amount': {
            type: Number
        },
        'transaction.transactionAt': {
            type: Date
        },
        'transaction.type': {
            type: String
        },
        'transaction.creditType': {
            type: String,
            optional: true
        },
        'transaction.project': {
            type: Object,
            optional: true
        },
        'transaction.project._id': {
            type: String,
            optional: true
        },
        'transaction.category': {
            type: Object,
            optional: true
        },
        'transaction.category._id': {
            type: String,
            optional: true
        },
        'transaction.billUrl': {
            type: String,
            optional: true
        },
        'transaction.description': {
            type: String,
            optional: true
        }
    }).validator(),
    run({ transaction }) {
        const {_id} = transaction;
        delete transaction._id;
        transaction.project._id && (transaction.project.name = Projects.findOne(transaction.project._id).name);
        return Transactions.update(_id, {$set: transaction});
    }
});

export const remove = new ValidatedMethod({
    name: 'transactions.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove transaction'
    },
    validate: new SimpleSchema({
        'transaction': {
            type: Object
        },
        'transaction._id': {
            type: String
        }
    }).validator(),
    run({ transaction }) {
        const {_id} = transaction;
        return Transactions.remove(_id);
    }
});

const TRANSACTIONS_METHODS = _.pluck([
    insert,
    update,
    remove
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(TRANSACTIONS_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}
