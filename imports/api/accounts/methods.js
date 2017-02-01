// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Accounts } from './accounts.js';

export const insert = new ValidatedMethod({
    name: 'accounts.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create account'
    },
    validate: new SimpleSchema({
        'account': {
            type: Object
        },
        'account.name': {
            type: String
        },
        'account.purpose': {
            type: String
        },
        'account.icon': {
            type: String
        }
    }).validator(),
    run({ account }) {
        account.owner = this.userId;
        return Accounts.insert(account);
    }
});

export const update = new ValidatedMethod({
    name: 'accounts.update',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update account'
    },
    validate: new SimpleSchema({
        'account': {
            type: Object
        },
        'account._id': {
            type: String
        },
        'account.name': {
            type: String
        },
        'account.purpose': {
            type: String
        },
        'account.icon': {
            type: String
        }
    }).validator(),
    run({ account }) {
        const {_id} = account;
        delete account._id;
        return Accounts.update(_id, {$set: account});
    }
});


export const remove = new ValidatedMethod({
    name: 'accounts.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove account'
    },
    validate: new SimpleSchema({
        'account': {
            type: Object
        },
        'account._id': {
            type: String
        }
    }).validator(),
    run({ account }) {
        const {_id} = account;
        if (Accounts.find({owner: Meteor.userId()}).fetch().length > 1) {
            return Accounts.remove(_id);
        }
        else {
            throw new Meteor.Error(500, 'Invalid action! Single account is mandatory,You cant remove it.');
        }
    }
});



export const insertAccountOnSignUp = new ValidatedMethod({
    name: 'insertAccountOnSignUp',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update account'
    },
    validate: new SimpleSchema({
        'account': {
            type: Object
        },
        'account.owner': {
            type: String
        }
    }).validator(),
    run({ account }) {
        Accounts.insert({owner :account.owner, name: 'Default', purpose: 'Bank Account', icon: 'abc' });
    }
});



export const insertAccountOnLogin = new ValidatedMethod({
    name: 'insertAccountOnLogin',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update account'
    },
    validate: new SimpleSchema({
        'account': {
            type: Object
        },
        'account.owner': {
            type: String
        }
    }).validator(),
    run({ account }) {
        if(!Accounts.findOne({owner: account.owner}))
            Accounts.insert({owner :account.owner, name: 'Default', purpose: 'Bank Account', icon:'abc' });
    }
});



export const insertDefaultCurrency = new ValidatedMethod({
    name: 'insertDefaultCurrency',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update account'
    },
    validate: new SimpleSchema({
        'account': {
            type: Object
        },
        'account.owner': {
            type: String
        }
    }).validator(),
    run({ account }) {
        if(Meteor.users.findOne( {_id: account.owner, 'profile.currency': { $exists: false } }))
            Meteor.users.update({ _id: account.owner}, { $set: { 'profile.currency': {symbol: "$", name: "Dollar", symbol_native: "$", decimal_digits: 2, rounding: 0}  }});

    }
});


// Get list of all method names on Companies
const ACCOUNTS_METHODS = _.pluck([
    insert,
    update,
    remove
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