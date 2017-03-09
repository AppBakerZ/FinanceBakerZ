// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { Accounts } from '../../api/accounts/accounts.js';
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
        },
        'category.parent': {
            type: String,
            optional: true
        }
    }).validator(),
    run({ category }) {
        // Set Owner of category
        category.owner = this.userId;
        // Add as children to parent if parent is set ?
        if(category.parent)
            Categories.update({name: category.parent, owner: this.userId}, {$addToSet : {children: category.name}});
        // Insert as new category
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
        },
        'category.parent': {
            type: String,
            optional: true
        }
    }).validator(),
    run({ category }) {
        const {_id, name, icon, parent} = category;
        const oldCategory = Categories.findOne(_id);

        if(oldCategory.parent != parent || oldCategory.name != name){
            Categories.update({name: oldCategory.parent, owner: this.userId}, {$pull: {children: oldCategory.name}});
            Categories.update({name: parent, owner: this.userId}, {$addToSet : {children: name}});
        }

        return Categories.update({_id, owner: this.userId}, {$set: {name, icon, parent}});
    }
});

export const removeFromParent = new ValidatedMethod({
    name: 'categories.removeFromParent',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove category'
    },
    validate: new SimpleSchema({
        'category': {
            type: Object
        },
        'category.name': {
            type: String
        }
    }).validator(),
    run({ category }) {
        const {name} = category;
        Categories.update({name: name, owner: this.userId}, {$set: {parent: null}});
        Categories.update({children: name, owner: this.userId}, {$pull: {children: name}});
    }
});



export const removeDefaultCategories = new ValidatedMethod({
    name: 'categories.removeDefault',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove category'
    },
    validate: new SimpleSchema({
        'category': {
            type: Object
        },
        'category.name': {
            type: String
        }
    }).validator(),
    run({ category }) {
        const {name} = category;

        let parent = Categories.findOne({name: name, owner: {$exists: false}}),
            children = Categories.find({parent: name, owner: {$exists: false}}).fetch(),
            categoryIds = _.pluck(children, "_id");

        categoryIds.push(parent._id);

        Meteor.users.update({ _id: this.userId }, { $addToSet: {excluded_categories: { $each: categoryIds } }});
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
        },
        'category.name': {
            type: String
        },
        'category.parent': {
            type: String,
            optional: true
        }
    }).validator(),
    run({ category }) {
        const {_id, parent, name} = category;

        if(parent){
            Categories.update({name: parent, owner: this.userId}, {$pull: {children: name}});
        }

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
