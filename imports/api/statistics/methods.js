// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Expenses } from '../expences/expenses.js';
import { Incomes } from '../incomes/incomes.js';

export const availableBalance = new ValidatedMethod({
    name: 'statistics.availableBalance',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to get Available Balance'
    },
    validate: new SimpleSchema({
        accounts: {
            type: [String]
        }
    }).validator(),
    run({accounts}) {
        let query = {
          owner: this.userId
        };
        if(accounts.length){
            query['account'] = {$in: accounts}
        }
        const sumOfIncomes = Incomes.aggregate({
            $match: query
        },{
            $group: { _id: null, total: { $sum: '$amount' } }
        });

        const sumOfExpenses = Expenses.aggregate({
            $match: query
        },{
            $group: { _id: null, total: { $sum: '$amount' } }
        });
        return sumOfIncomes[0].total - sumOfExpenses[0].total;
    }
});

export const totalIncomesAndExpenses = new ValidatedMethod({
    name: 'statistics.totalIncomesAndExpenses',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to get total Incomes and Expenses'
    },
    validate: new SimpleSchema({
        accounts: {
            type: [String]
        },
        date: {
            type: Object
        },
        'date.start': {
            type: String
        },
        'date.end': {
            type: String
        }
    }).validator(),
    run({accounts, date}) {
        let query = {
            owner: this.userId
        };
        if(accounts.length){
            query['account'] = {$in: accounts}
        }
        if(date){
            query['receivedAt'] = {
                $gte: new Date(date.start),
                $lte: new Date(date.end)
            };
        }
        const sumOfIncomes = Incomes.aggregate({
            $match: query
        },{
            $group: { _id: null, total: { $sum: '$amount' } }
        });

        query.spentAt = query.receivedAt;
        delete query.receivedAt;

        const sumOfExpenses = Expenses.aggregate({
            $match: query
        },{
            $group: { _id: null, total: { $sum: '$amount' } }
        });

        return {
            incomes: sumOfIncomes.length ? sumOfIncomes[0].total : 0,
            expenses: sumOfExpenses.length ? sumOfExpenses[0].total : 0
        };
    }
});


const EXPENSES_METHODS = _.pluck([
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(EXPENSES_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}
