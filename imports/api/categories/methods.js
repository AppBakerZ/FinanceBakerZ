// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Categories } from './categories.js';

export const insert = new ValidatedMethod({
    name: 'categories.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create category'
    },
    validate: new SimpleSchema({
        'category': {
            type: Object
        },
        'category.name': {
            type: String
        },
        'category.icon': {
            type: String
        }
    }).validator(),
    run({ category }) {
        category.owner = this.userId;
        return Categories.insert(category);
    }
});

export const update = new ValidatedMethod({
    name: 'categories.update',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update category'
    },
    validate: new SimpleSchema({
        'category': {
            type: Object
        },
        'category._id': {
            type: String
        },
        'category.name': {
            type: String
        },
        'category.icon': {
            type: String
        }
    }).validator(),
    run({ category }) {
        const {_id} = category;
        delete category._id;
        return Categories.update(_id, {$set: category});
    }
});

export const remove = new ValidatedMethod({
    name: 'categories.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove category'
    },
    validate: new SimpleSchema({
        'category': {
            type: Object
        },
        'category._id': {
            type: String
        }
    }).validator(),
    run({ category }) {
        const {_id} = category;
        return Categories.remove(_id);
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
