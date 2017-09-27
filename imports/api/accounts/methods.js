// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Accounts } from './accounts.js';
import { Categories } from '../categories/categories.js';
import { Transactions } from '../transactions/transactions.js'

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
        'account.country': {
            type: String
        },
        'account.number': {
            type: String,
            optional: true
        },
        'account.bank': {
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
        'account.country': {
            type: String
        },
        'account.number': {
            type: String,
            optional: true
        },
        'account.bank': {
            type: String
        }
    }).validator(),
    run({ account }) {
        const {_id} = account;
        delete account._id;

        let oldAccount = Accounts.findOne({_id});
        //update fields in linked transactions
        let update = {$set:{}}, linkedDocUpdate = false;
        if(oldAccount.bank !== account.bank){
            linkedDocUpdate = true;
            update.$set['account.bank'] = account.bank
        }
        //so if core fields changed then
        if(linkedDocUpdate){
            Transactions.update({'account._id': _id}, update, {multi: true})
        }
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
        if (!(Accounts.find({owner: Meteor.userId()}).fetch().length > 1)) {
            throw new Meteor.Error(500, 'Invalid action! Single account is mandatory,You cant remove it.');
        }
        else if(Transactions.findOne({'account._id': account._id})){
            throw new Meteor.Error(500, 'Invalid action! some transactions found within account, please update them with New Account.');
        }
        return Accounts.remove(_id);
    }
});



export const profileAssets = new ValidatedMethod({
    name: 'profileAssets',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to insert account,currency and see email notification'
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
            Accounts.insert({owner: account.owner, bank: 'bank-Default', country: 'PK', purpose: 'Bank Account', icon: 'abc' });

        if(Meteor.users.findOne( {_id: account.owner, 'profile.currency': { $exists: false } }))
            Meteor.users.update({ _id: account.owner}, { $set: { 'profile.currency': {symbol: "$", name: "Dollar", symbol_native: "$", decimal_digits: 2, rounding: 0}  }});

        if(Meteor.users.findOne( {_id: account.owner, 'profile.emailNotificaton': { $exists: false } }))
            Meteor.users.update({ _id: account.owner}, { $set: { 'profile.emailNotification': true}});
    }
});



export const emailNotificaton = new ValidatedMethod({
    name: 'emailNotificaton',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to see email notification'
    },
    validate: new SimpleSchema({
        'account': {
            type: Object
        },
        'account.owner': {
            type: String
        },
        'account.check2': {
            type: Boolean
        }
    }).validator(),
    run({ account }) {
        Meteor.users.update({ _id: account.owner}, { $set: { 'profile.emailNotification': account.check2}});

    }
});



export const userRemove = new ValidatedMethod({
    name: 'userRemove',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove account'
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
        const {owner} = account;
         Accounts.remove({owner: owner});
         Categories.remove({owner: owner});
         Transactions.remove({owner: owner});
         Meteor.users.remove({_id: owner});
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